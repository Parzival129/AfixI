"use client";

import { Check, Circle } from "lucide-react";

const RECOMMENDED_ANGLES = [
  "Front",
  "Back",
  "Left",
  "Right",
  "Top",
  "45° Front-Left",
  "45° Front-Right",
  "45° Back-Left",
];

interface CaptureGuideProps {
  capturedCount: number;
}

export function CaptureGuide({ capturedCount }: CaptureGuideProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Recommended Angles</p>
        <p className="text-xs text-muted-foreground">
          {capturedCount}/{RECOMMENDED_ANGLES.length} captured
        </p>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {RECOMMENDED_ANGLES.map((angle, i) => {
          const done = i < capturedCount;
          return (
            <div
              key={angle}
              className={`flex flex-col items-center gap-1 rounded-lg p-2 text-center text-xs ${
                done
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {done ? (
                <Check className="h-4 w-4" />
              ) : (
                <Circle className="h-4 w-4" />
              )}
              {angle}
            </div>
          );
        })}
      </div>
    </div>
  );
}
