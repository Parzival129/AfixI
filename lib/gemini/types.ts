import { z } from "zod";

export const ConsultationResultSchema = z.object({
  recommendedFilament: z.object({
    primary: z.object({
      material: z.string(),
      brand: z.string().optional(),
      reasoning: z.string(),
    }),
    alternatives: z.array(
      z.object({
        material: z.string(),
        reasoning: z.string(),
      })
    ),
  }),
  materialAnalysis: z.object({
    whyThisMaterial: z.array(z.string()),
    comparedToOriginal: z.array(z.string()),
    environmentalFit: z.array(z.string()),
    structuralFit: z.array(z.string()),
    tradeoffs: z.array(z.string()),
  }),
  recommendedPrinters: z.array(
    z.object({
      model: z.string(),
      reasoning: z.string(),
      fromUserList: z.boolean(),
    })
  ),
  printerSettings: z.object({
    nozzleTemp: z.string(),
    bedTemp: z.string(),
    layerHeight: z.string(),
    infillPercentage: z.string(),
    infillPattern: z.string(),
    printSpeed: z.string(),
    wallCount: z.string(),
    supportRequired: z.boolean(),
    supportNotes: z.string().optional(),
  }),
  postProcessing: z.array(
    z.object({
      step: z.string(),
      description: z.string(),
      required: z.boolean(),
    })
  ),
  structuralConsiderations: z.array(
    z.object({
      concern: z.string(),
      recommendation: z.string(),
      severity: z.enum(["info", "warning", "critical"]),
    })
  ),
  printOrientation: z.object({
    recommendation: z.string(),
    reasoning: z.string(),
  }),
  estimatedPrintTime: z.string().optional(),
  estimatedCost: z.object({
    filamentGrams: z.string(),
    filamentCost: z.string(),
    electricityCost: z.string(),
    totalCost: z.string(),
    currency: z.string(),
    notes: z.string().optional(),
  }).optional(),
  overallConfidence: z.enum(["high", "medium", "low"]),
  disclaimers: z.array(z.string()),
});
