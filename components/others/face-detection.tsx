"use client";

import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

export default function FaceDetection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [faceDetected, setFaceDetected] = useState<boolean | null>(null);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState(
    "Please position your face within the oval",
  );
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  // Load face-api models
  useEffect(() => {
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
          faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
          faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
        ]);
        setModelsLoaded(true);
        console.log("Models loaded successfully");
      } catch (error) {
        console.error("Error loading models:", error);
      }
    };

    loadModels();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Start camera when models are loaded
  useEffect(() => {
    if (modelsLoaded) {
      startCamera();
    }
  }, [modelsLoaded]);

  const startCamera = async () => {
    try {
      const currentStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: "user" },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = currentStream;
        setStream(currentStream);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      setMessage(
        "Error accessing camera. Please ensure you've granted camera permissions.",
      );
    }
  };

  // Face detection logic
  useEffect(() => {
    if (!modelsLoaded || !videoRef.current || !stream) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const overlay = overlayRef.current;

    if (!canvas || !overlay) return;

    let animationId: number;

    const detectFace = async () => {
      if (video.readyState === 4) {
        // Get canvas context
        const displaySize = {
          width: video.videoWidth,
          height: video.videoHeight,
        };
        faceapi.matchDimensions(canvas, displaySize);

        // Detect faces
        const detections = await faceapi
          .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks();

        // Clear previous drawings
        const ctx = canvas.getContext("2d");
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (detections.length > 0) {
          const detection = detections[0];
          const faceBox = detection.detection.box;

          // Get oval dimensions from the overlay
          const ovalRect = overlay.getBoundingClientRect();
          const videoRect = video.getBoundingClientRect();

          // Convert overlay position to video coordinates
          const ovalOnVideo = {
            x:
              (ovalRect.left - videoRect.left) *
              (video.videoWidth / videoRect.width),
            y:
              (ovalRect.top - videoRect.top) *
              (video.videoHeight / videoRect.height),
            width: ovalRect.width * (video.videoWidth / videoRect.width),
            height: ovalRect.height * (video.videoHeight / videoRect.height),
          };

          // Calculate face size relative to frame
          const faceArea = faceBox.width * faceBox.height;
          const frameArea = video.videoWidth * video.videoHeight;
          const facePercentage = (faceArea / frameArea) * 100;

          // Define thresholds for distance
          const tooFarThreshold = 8; // If face occupies less than 5% of frame, it's too far
          const tooCloseThreshold = 10; // If face occupies more than 25% of frame, it's too close

          // Check if face is too far or too close
          const isTooFar = facePercentage < tooFarThreshold;
          const isTooClose = facePercentage > tooCloseThreshold;

          // Check if face is within the oval
          const faceInOval =
            faceBox.x > ovalOnVideo.x &&
            faceBox.y > ovalOnVideo.y &&
            faceBox.x + faceBox.width < ovalOnVideo.x + ovalOnVideo.width &&
            faceBox.y + faceBox.height < ovalOnVideo.y + ovalOnVideo.height;

          // Update state based on face position and distance
          if (isTooFar) {
            setFaceDetected(false);
            setMessage("You're too far from the camera. Please move closer.");
          } else if (isTooClose) {
            setFaceDetected(false);
            setMessage("You're too close to the camera. Please move back.");
          } else if (!faceInOval) {
            setFaceDetected(false);
            setMessage("Please position your face within the oval");
          } else {
            setFaceDetected(true);
            setMessage("Face positioned correctly!");
          }

          // Draw face box for debugging (optional)
          if (ctx) {
            ctx.strokeStyle = isTooFar
              ? "red"
              : isTooClose
                ? "orange"
                : faceInOval
                  ? "green"
                  : "yellow";
            ctx.lineWidth = 2;
            ctx.strokeRect(faceBox.x, faceBox.y, faceBox.width, faceBox.height);

            // Display distance percentage for debugging
            ctx.fillStyle = "white";
            ctx.font = "16px Arial";
            ctx.fillText(
              `Face: ${facePercentage.toFixed(1)}% of frame`,
              10,
              30,
            );
          }
        } else {
          setFaceDetected(false);
          setMessage("No face detected. Please look at the camera.");
        }
      }

      animationId = requestAnimationFrame(detectFace);
    };

    detectFace();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [modelsLoaded, stream]);

  const captureImage = () => {
    if (!videoRef.current || !faceDetected) return;

    setProcessing(true);

    try {
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL("image/png");
        setCapturedImage(imageData);
        setMessage("Image captured successfully!");
      }
    } catch (error) {
      console.error("Error capturing image:", error);
      setMessage("Error capturing image. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const resetCapture = () => {
    setCapturedImage(null);
    setMessage("Please position your face within the oval");
  };

  return (
    <div className="flex flex-col items-center">
      {!modelsLoaded ? (
        <div className="flex flex-col items-center justify-center h-[480px] w-[640px] bg-gray-100 rounded-lg">
          <Loader2 className="h-12 w-12 animate-spin text-gray-500 mb-4" />
          <p className="text-gray-600">Loading face detection models...</p>
        </div>
      ) : capturedImage ? (
        <div className="flex flex-col items-center">
          <div className="relative h-[480px] w-[640px] bg-black rounded-lg overflow-hidden">
            <img
              src={capturedImage || "/placeholder.svg"}
              alt="Captured face"
              className="h-full w-full object-contain"
            />
          </div>
          <div className="flex gap-4 mt-4">
            <Button onClick={resetCapture} variant="outline">
              Try Again
            </Button>
            <Button onClick={() => alert("Processing image...")}>
              Process Image
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="relative h-[480px] w-[640px] bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="h-full w-full object-cover"
              onLoadedMetadata={(e) => e.currentTarget.play()}
            />
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 h-full w-full"
            />
            <div
              ref={overlayRef}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[400px] border-4 border-white rounded-full pointer-events-none"
              style={{
                boxShadow: "0 0 0 1000px rgba(0, 0, 0, 0.5)",
              }}
            />
          </div>

          <Alert
            className="mt-4"
            variant={faceDetected ? "default" : "destructive"}
          >
            <AlertDescription className="flex items-center gap-2">
              {faceDetected === null ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : faceDetected ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              {message}
            </AlertDescription>
          </Alert>

          <Button
            onClick={captureImage}
            disabled={!faceDetected || processing}
            className="mt-4"
          >
            {processing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Capture Image"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
