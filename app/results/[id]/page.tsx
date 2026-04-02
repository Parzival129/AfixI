"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";

export default function ResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const consultation = useLiveQuery(() => db.consultations.get(id), [id]);

  useEffect(() => {
    if (consultation === null) {
      router.replace("/");
    } else if (consultation?.modelId) {
      router.replace(`/model/${consultation.modelId}`);
    }
  }, [consultation, router]);

  return (
    <div className="flex items-center justify-center flex-1">
      <div className="animate-pulse text-muted-foreground">Redirecting...</div>
    </div>
  );
}
