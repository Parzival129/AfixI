import Dexie, { type EntityTable } from "dexie";
import type { ConsultationRecord } from "@/types/consultation";
import type { ModelRecord } from "@/types/model";

export interface CaptureSession {
  id: string;
  images: Blob[];
  status: "capturing" | "complete" | "processing" | "failed";
  createdAt: string;
}

const db = new Dexie("AfixIDB") as Dexie & {
  models: EntityTable<ModelRecord, "id">;
  consultations: EntityTable<ConsultationRecord, "id">;
  captures: EntityTable<CaptureSession, "id">;
};

db.version(1).stores({
  models: "id, name, createdAt",
  consultations: "id, modelId, createdAt",
  captures: "id, status, createdAt",
});

export { db };
