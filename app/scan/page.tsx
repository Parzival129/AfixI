"use client";

import Link from "next/link";
import { Camera, Upload, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ScanPage() {
  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto w-full">
      <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <h1 className="text-2xl font-bold mb-2">New Scan</h1>
      <p className="text-muted-foreground mb-8">
        Choose how you&apos;d like to capture your part.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/scan/capture">
          <Card className="group hover:border-primary/50 transition-colors cursor-pointer h-full">
            <CardContent className="flex flex-col items-center text-center p-8 gap-4">
              <div className="rounded-full bg-primary/10 p-4 group-hover:bg-primary/20 transition-colors">
                <Camera className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Camera Scan</h3>
                <p className="text-sm text-muted-foreground">
                  Capture multiple angles of your part using your device camera.
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/scan/upload">
          <Card className="group hover:border-primary/50 transition-colors cursor-pointer h-full">
            <CardContent className="flex flex-col items-center text-center p-8 gap-4">
              <div className="rounded-full bg-primary/10 p-4 group-hover:bg-primary/20 transition-colors">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Upload Model</h3>
                <p className="text-sm text-muted-foreground">
                  Upload an existing GLB or STL 3D model file.
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
