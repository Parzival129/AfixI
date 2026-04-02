"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, FileBox, X } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import type { ModelRecord } from "@/types/model";

const ACCEPTED_TYPES: Record<string, ModelRecord["fileType"]> = {
  "model/gltf-binary": "glb",
  "application/octet-stream": "glb",
  ".glb": "glb",
  ".stl": "stl",
};

function getFileType(file: File): ModelRecord["fileType"] | null {
  const ext = file.name.toLowerCase().split(".").pop();
  if (ext === "glb") return "glb";
  if (ext === "stl") return "stl";
  return ACCEPTED_TYPES[file.type] ?? null;
}

export function UploadDropzone() {
  const router = useRouter();
  const [dragActive, setDragActive] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback((file: File) => {
    setError(null);
    const fileType = getFileType(file);
    if (!fileType) {
      setError("Please upload a .glb or .stl file.");
      return;
    }
    setSelectedFile(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleSave = async () => {
    if (!selectedFile) return;
    setSaving(true);
    try {
      const fileType = getFileType(selectedFile)!;
      const id = uuidv4();
      const name = selectedFile.name.replace(/\.(glb|stl)$/i, "");
      const now = new Date().toISOString();
      const record: ModelRecord = {
        id,
        name,
        fileBlob: selectedFile,
        fileType,
        measurements: [],
        createdAt: now,
        updatedAt: now,
      };
      await db.models.add(record);
      router.push(`/model/${id}`);
    } catch {
      setError("Failed to save model. Please try again.");
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 transition-colors cursor-pointer ${
          dragActive
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50"
        }`}
        onClick={() => document.getElementById("file-input")?.click()}
      >
        <input
          id="file-input"
          type="file"
          accept=".glb,.stl"
          className="hidden"
          onChange={handleInputChange}
        />
        <Upload className="h-10 w-10 text-muted-foreground mb-4" />
        <p className="text-sm font-medium">
          Drag & drop your 3D model here
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Supports .glb and .stl files
        </p>
      </div>

      {error && (
        <p className="text-sm text-destructive text-center">{error}</p>
      )}

      {selectedFile && (
        <div className="flex items-center gap-3 rounded-lg border border-border p-3">
          <FileBox className="h-5 w-5 text-primary flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{selectedFile.name}</p>
            <p className="text-xs text-muted-foreground">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedFile(null);
            }}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {selectedFile && (
        <Button
          className="w-full"
          size="lg"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving..." : "Open in Viewer"}
        </Button>
      )}
    </div>
  );
}
