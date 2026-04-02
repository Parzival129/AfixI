"use client";

import Link from "next/link";
import { ScanLine, Upload, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="rounded-full bg-primary/10 p-6 mb-6">
        <Leaf className="h-12 w-12 text-primary" />
      </div>
      <h2 className="text-2xl font-bold mb-2">Welcome to AfixI</h2>
      <p className="text-muted-foreground max-w-md mb-8">
        Scan or upload a physical part, get AI-powered 3D printing
        recommendations, and fabricate your own replacement.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/scan/capture">
          <Button size="lg">
            <ScanLine className="mr-2 h-5 w-5" />
            Scan a Part
          </Button>
        </Link>
        <Link href="/scan/upload">
          <Button variant="secondary" size="lg">
            <Upload className="mr-2 h-5 w-5" />
            Upload 3D Model
          </Button>
        </Link>
      </div>
    </div>
  );
}
