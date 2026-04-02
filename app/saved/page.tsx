"use client";

import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { ScanCard } from "@/components/dashboard/scan-card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function SavedPage() {
  const [search, setSearch] = useState("");

  const models = useLiveQuery(() =>
    db.models.orderBy("createdAt").reverse().toArray()
  );
  const consultations = useLiveQuery(() => db.consultations.toArray());

  const filtered = (models ?? []).filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  const consultationsByModel = (consultations ?? []).reduce(
    (acc, c) => {
      acc[c.modelId] = (acc[c.modelId] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto w-full">
      <h1 className="text-2xl font-bold mb-4">Saved Parts</h1>
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>
      {filtered.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">
          {search ? "No parts match your search." : "No saved parts yet."}
        </p>
      ) : (
        <div className="space-y-3">
          {filtered.map((model) => (
            <ScanCard
              key={model.id}
              model={model}
              consultationCount={consultationsByModel[model.id] || 0}
            />
          ))}
        </div>
      )}
    </div>
  );
}
