import React, { useRef, useEffect, useState, useCallback } from "react";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-webgl";
import * as poseDetection from "@tensorflow-models/pose-detection";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, X, RefreshCw, Shirt, Scan, AlertCircle } from "lucide-react";
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
  
  // Assets refs
  const shirtImages = useRef<{ [key: string]: HTMLImageElement }>({});

  // Initialize TensorFlow and Load Model
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

    // Preload images
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

  // Main Detection Loop
  const detect = useCallback(async () => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video?.readyState === 4 &&
      model &&
      canvasRef.current
    ) {
      const video = webcamRef.current.video;
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      // Ensure canvas matches video dimensions
      if (canvasRef.current.width !== videoWidth || canvasRef.current.height !== videoHeight) {
        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;
      }

      const start = performance.now();

      // Estimate poses
      const poses = await model.estimatePoses(video, {
        flipHorizontal: false // We handle mirroring via CSS/Webcam component
      });

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
        // Clear canvas if no pose detected
        const ctx = canvasRef.current.getContext("2d");
        if (ctx) ctx.clearRect(0, 0, videoWidth, videoHeight);
        setMetrics(prev => ({ ...prev, fps: Math.round(fps), confidence: 0 }));
      }
    }
  }, [model, currentView]);

  // Request Animation Frame Loop
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

  // Drawing Logic
  const drawCanvas = (pose: Pose, width: number, height: number, canvas: HTMLCanvasElement | null) => {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    // Keypoints
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

    // Only draw if we have high confidence in keypoints
    const minConfidence = 0.4;
    if (
      leftShoulder && leftShoulder.score! > minConfidence &&
      rightShoulder && rightShoulder.score! > minConfidence &&
      leftHip && leftHip.score! > minConfidence &&
      rightHip && rightHip.score! > minConfidence
    ) {
      // Determine Orientation automatically with refined logic
      let detectedView: 'front' | 'back' | 'left' | 'right' = 'front';
      
      const hasNose = nose && nose.score! > 0.6; // Increased threshold
      const hasLeftEye = leftEye && leftEye.score! > 0.6;
      const hasRightEye = rightEye && rightEye.score! > 0.6;
      const hasLeftEar = leftEar && leftEar.score! > 0.6;
      const hasRightEar = rightEar && rightEar.score! > 0.6;
      
      const facePointsCount = [hasNose, hasLeftEye, hasRightEye].filter(Boolean).length;
      const earPointsCount = [hasLeftEar, hasRightEar].filter(Boolean).length;

      // Logic:
      // 1. If any face point is detected, assume it might be front.
      if (facePointsCount >= 1 || earPointsCount >= 1) { 
        const shoulderCenter = (leftShoulder.x + rightShoulder.x) / 2;
        const shoulderWidth = Math.abs(rightShoulder.x - leftShoulder.x);
        
        if (hasNose) {
          const noseX = nose!.x;
          const noseOffset = (noseX - shoulderCenter) / (shoulderWidth / 2);
          
          if (noseOffset > 0.6) detectedView = 'right';
          else if (noseOffset < -0.6) detectedView = 'left';
          else detectedView = 'front';
        } else if (facePointsCount >= 1) {
          detectedView = 'front';
        } else if (earPointsCount === 1) {
          detectedView = hasLeftEar ? 'left' : 'right';
        } else {
          detectedView = 'front';
        }
      } 
      // 2. If no face points at all, it's likely the back
      else {
        detectedView = 'back';
      }

      // Update current view if it changed
      if (detectedView !== currentView) {
        setCurrentView(detectedView);
      }

    // Draw Tracking Lines (Green lines for shoulders, torso, and arms)
    drawTrackingOverlay(ctx, keypoints);

      // Calculate torso center and dimensions
      const shoulderCenterX = (leftShoulder.x + rightShoulder.x) / 2;
      const shoulderCenterY = (leftShoulder.y + rightShoulder.y) / 2;
      
      const hipCenterX = (leftHip.x + rightHip.x) / 2;
      const hipCenterY = (leftHip.y + rightHip.y) / 2;

      // Shoulder width for scaling
      const shoulderWidth = Math.sqrt(
        Math.pow(rightShoulder.x - leftShoulder.x, 2) +
        Math.pow(rightShoulder.y - leftShoulder.y, 2)
      );

      // Torso Height
      const torsoHeight = Math.sqrt(
        Math.pow(hipCenterX - shoulderCenterX, 2) +
        Math.pow(hipCenterY - shoulderCenterY, 2)
      );

      // Angle for rotation
      const angle = Math.atan2(
        rightShoulder.y - leftShoulder.y,
        rightShoulder.x - leftShoulder.x
      );

      // Determine Orientation (Simple logic based on shoulder relative positions)
      // Ideally this would use 3D pose estimation, but for 2D:
      // If shoulder width decreases significantly while height stays same -> turning
      // Here we keep it simple: defaulting to front view mapping for now, 
      // but logic could be added to switch views based on tracking history or user manual switch.
      
      // Select Image
      const shirtImg = shirtImages.current[currentView];

      if (shirtImg) {
        ctx.save();
        
        // Move to center of torso (approximate anchor point)
        // Adjust vertical offset slightly up to cover shoulders properly
        // Anchor at the midpoint between shoulders
        const anchorX = shoulderCenterX;
        const anchorY = shoulderCenterY;

        ctx.translate(anchorX, anchorY);
        
        // Use the angle between shoulders for rotation
        ctx.rotate(angle); 

        // Scale based on shoulder width
        const scale = (shoulderWidth * TSHIRT_CONFIG.calibration.scaleFactor) / shirtImg.width;
        ctx.scale(scale, scale);

        // Draw Image (Centered horizontally, aligned vertically with shoulders)
        // Adjust Y offset: Since the image is being drawn from the center, we need to push it down
        // so the collar sits on the shoulder line. 
        // A vertical offset of 0.35 * height puts the collar roughly at the anchor point.
        ctx.drawImage(
          shirtImg, 
          -shirtImg.width / 2, 
          -shirtImg.height * 0.12 + TSHIRT_CONFIG.calibration.verticalOffset 
        );

        ctx.restore();
      }
    }
  };

  /* Helper to visualize tracking */
  const drawTrackingOverlay = (ctx: CanvasRenderingContext2D, keypoints: Keypoint[]) => {
    const leftShoulder = keypoints.find((k) => k.name === "left_shoulder");
    const rightShoulder = keypoints.find((k) => k.name === "right_shoulder");
    const leftHip = keypoints.find((k) => k.name === "left_hip");
    const rightHip = keypoints.find((k) => k.name === "right_hip");
    const leftElbow = keypoints.find((k) => k.name === "left_elbow");
    const rightElbow = keypoints.find((k) => k.name === "right_elbow");
    const leftWrist = keypoints.find((k) => k.name === "left_wrist");
    const rightWrist = keypoints.find((k) => k.name === "right_wrist");

    ctx.strokeStyle = "#00FF00"; // Bright Green
    ctx.lineWidth = 3;
    ctx.lineCap = "round";

    // Draw Shoulder Line
    if (leftShoulder && rightShoulder && leftShoulder.score! > 0.3 && rightShoulder.score! > 0.3) {
      ctx.beginPath();
      ctx.moveTo(leftShoulder.x, leftShoulder.y);
      ctx.lineTo(rightShoulder.x, rightShoulder.y);
      ctx.stroke();
    }

    // Draw Torso Box
    if (leftShoulder && rightShoulder && leftHip && rightHip && 
        leftShoulder.score! > 0.3 && rightShoulder.score! > 0.3 && 
        leftHip.score! > 0.3 && rightHip.score! > 0.3) {
      ctx.beginPath();
      ctx.moveTo(leftShoulder.x, leftShoulder.y);
      ctx.lineTo(leftHip.x, leftHip.y);
      ctx.lineTo(rightHip.x, rightHip.y);
      ctx.lineTo(rightShoulder.x, rightShoulder.y);
      ctx.closePath();
      ctx.stroke();
    }

    // Draw Arm Lines
    const drawArm = (p1?: Keypoint, p2?: Keypoint, p3?: Keypoint) => {
      if (p1 && p2 && p1.score! > 0.3 && p2.score! > 0.3) {
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
      if (p2 && p3 && p2.score! > 0.3 && p3.score! > 0.3) {
        ctx.beginPath();
        ctx.moveTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.stroke();
      }
    };

    drawArm(leftShoulder, leftElbow, leftWrist);
    drawArm(rightShoulder, rightElbow, rightWrist);

    // Draw Comprehensive Face Mesh (Nose, Eyes, Ears)
    const nose = keypoints.find((k) => k.name === "nose");
    const leftEye = keypoints.find((k) => k.name === "left_eye");
    const rightEye = keypoints.find((k) => k.name === "right_eye");
    const leftEar = keypoints.find((k) => k.name === "left_ear");
    const rightEar = keypoints.find((k) => k.name === "right_ear");

    const faceConfidence = 0.3;
    
    // Draw connections if points are visible
    if (nose && leftEye && nose.score! > faceConfidence && leftEye.score! > faceConfidence) {
      ctx.beginPath();
      ctx.moveTo(nose.x, nose.y);
      ctx.lineTo(leftEye.x, leftEye.y);
      ctx.stroke();
    }
    if (nose && rightEye && nose.score! > faceConfidence && rightEye.score! > faceConfidence) {
      ctx.beginPath();
      ctx.moveTo(nose.x, nose.y);
      ctx.lineTo(rightEye.x, rightEye.y);
      ctx.stroke();
    }
    if (leftEye && leftEar && leftEye.score! > faceConfidence && leftEar.score! > faceConfidence) {
      ctx.beginPath();
      ctx.moveTo(leftEye.x, leftEye.y);
      ctx.lineTo(leftEar.x, leftEar.y);
      ctx.stroke();
    }
    if (rightEye && rightEar && rightEye.score! > faceConfidence && rightEar.score! > faceConfidence) {
      ctx.beginPath();
      ctx.moveTo(rightEye.x, rightEye.y);
      ctx.lineTo(rightEar.x, rightEar.y);
      ctx.stroke();
    }
    if (leftEye && rightEye && leftEye.score! > faceConfidence && rightEye.score! > faceConfidence) {
      ctx.beginPath();
      ctx.moveTo(leftEye.x, leftEye.y);
      ctx.lineTo(rightEye.x, rightEye.y);
      ctx.stroke();
    }
  };

  const capturePhoto = () => {
    if (canvasRef.current && webcamRef.current) {
      // Combine webcam video and canvas overlay into a single image
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvasRef.current.width;
      tempCanvas.height = canvasRef.current.height;
      const ctx = tempCanvas.getContext('2d');
      
      if (ctx && webcamRef.current.video) {
        // Draw video frame
        ctx.drawImage(webcamRef.current.video, 0, 0, tempCanvas.width, tempCanvas.height);
        // Draw overlay
        ctx.drawImage(canvasRef.current, 0, 0);
        
        // Download
        const link = document.createElement('a');
        link.download = `luxe-vto-${Date.now()}.png`;
        link.href = tempCanvas.toDataURL();
        link.click();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center">
      {/* Header / Controls */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
          <span className="text-white font-mono text-xs uppercase tracking-widest">Live Feed</span>
        </div>
        
        <button 
          onClick={onClose}
          className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-md transition-all"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Main Viewport */}
      <div className="relative w-full h-full flex items-center justify-center bg-neutral-900 overflow-hidden">
        
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-50 bg-neutral-900">
            <RefreshCw className="w-10 h-10 animate-spin text-primary mb-4" />
            <h3 className="text-xl font-display font-bold">Initializing VTO Engine</h3>
            <p className="text-neutral-400 mt-2">Loading TensorFlow models...</p>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-50 bg-neutral-900">
            <AlertCircle className="w-12 h-12 text-destructive mb-4" />
            <h3 className="text-xl font-bold">Error</h3>
            <p className="text-neutral-400 mt-2">{error}</p>
            <button 
              onClick={onClose}
              className="mt-6 px-6 py-2 bg-white text-black font-bold rounded-full"
            >
              Close
            </button>
          </div>
        )}

        <Webcam
          ref={webcamRef}
          audio={false}
          className="absolute inset-0 w-full h-full object-cover"
          mirrored={true}
        />
        
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none transform -scale-x-100" // Match webcam mirror
        />

        {/* UI Overlay */}
        <div className="absolute bottom-12 left-0 right-0 flex justify-center items-center z-20">
            {/* Capture Button */}
            <button
              onClick={capturePhoto}
              className="group relative flex items-center justify-center w-20 h-20 rounded-full bg-white text-black shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-110 transition-transform"
            >
              <Camera className="w-8 h-8" />
            </button>
        </div>

        {/* Orientation Status (Small, discrete) */}
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-20 px-4 py-2 bg-black/50 backdrop-blur-md rounded-full border border-white/10 text-[10px] text-white/50 uppercase tracking-[0.2em]">
          Mode: <span className="text-primary font-bold">{currentView}</span>
        </div>

        {/* Stats Overlay */}
        <div className="absolute top-24 left-6 z-20 bg-black/40 backdrop-blur-md rounded-lg p-3 border border-white/5 text-xs font-mono text-white/70 space-y-1">
          <div className="flex justify-between w-24">
            <span>FPS:</span>
            <span className="text-primary">{metrics.fps}</span>
          </div>
          <div className="flex justify-between w-24">
            <span>CONF:</span>
            <span className={metrics.confidence > 50 ? "text-green-400" : "text-yellow-400"}>
              {metrics.confidence}%
            </span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 text-neutral-500 text-xs text-center px-4">
        Ensure you are well-lit and your full upper body is visible. Stand 2-3 meters back.
      </div>
    </div>
  );
}
