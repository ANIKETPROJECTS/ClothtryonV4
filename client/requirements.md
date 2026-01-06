## Packages
framer-motion | For smooth animations and page transitions
@tensorflow/tfjs-core | Core TensorFlow.js library for VTO
@tensorflow/tfjs-converter | Converter for loading models
@tensorflow/tfjs-backend-webgl | WebGL backend for TF.js
@tensorflow-models/pose-detection | MoveNet pose detection model
react-webcam | Easy webcam integration
lucide-react | Icon library (already in base, but ensuring it's noted)

## Notes
Tailwind Config - extend fontFamily:
fontFamily: {
  display: ["var(--font-display)"],
  body: ["var(--font-body)"],
}

Virtual Try-On requires camera permissions.
The VTO logic will use MoveNet (Thunder or Lightning) for pose detection.
Images for the t-shirt views (Front, Back, Left, Right) need to be loaded as standard HTMLImageElements for canvas drawing.
