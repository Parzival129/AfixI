"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { UploadDropzone } from "@/components/scan/upload-dropzone";

export default function UploadPage() {
  return (
    <div className="p-4 md:p-8 max-w-xl mx-auto w-full">
      <Link
        href="/scan"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Link>

      <h1 className="text-2xl font-bold mb-2">Upload 3D Model</h1>
      <p className="text-muted-foreground mb-8">
        Upload a GLB or STL file of your part to view, measure, and get printing
        recommendations.
      </p>

      <UploadDropzone />
    </div>
  );
}
