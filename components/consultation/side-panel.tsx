"use client";

import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { v4 as uuidv4 } from "uuid";
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Clock,
  Loader2,
  MessageSquare,
  Plus,
  Sparkles,
} from "lucide-react";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MaterialForm } from "@/components/consultation/material-form";
import { EnvironmentForm } from "@/components/consultation/environment-form";
import { LoadForm } from "@/components/consultation/load-form";
import { EquipmentForm } from "@/components/consultation/equipment-form";
import { ResultsDisplay } from "@/components/consultation/results-display";
import { toast } from "sonner";
import type { MaterialInput, EnvironmentInput, LoadInput } from "@/types/material";
import type { ConsultationRequest, ConsultationRecord } from "@/types/consultation";
import type { Measurement } from "@/types/model";

type View = "list" | "form" | "result";

interface SidePanelProps {
  modelId: string;
  modelName: string;
  measurements: Measurement[];
}

export function ConsultationSidePanel({ modelId, modelName, measurements }: SidePanelProps) {
  const [view, setView] = useState<View>("list");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [material, setMaterial] = useState<MaterialInput>({
    currentMaterial: "",
    colorPreference: "",
    surfaceFinish: "No preference",
  });
  const [environment, setEnvironment] = useState<EnvironmentInput>({
    tempMin: 0,
    tempMax: 40,
    humidity: "low",
    uvExposure: "none",
    chemicalExposure: [],
    indoor: true,
  });
  const [load, setLoad] = useState<LoadInput>({
    loadBearing: false,
    flexibility: "rigid",
    toleranceMm: 0.2,
    lifespanYears: 3,
  });
  const [availablePrinters, setAvailablePrinters] = useState<string[]>([]);
  const [availableFilaments, setAvailableFilaments] = useState<string[]>([]);

  const consultations = useLiveQuery(
    () => db.consultations.where("modelId").equals(modelId).reverse().sortBy("createdAt"),
    [modelId]
  );

  const selected = useLiveQuery(
    () => (selectedId ? db.consultations.get(selectedId) : undefined),
    [selectedId]
  );

  const openResult = (c: ConsultationRecord) => {
    setSelectedId(c.id);
    setView("result");
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const consultationId = uuidv4();

    const request: ConsultationRequest = {
      modelId,
      measurements,
      material,
      environment,
      loadRequirements: load,
      ...(availablePrinters.length > 0 && { availablePrinters }),
      ...(availableFilaments.length > 0 && { availableFilaments }),
    };

    try {
      await db.consultations.add({
        id: consultationId,
        modelId,
        request,
        status: "pending",
        createdAt: new Date().toISOString(),
      });

      setSelectedId(consultationId);
      setView("result");

      const res = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(err.error || "Consultation failed");
      }

      const result = await res.json();

      await db.consultations.update(consultationId, {
        result,
        status: "complete",
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      toast.error(msg);
      await db.consultations.update(consultationId, {
        status: "error",
        errorMessage: msg,
      });
    } finally {
      setSubmitting(false);
    }
  };

  // --- Result view ---
  if (view === "result") {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2 p-4 border-b border-border">
          <button onClick={() => { setView("list"); setSelectedId(null); }} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h2 className="text-sm font-semibold">Consultation Results</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {selected === undefined && (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          )}
          {selected?.status === "pending" && (
            <div className="flex flex-col items-center justify-center h-32 gap-3">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Generating recommendations...</p>
            </div>
          )}
          {selected?.status === "error" && (
            <div className="flex flex-col items-center justify-center h-32 gap-3 text-center">
              <p className="text-sm text-destructive font-medium">Consultation Failed</p>
              <p className="text-xs text-muted-foreground">{selected.errorMessage}</p>
              <Button variant="secondary" size="sm" onClick={() => setView("form")}>Try Again</Button>
            </div>
          )}
          {selected?.status === "complete" && selected.result && (
            <ResultsDisplay result={selected.result} />
          )}
        </div>
      </div>
    );
  }

  // --- Form view ---
  if (view === "form") {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2 p-4 border-b border-border">
          <button onClick={() => setView("list")} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h2 className="text-sm font-semibold">New Consultation</h2>
            <p className="text-xs text-muted-foreground">{modelName}</p>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-6">
            <MaterialForm value={material} onChange={setMaterial} />
            <Separator />
            <EnvironmentForm value={environment} onChange={setEnvironment} />
            <Separator />
            <LoadForm value={load} onChange={setLoad} />
            <Separator />
            <EquipmentForm
              printers={availablePrinters}
              filaments={availableFilaments}
              onPrintersChange={setAvailablePrinters}
              onFilamentsChange={setAvailableFilaments}
            />
            <Separator />
            <Button className="w-full" size="lg" onClick={handleSubmit} disabled={submitting}>
              {submitting ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Analyzing...</>
              ) : (
                <><Sparkles className="mr-2 h-4 w-4" />Get Recommendations</>
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // --- List view (default) ---
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold">Consultations</h2>
        </div>
        <Button size="sm" onClick={() => setView("form")}>
          <Plus className="mr-1 h-3 w-3" />
          New
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {(!consultations || consultations.length === 0) ? (
          <div className="flex flex-col items-center justify-center h-32 gap-3 text-center">
            <MessageSquare className="h-8 w-8 text-muted-foreground/50" />
            <div>
              <p className="text-sm font-medium">No consultations yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Get AI-powered printing recommendations for this part.
              </p>
            </div>
            <Button size="sm" onClick={() => setView("form")}>
              <Sparkles className="mr-1 h-3 w-3" />
              Get Started
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {consultations.map((c) => {
              const date = new Date(c.createdAt);
              const formatted = date.toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              });
              const StatusIcon =
                c.status === "complete"
                  ? CheckCircle2
                  : c.status === "error"
                    ? AlertCircle
                    : Loader2;
              const statusColor =
                c.status === "complete"
                  ? "text-green-500"
                  : c.status === "error"
                    ? "text-destructive"
                    : "text-muted-foreground animate-spin";

              return (
                <button
                  key={c.id}
                  onClick={() => openResult(c)}
                  className="flex items-center gap-3 w-full rounded-lg border border-border p-3 hover:border-primary/50 transition-colors text-left"
                >
                  <StatusIcon className={`h-4 w-4 flex-shrink-0 ${statusColor}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {c.result?.recommendedFilament.primary.material ?? (c.status === "error" ? "Failed" : "Processing...")}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{formatted}</span>
                    </div>
                  </div>
                  {c.result && (
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                      {c.result.overallConfidence}
                    </Badge>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
