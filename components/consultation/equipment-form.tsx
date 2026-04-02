"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface EquipmentFormProps {
  printers: string[];
  filaments: string[];
  onPrintersChange: (printers: string[]) => void;
  onFilamentsChange: (filaments: string[]) => void;
}

function TagInput({
  label,
  placeholder,
  items,
  onChange,
}: {
  label: string;
  placeholder: string;
  items: string[];
  onChange: (items: string[]) => void;
}) {
  const [draft, setDraft] = useState("");

  const add = () => {
    const trimmed = draft.trim();
    if (trimmed && !items.includes(trimmed)) {
      onChange([...items, trimmed]);
    }
    setDraft("");
  };

  const remove = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input
          placeholder={placeholder}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
        />
        <Button type="button" variant="outline" size="icon" onClick={add} disabled={!draft.trim()}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      {items.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {items.map((item, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
            >
              {item}
              <button type="button" onClick={() => remove(i)} className="hover:text-destructive">
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export function EquipmentForm({
  printers,
  filaments,
  onPrintersChange,
  onFilamentsChange,
}: EquipmentFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold">Available Equipment</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Optional — add your printers and filaments so recommendations are tailored to what you have.
        </p>
      </div>
      <TagInput
        label="Printers"
        placeholder="e.g., Bambu Lab P1S, Prusa MK4..."
        items={printers}
        onChange={onPrintersChange}
      />
      <TagInput
        label="Filaments"
        placeholder="e.g., PLA, PETG, ABS, Nylon..."
        items={filaments}
        onChange={onFilamentsChange}
      />
    </div>
  );
}
