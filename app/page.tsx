"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { EmptyState } from "@/components/dashboard/empty-state";
import { ScanCard } from "@/components/dashboard/scan-card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const models = useLiveQuery(() =>
    db.models.orderBy("createdAt").reverse().toArray()
  );
  const consultations = useLiveQuery(() => db.consultations.toArray());

  if (models === undefined) {
    return (
      <div className="flex items-center justify-center flex-1">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (models.length === 0) {
    return <EmptyState />;
  }

  const consultationsByModel = (consultations ?? []).reduce(
    (acc, c) => {
      acc[c.modelId] = (acc[c.modelId] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Your Parts</h1>
        <Link href="/scan">
          <Button size="sm">
            <Plus className="mr-1 h-4 w-4" />
            New Scan
          </Button>
        </Link>
      </div>
      <div className="space-y-3">
        {models.map((model) => (
          <ScanCard
            key={model.id}
            model={model}
            consultationCount={consultationsByModel[model.id] || 0}
          />
        ))}
      </div>
    </div>
  );
}
