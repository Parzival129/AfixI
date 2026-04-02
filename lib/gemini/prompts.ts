import type { ConsultationRequest } from "@/types/consultation";

export const SYSTEM_PROMPT = `You are an expert materials engineer and 3D printing consultant with deep knowledge of FDM, SLA, and SLS printing technologies.

Analyze part specifications and recommend optimal 3D printing parameters. Provide practical, actionable advice based on the specific use case. Consider material properties, environmental conditions, structural requirements, and post-processing needs.

When recommending a filament, justify the choice with concise bullet points (not paragraphs). Compare it to the original material, explain how it handles the given conditions, and honestly list tradeoffs.

Also recommend specific 3D printers suited for the part. If the user provides a list of printers they own, prioritize from that list and set fromUserList to true. Otherwise recommend well-known printers and set fromUserList to false.

Always prioritize safety for load-bearing applications. When uncertain, err on the side of caution and recommend stronger materials and more conservative print settings.

Respond ONLY with valid JSON matching the requested schema. No markdown, no code fences, no explanatory text outside the JSON.`;

export function buildUserPrompt(request: ConsultationRequest): string {
  const { measurements, material, environment, loadRequirements, availablePrinters, availableFilaments } = request;

  const measurementDesc =
    measurements.length > 0
      ? measurements
          .map((m) => `  - ${m.label}: ${m.distanceMm} mm`)
          .join("\n")
      : "  No measurements recorded.";

  return `## Part Specifications
Measurements:
${measurementDesc}

## Current Part Material
- Original material: ${material.currentMaterial || "Not specified"}
- Color preference: ${material.colorPreference || "None specified"}
- Surface finish: ${material.surfaceFinish}

## Operating Environment
- Temperature range: ${environment.tempMin}°C to ${environment.tempMax}°C
- Humidity: ${environment.humidity}
- UV exposure: ${environment.uvExposure}
- Chemical exposure: ${environment.chemicalExposure.length > 0 ? environment.chemicalExposure.join(", ") : "None"}
- Usage: ${environment.indoor ? "Indoor" : "Outdoor"}

## Structural Requirements
- Load-bearing: ${loadRequirements.loadBearing ? "Yes" : "No"}${
    loadRequirements.loadBearing
      ? `
- Load type: ${loadRequirements.loadType || "Not specified"}
- Estimated force: ${loadRequirements.estimatedForceN ? `${loadRequirements.estimatedForceN} N` : "Not specified"}`
      : ""
  }
- Flexibility: ${loadRequirements.flexibility}
- Dimensional tolerance: ${loadRequirements.toleranceMm} mm
- Expected lifespan: ${loadRequirements.lifespanYears} years
${availablePrinters?.length || availableFilaments?.length ? `
## Available Equipment${availablePrinters?.length ? `
- Printers: ${availablePrinters.join(", ")}` : ""}${availableFilaments?.length ? `
- Filaments: ${availableFilaments.join(", ")}` : ""}
IMPORTANT: Prioritize recommendations from the user's available equipment. If none of their available filaments are suitable, explain why and recommend the best alternative.
` : ""}
## Response Format
Respond with a JSON object containing:
{
  "recommendedFilament": {
    "primary": { "material": "string", "brand": "string (optional)", "reasoning": "string (brief summary)" },
    "alternatives": [{ "material": "string", "reasoning": "string" }]
  },
  "materialAnalysis": {
    "whyThisMaterial": ["concise bullet point", "another bullet point"],
    "comparedToOriginal": ["bullet point comparing to original material"],
    "environmentalFit": ["bullet point on temperature/humidity/UV/chemical handling"],
    "structuralFit": ["bullet point on load/flexibility/tolerance suitability"],
    "tradeoffs": ["bullet point on limitations to watch out for"]
  },
  "recommendedPrinters": [
    { "model": "string (specific printer model name)", "reasoning": "string (why this printer suits the part)", "fromUserList": "boolean (true if from user's available printers)" }
  ],
  "printerSettings": {
    "nozzleTemp": "string (range like 200-210°C)",
    "bedTemp": "string",
    "layerHeight": "string",
    "infillPercentage": "string (e.g. 60-80%)",
    "infillPattern": "string",
    "printSpeed": "string",
    "wallCount": "string",
    "supportRequired": boolean,
    "supportNotes": "string (optional)"
  },
  "postProcessing": [{ "step": "string", "description": "string", "required": boolean }],
  "structuralConsiderations": [{ "concern": "string", "recommendation": "string", "severity": "info|warning|critical" }],
  "printOrientation": { "recommendation": "string", "reasoning": "string" },
  "estimatedPrintTime": "string (optional, e.g. '2h 30m')",
  "estimatedCost": {
    "filamentGrams": "string (estimated weight, e.g. '45g')",
    "filamentCost": "string (e.g. '$1.35')",
    "electricityCost": "string (e.g. '$0.15')",
    "totalCost": "string (e.g. '$1.50')",
    "currency": "string (e.g. 'USD')",
    "notes": "string (optional, any caveats about the estimate)"
  },
  "overallConfidence": "high|medium|low",
  "disclaimers": ["string"]
}`;
}
