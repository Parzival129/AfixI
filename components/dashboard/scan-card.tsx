"use client";

import Link from "next/link";
import { Box, Clock, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ModelRecord } from "@/types/model";

interface ScanCardProps {
  model: ModelRecord;
  consultationCount: number;
}

export function ScanCard({ model, consultationCount }: ScanCardProps) {
  const date = new Date(model.createdAt);
  const formatted = date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Link href={`/model/${model.id}`}>
      <Card className="group hover:border-primary/50 transition-colors cursor-pointer">
        <CardContent className="flex items-center gap-4 p-4">
          <div className="flex-shrink-0 rounded-lg bg-primary/10 p-3">
            <Box className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{model.name}</p>
            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{formatted}</span>
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                {model.fileType.toUpperCase()}
              </Badge>
              {consultationCount > 0 && (
                <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                  {consultationCount} consultation{consultationCount !== 1 ? "s" : ""}
                </Badge>
              )}
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </CardContent>
      </Card>
    </Link>
  );
}
