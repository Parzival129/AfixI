"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { MaterialInput } from "@/types/material";

const SURFACE_FINISHES = [
  "Smooth",
  "Textured",
  "Matte",
  "Glossy",
  "No preference",
];

interface MaterialFormProps {
  value: MaterialInput;
  onChange: (v: MaterialInput) => void;
}

export function MaterialForm({ value, onChange }: MaterialFormProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold">Current Material</h3>

      <div className="space-y-2">
        <Label>What is the original part made of?</Label>
        <Input
          placeholder="e.g., Aluminum, Steel, ABS plastic, Ceramic..."
          value={value.currentMaterial}
          onChange={(e) =>
            onChange({ ...value, currentMaterial: e.target.value })
          }
        />
      </div>

      <div className="space-y-2">
        <Label>Color Preference</Label>
        <Input
          placeholder="e.g., Black, White, No preference"
          value={value.colorPreference}
          onChange={(e) =>
            onChange({ ...value, colorPreference: e.target.value })
          }
        />
      </div>

      <div className="space-y-2">
        <Label>Surface Finish</Label>
        <Select
          value={value.surfaceFinish}
          onValueChange={(v) => { if (v) onChange({ ...value, surfaceFinish: v }); }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select finish" />
          </SelectTrigger>
          <SelectContent>
            {SURFACE_FINISHES.map((f) => (
              <SelectItem key={f} value={f}>
                {f}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
