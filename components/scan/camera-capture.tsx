"use client";

import { useCamera } from "@/hooks/use-camera";
import { Button } from "@/components/ui/button";
import { Camera, VideoOff } from "lucide-react";

interface CameraCaptureProps {
  onCapture: (blob: Blob) => void;
}

export function CameraCapture({ onCapture }: CameraCaptureProps) {
  const { videoRef, active, error, start, stop, capture } = useCamera();

  const handleCapture = () => {
    const blob = capture();
    if (blob) onCapture(blob);
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
        <VideoOff className="h-10 w-10 text-destructive" />
        <p className="text-sm text-destructive">{error}</p>
        <Button variant="secondary" onClick={start}>
          Try Again
        </Button>
      </div>
    );
  }

  if (!active) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-12">
        <Camera className="h-12 w-12 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Enable your camera to capture images of your part.
        </p>
        <Button onClick={start}>Start Camera</Button>
      </div>
    );
  }

  return (
    <div className="relative">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full rounded-xl bg-black"
      />
      {/* Capture button — raised above mobile bottom nav */}
      <div className="absolute bottom-[calc(1rem+env(safe-area-inset-bottom))] md:bottom-4 left-0 right-0 flex justify-center items-end gap-4">
        <Button
          size="lg"
          className="rounded-full h-16 w-16 p-0"
          onClick={handleCapture}
        >
          <Camera className="h-7 w-7" />
        </Button>
        <Button
          variant="secondary"
          className="absolute right-4 bottom-0 h-10 px-4 text-sm"
          onClick={stop}
        >
          Stop
        </Button>
      </div>
    </div>
  );
}
