"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";

export function useModel(id: string) {
  const model = useLiveQuery(() => db.models.get(id), [id]);
  return model;
}
