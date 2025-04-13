import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';

interface WebcamCaptureProps {
  onStressDetected: (stressLevel: number) => void;
}

const WebcamCapture: React.FC<WebcamCaptureProps> = ({ onStressDetected }) => {
  const webcamRef = useRef<Webcam>(null);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [modelLoadError, setModelLoadError] = useState<string | null>(null);

  useEffect(() => {
    const loadModels = async () => {
      try {
        // Load models from a CDN instead of local files
        const MODEL_URL = 'https://justadudewhohacks.github.io/face-api.js/models';
        
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
        ]);
        
        setIsModelLoading(false);
        setModelLoadError(null);
      } catch (error) {
        console.error('Error loading models:', error);
        setModelLoadError('Failed to load face detection models. Please check your internet connection and try again.');
        setIsModelLoading(false);
      }
    };

    loadModels();
  }, []);

  useEffect(() => {
    if (!isModelLoading && !modelLoadError) {
      const interval = setInterval(async () => {
        if (webcamRef.current?.video) {
          try {
            const detection = await faceapi
              .detectSingleFace(
                webcamRef.current.video,
                new faceapi.TinyFaceDetectorOptions()
              )
              .withFaceExpressions();

            if (detection) {
              const { expressions } = detection;
              // Calculate stress level based on negative expressions
              const stressLevel = calculateStressLevel(expressions);
              onStressDetected(stressLevel);
            }
          } catch (error) {
            console.error('Face detection error:', error);
          }
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isModelLoading, modelLoadError, onStressDetected]);

  const calculateStressLevel = (expressions: any) => {
    // Calculate stress based on negative expressions (angry, fearful, sad, disgusted)
    const stressIndicators = 
      expressions.angry + 
      expressions.fearful + 
      expressions.sad + 
      expressions.disgusted;
    
    // Convert to percentage and ensure it's between 0-100
    return Math.min(Math.round(stressIndicators * 100), 100);
  };

  return (
    <div className="relative rounded-lg overflow-hidden">
      <Webcam
        ref={webcamRef}
        className="w-full rounded-lg shadow-lg"
        mirrored
        screenshotFormat="image/jpeg"
      />
      
      {isModelLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
          <div className="text-center text-white">
            <div className="mb-2">Loading face detection models...</div>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
          </div>
        </div>
      )}

      {modelLoadError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
          <div className="text-center text-white p-4">
            <div className="text-red-400 mb-2">⚠️ Error</div>
            <div>{modelLoadError}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebcamCapture;