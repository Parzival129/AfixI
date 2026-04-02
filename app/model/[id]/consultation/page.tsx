"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ConsultationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  useEffect(() => {
    router.replace(`/model/${id}`);
  }, [id, router]);

  return (
    <div className="flex items-center justify-center flex-1">
      <div className="animate-pulse text-muted-foreground">Redirecting...</div>
    </div>
  );
}
