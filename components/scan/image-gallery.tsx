"use client";

import { useMemo } from "react";
import { X } from "lucide-react";

interface ImageGalleryProps {
  images: Blob[];
  onRemove: (index: number) => void;
}

export function ImageGallery({ images, onRemove }: ImageGalleryProps) {
  const urls = useMemo(
    () => images.map((blob) => URL.createObjectURL(blob)),
    [images]
  );

  if (images.length === 0) return null;

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">
        Captured Images ({images.length})
      </p>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {urls.map((url, i) => (
          <div
            key={i}
            className="relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border border-border"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt={`Capture ${i + 1}`}
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => onRemove(i)}
              className="absolute top-0.5 right-0.5 bg-background/80 rounded-full p-0.5 hover:bg-destructive hover:text-white transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
