"use client";

import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  EnvironmentInput,
  HumidityLevel,
  UVExposure,
  ChemicalExposure,
} from "@/types/material";

const CHEMICALS: { value: ChemicalExposure; label: string }[] = [
  { value: "water", label: "Water" },
  { value: "oils", label: "Oils" },
  { value: "solvents", label: "Solvents" },
  { value: "acids", label: "Acids" },
  { value: "alkalis", label: "Alkalis" },
  { value: "food-safe", label: "Food-safe required" },
];

interface EnvironmentFormProps {
  value: EnvironmentInput;
  onChange: (v: EnvironmentInput) => void;
}

export function EnvironmentForm({ value, onChange }: EnvironmentFormProps) {
  const toggleChemical = (chem: ChemicalExposure) => {
    const has = value.chemicalExposure.includes(chem);
    onChange({
      ...value,
      chemicalExposure: has
        ? value.chemicalExposure.filter((c) => c !== chem)
        : [...value.chemicalExposure, chem],
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold">Environmental Conditions</h3>

      <div className="space-y-2">
        <Label>
          Temperature Range: {value.tempMin}°C to {value.tempMax}°C
        </Label>
        <div className="flex gap-4 items-center">
          <span className="text-xs text-muted-foreground w-8">Min</span>
          <Slider
            min={-40}
            max={150}
            step={5}
            value={[value.tempMin]}
            onValueChange={(v) => onChange({ ...value, tempMin: Array.isArray(v) ? v[0] : v })}
            className="flex-1"
          />
          <span className="text-xs text-muted-foreground w-12">
            {value.tempMin}°C
          </span>
        </div>
        <div className="flex gap-4 items-center">
          <span className="text-xs text-muted-foreground w-8">Max</span>
          <Slider
            min={-40}
            max={300}
            step={5}
            value={[value.tempMax]}
            onValueChange={(v) => onChange({ ...value, tempMax: Array.isArray(v) ? v[0] : v })}
            className="flex-1"
          />
          <span className="text-xs text-muted-foreground w-12">
            {value.tempMax}°C
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Humidity</Label>
        <Select
          value={value.humidity}
          onValueChange={(v) =>
            onChange({ ...value, humidity: v as HumidityLevel })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="submerged">Submerged</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>UV Exposure</Label>
        <Select
          value={value.uvExposure}
          onValueChange={(v) =>
            onChange({ ...value, uvExposure: v as UVExposure })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="indoor">Indoor (some light)</SelectItem>
            <SelectItem value="outdoor">Outdoor (direct sun)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Chemical Exposure</Label>
        <div className="flex flex-wrap gap-2">
          {CHEMICALS.map((chem) => {
            const selected = value.chemicalExposure.includes(chem.value);
            return (
              <button
                key={chem.value}
                type="button"
                onClick={() => toggleChemical(chem.value)}
                className={`rounded-full px-4 py-2 text-sm md:px-3 md:py-1 md:text-xs border transition-colors ${
                  selected
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:border-primary/50"
                }`}
              >
                {chem.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Usage Environment</Label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onChange({ ...value, indoor: true })}
            className={`flex-1 rounded-lg px-4 py-3 md:py-2 text-sm border transition-colors ${
              value.indoor
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground hover:border-primary/50"
            }`}
          >
            Indoor
          </button>
          <button
            type="button"
            onClick={() => onChange({ ...value, indoor: false })}
            className={`flex-1 rounded-lg px-4 py-3 md:py-2 text-sm border transition-colors ${
              !value.indoor
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground hover:border-primary/50"
            }`}
          >
            Outdoor
          </button>
        </div>
      </div>
    </div>
  );
}
