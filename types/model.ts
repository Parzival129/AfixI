export interface Measurement {
  id: string;
  point1: [number, number, number];
  point2: [number, number, number];
  distanceMm: number;
  label: string;
}

export interface ModelRecord {
  id: string;
  name: string;
  fileBlob: Blob;
  fileType: "glb" | "stl";
  measurements: Measurement[];
  thumbnailBlob?: Blob;
  createdAt: string;
  updatedAt: string;
}
