"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { LoadInput, LoadType, Flexibility } from "@/types/material";

interface LoadFormProps {
  value: LoadInput;
  onChange: (v: LoadInput) => void;
}

export function LoadForm({ value, onChange }: LoadFormProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold">Structural Requirements</h3>

      <div className="space-y-2">
        <Label>Load-Bearing</Label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onChange({ ...value, loadBearing: true })}
            className={`flex-1 rounded-lg px-4 py-3 md:py-2 text-sm border transition-colors ${
              value.loadBearing
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground hover:border-primary/50"
            }`}
          >
            Yes
          </button>
          <button
            type="button"
            onClick={() =>
              onChange({
                ...value,
                loadBearing: false,
                loadType: undefined,
                estimatedForceN: undefined,
              })
            }
            className={`flex-1 rounded-lg px-4 py-3 md:py-2 text-sm border transition-colors ${
              !value.loadBearing
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground hover:border-primary/50"
            }`}
          >
            No
          </button>
        </div>
      </div>

      {value.loadBearing && (
        <>
          <div className="space-y-2">
            <Label>Load Type</Label>
            <Select
              value={value.loadType ?? "static"}
              onValueChange={(v) =>
                onChange({ ...value, loadType: v as LoadType })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="static">Static (constant weight)</SelectItem>
                <SelectItem value="dynamic">Dynamic (repeated stress)</SelectItem>
                <SelectItem value="impact">Impact (sudden force)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Estimated Force (Newtons)</Label>
            <Input
              type="number"
              min={0}
              placeholder="e.g., 100"
              value={value.estimatedForceN ?? ""}
              onChange={(e) =>
                onChange({
                  ...value,
                  estimatedForceN: e.target.value
                    ? Number(e.target.value)
                    : undefined,
                })
              }
            />
          </div>
        </>
      )}

      <div className="space-y-2">
        <Label>Flexibility</Label>
        <Select
          value={value.flexibility}
          onValueChange={(v) =>
            onChange({ ...value, flexibility: v as Flexibility })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rigid">Rigid</SelectItem>
            <SelectItem value="semi-flex">Semi-flexible</SelectItem>
            <SelectItem value="flexible">Flexible</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>
          Dimensional Tolerance: {value.toleranceMm} mm
        </Label>
        <Slider
          min={0.05}
          max={2}
          step={0.05}
          value={[value.toleranceMm]}
          onValueChange={(v) => onChange({ ...value, toleranceMm: Array.isArray(v) ? v[0] : v })}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Tight (0.05mm)</span>
          <span>Loose (2mm)</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Expected Lifespan: {value.lifespanYears} years</Label>
        <Slider
          min={0.5}
          max={20}
          step={0.5}
          value={[value.lifespanYears]}
          onValueChange={(v) => onChange({ ...value, lifespanYears: Array.isArray(v) ? v[0] : v })}
        />
      </div>
    </div>
  );
}
