export type HumidityLevel = "low" | "medium" | "high" | "submerged";
export type UVExposure = "none" | "indoor" | "outdoor";
export type ChemicalExposure =
  | "water"
  | "oils"
  | "solvents"
  | "acids"
  | "alkalis"
  | "food-safe";
export type LoadType = "static" | "dynamic" | "impact";
export type Flexibility = "rigid" | "semi-flex" | "flexible";

export interface MaterialInput {
  currentMaterial: string;
  colorPreference: string;
  surfaceFinish: string;
}

export interface EnvironmentInput {
  tempMin: number;
  tempMax: number;
  humidity: HumidityLevel;
  uvExposure: UVExposure;
  chemicalExposure: ChemicalExposure[];
  indoor: boolean;
}

export interface LoadInput {
  loadBearing: boolean;
  loadType?: LoadType;
  estimatedForceN?: number;
  flexibility: Flexibility;
  toleranceMm: number;
  lifespanYears: number;
}
