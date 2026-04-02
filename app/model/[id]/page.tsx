"use client";

import { use, useCallback, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, GripVertical, Trash2 } from "lucide-react";
import { useModel } from "@/hooks/use-model";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { toast } from "sonner";
import { ConsultationSidePanel } from "@/components/consultation/side-panel";

const ModelViewer = dynamic(
  () =>
    import("@/components/three/model-viewer").then((mod) => ({
      default: mod.ModelViewer,
    })),
  { ssr: false, loading: () => <ViewerSkeleton /> }
);

function ViewerSkeleton() {
  return (
    <div className="flex items-center justify-center h-full bg-card/50 rounded-xl animate-pulse">
      <p className="text-muted-foreground">Loading 3D viewer...</p>
    </div>
  );
}

const PANEL_MIN = 280;
const PANEL_MAX = 700;
const PANEL_DEFAULT = 420;

function SplitLayout({
  modelViewer,
  sidePanel,
}: {
  modelViewer: React.ReactNode;
  sidePanel: React.ReactNode;
}) {
  const [panelWidth, setPanelWidth] = useState(PANEL_DEFAULT);
  const dragging = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    dragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const newWidth = Math.min(
      PANEL_MAX,
      Math.max(PANEL_MIN, rect.right - e.clientX)
    );
    setPanelWidth(newWidth);
  }, []);

  const onPointerUp = useCallback(() => {
    dragging.current = false;
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex-1 flex flex-col md:flex-row min-h-0"
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {/* 3D Viewer */}
      <div className="flex-1 relative min-h-[300px] md:min-h-0">
        {modelViewer}
      </div>

      {/* Resize handle (desktop only) */}
      <div
        onPointerDown={onPointerDown}
        className="hidden md:flex items-center justify-center w-2 cursor-col-resize hover:bg-primary/10 active:bg-primary/20 transition-colors select-none"
      >
        <GripVertical className="h-5 w-5 text-muted-foreground/50" />
      </div>

      {/* Consultation side panel */}
      <div
        className="w-full border-t md:border-t-0 md:border-l border-border flex flex-col min-h-[300px] md:min-h-0 overflow-hidden pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0"
        style={{ flexBasis: panelWidth, flexShrink: 0, flexGrow: 0 }}
      >
        {sidePanel}
      </div>
    </div>
  );
}

export default function ModelPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const model = useModel(id);
  const router = useRouter();

  if (model === undefined) {
    return (
      <div className="flex items-center justify-center flex-1">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (model === null) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 gap-4">
        <p className="text-muted-foreground">Model not found.</p>
        <Link href="/">
          <Button variant="secondary">Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  const handleDelete = async () => {
    if (!confirm("Delete this model and all associated consultations?")) return;
    await db.consultations.where("modelId").equals(id).delete();
    await db.models.delete(id);
    toast.success("Model deleted");
    router.push("/");
  };

  return (
    <div className="flex flex-col h-full min-h-0 overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="font-semibold">{model.name}</h1>
            <p className="text-xs text-muted-foreground">
              {model.fileType.toUpperCase()} &middot;{" "}
              {model.measurements.length} measurements
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={handleDelete}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>

      {/* Split layout: viewer + side panel */}
      <SplitLayout
        modelViewer={
          <ModelViewer fileBlob={model.fileBlob} fileType={model.fileType} />
        }
        sidePanel={
          <ConsultationSidePanel
            modelId={id}
            modelName={model.name}
            measurements={model.measurements}
          />
        }
      />
    </div>
  );
}
