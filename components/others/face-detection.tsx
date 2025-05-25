"use client";

import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { uploadFile } from "@/actions/upload";
import { analyzeHair } from "@/actions/analyze";
import { toast } from "sonner";
export default function FaceDetection({
  setStep,
  reportId,
}: {
  setStep: (step: number) => void;
  reportId: number;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [faceDetected, setFaceDetected] = useState<boolean | null>(null);
  const [processing, setProcessing] = useState(false);
  const [issues, setIssues] = useState<string[]>([]);
  const [message, setMessage] = useState(
    "Please position your face within the oval",
  );
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [data, setData] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
          faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
          faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
        ]);
        setModelsLoaded(true);
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

  useEffect(() => {
    if (modelsLoaded) {
      startCamera();
    }
  }, [modelsLoaded, facingMode]);

  const startCamera = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const currentStream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, facingMode },
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
    } else {
      console.log("not supported");
      setMessage("Error accessing camera. Not Supported by browser");
    }
  };

  useEffect(() => {
    if (!modelsLoaded || !videoRef.current || !stream) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const overlay = overlayRef.current;

    if (!canvas || !overlay) return;

    let animationId: number;

    const detectFace = async () => {
      if (video.readyState === 4) {
        const displaySize = {
          width: video.videoWidth,
          height: video.videoHeight,
        };
        faceapi.matchDimensions(canvas, displaySize);

        const detections = await faceapi
          .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks();

        const ctx = canvas.getContext("2d");
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (detections.length > 0) {
          const detection = detections[0];
          const faceBox = detection.detection.box;

          const ovalRect = overlay.getBoundingClientRect();
          const videoRect = video.getBoundingClientRect();

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

          const faceArea = faceBox.width * faceBox.height;
          const frameArea = video.videoWidth * video.videoHeight;
          const facePercentage = (faceArea / frameArea) * 100;

          const tooFarThreshold = 10; // If face occupies less than 5% of frame, it's too far
          const tooCloseThreshold = 25; // If face occupies more than 25% of frame, it's too close

          const isTooFar = facePercentage < tooFarThreshold;
          const isTooClose = facePercentage > tooCloseThreshold;

          const faceInOval =
            faceBox.x > ovalOnVideo.x &&
            faceBox.y > ovalOnVideo.y &&
            faceBox.x + faceBox.width < ovalOnVideo.x + ovalOnVideo.width &&
            faceBox.y + faceBox.height < ovalOnVideo.y + ovalOnVideo.height;

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

  const switchCamera = () => {
    setFacingMode((prevMode) => (prevMode === "user" ? "environment" : "user"));
  };

  const captureImage = async () => {
    if (!videoRef.current) return;
    setProcessing(true);
    setApiError(null);
    setIsAnalyzing(false);
    setData(null);

    try {
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = canvas.toDataURL("image/png");
      setCapturedImage(imageData);

      const blob = await fetch(imageData).then((res) => res.blob());
      const file = new File([blob], "captured-image.png", {
        type: "image/png",
      });

      const formData = new FormData();
      formData.append("image", file, "captured-image.png");
      formData.append("file", file);

      setIsAnalyzing(true);
      const response = await fetch("https://api.milele.health/validate-image", {
        method: "POST",
        headers: {
          accept: "application/json",
          "accept-language": "en-US,en;q=0.9",
        },
        body: formData,
      });

      const data = await response.json();
      if (!data?.valid) {
        return setIssues(data?.issues);
      }

      const response1 = await fetch("https://api.milele.health/analyze-hair", {
        method: "POST",
        headers: {
          accept: "application/json",
          "accept-language": "en-US,en;q=0.9",
        },
        body: formData,
      });

      const data1 = await response1.json();
      const formData1 = new FormData();
      formData1.append("image", file);
      const uploaded = await uploadFile(formData1);
      const analizedData = {
        image: uploaded.url,
        analysis: data1,
      };
      setData(analizedData);
      const res = await analyzeHair({
        reportId: reportId,
        analysis: analizedData,
      });
      if (!res.success) {
        return toast.error(res.message);
      }
      localStorage.removeItem("reportId");
      localStorage.removeItem("startTime");
      router.push(`/report/${res?.id}`);
    } catch (error) {
      // alert(error?.message)
      console.error("Error capturing image:", error);
      setApiError(
        "An error occurred while processing your image. Please try again.",
      );
      setMessage("Error capturing image. Please try again.");
    } finally {
      setProcessing(false);
      setIsAnalyzing(false);
    }
  };

  const resetCapture = () => {
    return window.location.reload();
  };

  const startOver = () => {
    localStorage.removeItem("reportId");
    localStorage.removeItem("startTime");
    setStep(0);
  };

  return (
    <div className="flex flex-col items-center">
      {!modelsLoaded ? (
        <div className="flex flex-col items-center justify-center h-[480px] w-full bg-gray-100 rounded-lg">
          <Loader2 className="h-12 w-12 animate-spin text-gray-500 mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      ) : capturedImage ? (
        <>
          <div className="flex flex-col items-center">
            <div className="relative h-[480px] w-full bg-black rounded-lg overflow-hidden">
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
            </div>
          </div>
          {issues.length > 0 ? (
            <Alert className="mt-4" variant="destructive">
              <AlertDescription className="flex items-center gap-2">
                <XCircle className="h-4 w-4" />
                {issues.map((issue, index) => (
                  <p key={index}>{issue}</p>
                ))}
              </AlertDescription>
            </Alert>
          ) : apiError ? (
            <Alert className="mt-4" variant="destructive">
              <AlertDescription className="flex items-center gap-2">
                <XCircle className="h-4 w-4" />
                {apiError}
              </AlertDescription>
            </Alert>
          ) : isAnalyzing ? (
            <div className="mt-4 flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-center text-muted-foreground">
                Analyzing your hair... This may take a few moments.
              </p>
            </div>
          ) : data ? (
            <>
              <Alert className="mt-4" variant="default">
                <AlertDescription className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Analysis completed successfully!
                </AlertDescription>
              </Alert>
            </>
          ) : null}
        </>
      ) : (
        <div className="flex flex-col items-center">
          <div className="relative h-[480px] w-full bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="h-full w-full object-cover transform scale-x-[-1]"
              onLoadedMetadata={(e) => e.currentTarget.play()}
            />
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 h-full w-full scale-x-[-1]"
            />
            <div
              ref={overlayRef}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[400px] border-4 border-white rounded-full pointer-events-none"
              style={{
                boxShadow: faceDetected
                  ? "0 0 0 1000px rgba(0, 255, 0, 0.5)"
                  : "0 0 0 1000px rgba(255, 0, 0, 0.5)",
                borderColor: faceDetected ? "green" : "red",
              }}
            />
          </div>

          <Alert
            className="mt-4 bg-white"
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

          <div className="flex gap-4 mt-4">
            <Button onClick={startOver}>Start Over</Button>
            <Button
              onClick={captureImage}
              disabled={!faceDetected || processing}
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
            {/* <Button onClick={switchCamera}>Switch Camera</Button> */}
          </div>
        </div>
      )}
    </div>
  );
}
