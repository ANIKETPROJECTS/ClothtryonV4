import React, { useRef, useEffect, useState, useCallback } from "react";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-webgl";
import * as poseDetection from "@tensorflow-models/pose-detection";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, X, RefreshCw, AlertCircle } from "lucide-react";
import { TSHIRT_CONFIG } from "@/lib/tshirt-config";

interface VirtualTryOnProps {
  onClose: () => void;
  productImage: string;
}

type Pose = poseDetection.Pose;
type Keypoint = poseDetection.Keypoint;

export function VirtualTryOn({ onClose }: VirtualTryOnProps) {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [model, setModel] = useState<poseDetection.PoseDetector | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState({ fps: 0, confidence: 0 });
  const [currentView, setCurrentView] = useState<'front' | 'back' | 'left' | 'right'>('front');
  
  const shirtImages = useRef<{ [key: string]: HTMLImageElement }>({});

  useEffect(() => {
    const loadModel = async () => {
      try {
        await tf.ready();
        const detectorConfig: poseDetection.MoveNetModelConfig = {
          modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
          enableSmoothing: true
        };
        const detector = await poseDetection.createDetector(
          poseDetection.SupportedModels.MoveNet,
          detectorConfig
        );
        setModel(detector);
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to load pose model:", err);
        setError("Failed to initialize VTO engine. Please try again.");
        setIsLoading(false);
      }
    };

    const preloadImages = () => {
      Object.entries(TSHIRT_CONFIG.images).forEach(([key, src]) => {
        const img = new Image();
        img.src = src;
        shirtImages.current[key] = img;
      });
    };

    loadModel();
    preloadImages();
  }, []);

  const detect = useCallback(async () => {
    if (
      webcamRef.current?.video?.readyState === 4 &&
      model &&
      canvasRef.current
    ) {
      const video = webcamRef.current.video;
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      if (canvasRef.current.width !== videoWidth || canvasRef.current.height !== videoHeight) {
        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;
      }

      const start = performance.now();
      const poses = await model.estimatePoses(video, { flipHorizontal: false });
      const end = performance.now();
      const fps = 1000 / (end - start);

      if (poses && poses.length > 0) {
        const pose = poses[0];
        setMetrics({ 
          fps: Math.round(fps), 
          confidence: Math.round((pose.score || 0) * 100) 
        });
        drawCanvas(pose, videoWidth, videoHeight, canvasRef.current);
      } else {
        const ctx = canvasRef.current.getContext("2d");
        if (ctx) ctx.clearRect(0, 0, videoWidth, videoHeight);
        setMetrics(prev => ({ ...prev, fps: Math.round(fps), confidence: 0 }));
      }
    }
  }, [model, currentView]);

  useEffect(() => {
    let animationFrameId: number;
    let isRunning = true;

    const loop = async () => {
      if (!isRunning) return;
      await detect();
      animationFrameId = requestAnimationFrame(loop);
    };

    if (!isLoading && model) {
      loop();
    }

    return () => {
      isRunning = false;
      cancelAnimationFrame(animationFrameId);
    };
  }, [detect, isLoading, model]);

  const drawCanvas = (pose: Pose, width: number, height: number, canvas: HTMLCanvasElement | null) => {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    const keypoints = pose.keypoints;
    const leftShoulder = keypoints.find((k) => k.name === "left_shoulder");
    const rightShoulder = keypoints.find((k) => k.name === "right_shoulder");
    const leftHip = keypoints.find((k) => k.name === "left_hip");
    const rightHip = keypoints.find((k) => k.name === "right_hip");
    const nose = keypoints.find((k) => k.name === "nose");
    const leftEye = keypoints.find((k) => k.name === "left_eye");
    const rightEye = keypoints.find((k) => k.name === "right_eye");
    const leftEar = keypoints.find((k) => k.name === "left_ear");
    const rightEar = keypoints.find((k) => k.name === "right_ear");

    const minConfidence = 0.35;
    if (
      leftShoulder && leftShoulder.score! > minConfidence &&
      rightShoulder && rightShoulder.score! > minConfidence
    ) {
      // Orientation Detection logic
      const hasNose = nose && nose.score! > 0.3;
      const facePointsCount = [hasNose, leftEye?.score! > 0.3, rightEye?.score! > 0.3].filter(Boolean).length;
      const earPointsCount = [leftEar?.score! > 0.3, rightEar?.score! > 0.3].filter(Boolean).length;

      let detectedView: 'front' | 'back' | 'left' | 'right' = 'front';
      if (facePointsCount >= 1 || earPointsCount >= 1) { 
        const shoulderCenterX = (leftShoulder.x + rightShoulder.x) / 2;
        const shoulderWidth = Math.abs(rightShoulder.x - leftShoulder.x);
        
        if (hasNose) {
          const noseOffset = (nose.x - shoulderCenterX) / (shoulderWidth / 2);
          if (noseOffset > 0.6) detectedView = 'right';
          else if (noseOffset < -0.6) detectedView = 'left';
          else detectedView = 'front';
        } else if (facePointsCount >= 1) {
          detectedView = 'front';
        } else if (earPointsCount === 1) {
          detectedView = leftEar?.score! > rightEar?.score! ? 'left' : 'right';
        } else {
          detectedView = 'front';
        }
      } else {
        detectedView = 'back';
      }

      if (detectedView !== currentView) {
        setCurrentView(detectedView);
      }

      // Draw tracking lines for body only
      drawTrackingOverlay(ctx, keypoints);

      // Select Image
      const shirtImg = shirtImages.current[currentView];
      if (shirtImg) {
        const shoulderCenterX = (leftShoulder.x + rightShoulder.x) / 2;
        const shoulderCenterY = (leftShoulder.y + rightShoulder.y) / 2;
        const hipCenterX = (leftHip.x + rightHip.x) / 2;
        const hipCenterY = (leftHip.y + rightHip.y) / 2;

        // Calculate a stable shoulder width to prevent shrinking in profile/side views
        const shoulderWidth = Math.abs(rightShoulder.x - leftShoulder.x);
        const torsoHeight = Math.abs(hipCenterY - shoulderCenterY);

        // Maintain a minimum width based on the video width to prevent "shrinking" when turning
        const minShoulderWidth = width * 0.4;
        const stableWidth = Math.max(shoulderWidth, minShoulderWidth);

        // Use a uniform scale to prevent stretching and keep the T-shirt "normal"
        // We'll base it on the width and apply the same to height
        const scale = (stableWidth * 2.1) / shirtImg.width;

        // Set angle to 0 for a fixed, straight T-shirt
        const angle = 0;

        ctx.save();
        // Anchor to shoulder center
        ctx.translate(shoulderCenterX, shoulderCenterY);
        ctx.rotate(angle);
        
        ctx.scale(scale, scale);

        // Position adjustment: Shift T-shirt upwards
        // -0.25 moves it up significantly from the shoulder line anchor
        ctx.drawImage(
          shirtImg, 
          -shirtImg.width / 2, 
          -shirtImg.height * 0.25
        );

        ctx.restore();
      }
    }
  };

  const drawTrackingOverlay = (ctx: CanvasRenderingContext2D, keypoints: Keypoint[]) => {
    const points = ["left_shoulder", "right_shoulder", "left_hip", "right_hip", "left_elbow", "right_elbow", "left_wrist", "right_wrist"];
    const found = points.map(name => keypoints.find(k => k.name === name));
    
    // Bright Green (#00FF00) for maximum visibility as requested
    ctx.strokeStyle = "#00FF00";
    ctx.lineWidth = 4;
    ctx.lineCap = "round";

    const [ls, rs, lh, rh, le, re, lw, rw] = found;

    const drawLine = (p1?: Keypoint, p2?: Keypoint) => {
      if (p1?.score! > 0.3 && p2?.score! > 0.3) {
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    };

    drawLine(ls, rs); // shoulders
    drawLine(ls, lh); // left torso
    drawLine(rs, rh); // right torso
    drawLine(lh, rh); // hips
    drawLine(ls, le); drawLine(le, lw); // left arm
    drawLine(rs, re); drawLine(re, rw); // right arm
  };

  const capturePhoto = () => {
    if (canvasRef.current && webcamRef.current?.video) {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvasRef.current.width;
      tempCanvas.height = canvasRef.current.height;
      const ctx = tempCanvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(webcamRef.current.video, 0, 0);
        ctx.drawImage(canvasRef.current, 0, 0);
        const link = document.createElement('a');
        link.download = `onyu-vto-${Date.now()}.png`;
        link.href = tempCanvas.toDataURL();
        link.click();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center">
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
          <span className="text-white font-mono text-xs uppercase tracking-widest">Live Feed</span>
        </div>
        <button onClick={onClose} className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-md transition-all">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="relative w-full h-full flex items-center justify-center bg-neutral-900 overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-50 bg-neutral-900">
            <RefreshCw className="w-10 h-10 animate-spin text-primary mb-4" />
            <h3 className="text-xl font-display font-bold">Initializing VTO Engine</h3>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-50 bg-neutral-900">
            <AlertCircle className="w-12 h-12 text-destructive mb-4" />
            <h3 className="text-xl font-bold">Error</h3>
            <p className="text-neutral-400 mt-2">{error}</p>
            <button onClick={onClose} className="mt-6 px-6 py-2 bg-white text-black font-bold rounded-full">Close</button>
          </div>
        )}

        <Webcam ref={webcamRef} audio={false} className="absolute inset-0 w-full h-full object-cover" mirrored={true} />
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover pointer-events-none transform -scale-x-100" />

        <div className="absolute bottom-12 left-0 right-0 flex justify-center items-center z-20">
          <button onClick={capturePhoto} className="group relative flex items-center justify-center w-20 h-20 rounded-full bg-white text-black shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-110 transition-transform">
            <Camera className="w-8 h-8" />
          </button>
        </div>

        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-20 px-4 py-2 bg-black/50 backdrop-blur-md rounded-full border border-white/10 text-[10px] text-white/50 uppercase tracking-[0.2em]">
          Mode: <span className="text-primary font-bold">{currentView}</span>
        </div>
      </div>
    </div>
  );
}
