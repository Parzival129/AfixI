import type { EnvironmentInput, LoadInput, MaterialInput } from "./material";
import type { Measurement } from "./model";

export interface ConsultationRequest {
  modelId: string;
  measurements: Measurement[];
  material: MaterialInput;
  environment: EnvironmentInput;
  loadRequirements: LoadInput;
  availablePrinters?: string[];
  availableFilaments?: string[];
}

export interface FilamentRecommendation {
  material: string;
  brand?: string;
  reasoning: string;
}

export interface MaterialAnalysis {
  whyThisMaterial: string[];
  comparedToOriginal: string[];
  environmentalFit: string[];
  structuralFit: string[];
  tradeoffs: string[];
}

export interface PrinterRecommendation {
  model: string;
  reasoning: string;
  fromUserList: boolean;
}

export interface PrinterSettings {
  nozzleTemp: string;
  bedTemp: string;
  layerHeight: string;
  infillPercentage: string;
  infillPattern: string;
  printSpeed: string;
  wallCount: string;
  supportRequired: boolean;
  supportNotes?: string;
}

export interface PostProcessingStep {
  step: string;
  description: string;
  required: boolean;
}

export interface StructuralConsideration {
  concern: string;
  recommendation: string;
  severity: "info" | "warning" | "critical";
}

export interface ConsultationResult {
  recommendedFilament: {
    primary: FilamentRecommendation;
    alternatives: FilamentRecommendation[];
  };
  materialAnalysis: MaterialAnalysis;
  recommendedPrinters: PrinterRecommendation[];
  printerSettings: PrinterSettings;
  postProcessing: PostProcessingStep[];
  structuralConsiderations: StructuralConsideration[];
  printOrientation: {
    recommendation: string;
    reasoning: string;
  };
  estimatedPrintTime?: string;
  estimatedCost?: {
    filamentGrams: string;
    filamentCost: string;
    electricityCost: string;
    totalCost: string;
    currency: string;
    notes?: string;
  };
  overallConfidence: "high" | "medium" | "low";
  disclaimers: string[];
}

export interface ConsultationRecord {
  id: string;
  modelId: string;
  request: ConsultationRequest;
  result?: ConsultationResult;
  status: "pending" | "complete" | "error";
  errorMessage?: string;
  createdAt: string;
}
