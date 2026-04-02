"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Cog } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/lib/db";
import { CameraCapture } from "@/components/scan/camera-capture";
import { CaptureGuide } from "@/components/scan/capture-guide";
import { ImageGallery } from "@/components/scan/image-gallery";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function CapturePage() {
  const [images, setImages] = useState<Blob[]>([]);
  const [saving, setSaving] = useState(false);

  const handleCapture = (blob: Blob) => {
    setImages((prev) => [...prev, blob]);
  };

  const handleRemove = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (images.length === 0) return;
    setSaving(true);
    try {
      const id = uuidv4();
      await db.captures.add({
        id,
        images,
        status: "complete",
        createdAt: new Date().toISOString(),
      });
      toast.info(
        "Images saved! 3D reconstruction from photos is coming soon. For now, upload an existing 3D model.",
        { duration: 6000 }
      );
    } catch {
      toast.error("Failed to save capture session.");
    }
    setSaving(false);
  };

  return (
    <div className="p-4 md:p-8 max-w-xl mx-auto w-full space-y-6">
      <Link
        href="/scan"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Link>

      <div>
        <h1 className="text-2xl font-bold mb-1">Camera Scan</h1>
        <p className="text-sm text-muted-foreground">
          Capture your part from multiple angles for 3D reconstruction.
        </p>
      </div>

      <CameraCapture onCapture={handleCapture} />
      <CaptureGuide capturedCount={images.length} />
      <ImageGallery images={images} onRemove={handleRemove} />

      {images.length > 0 && (
        <div className="space-y-2">
          <Button
            className="w-full"
            size="lg"
            onClick={handleSave}
            disabled={saving}
          >
            <Cog className="mr-2 h-4 w-4" />
            {saving ? "Saving..." : "Save Captures"}
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            3D reconstruction from photos is coming soon. Save your captures for
            later processing.
          </p>
        </div>
      )}
    </div>
  );
}
