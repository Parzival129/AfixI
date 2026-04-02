"use client";

import {
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  Info,
  Shield,
  Printer,
  Layers,
  RotateCcw,
  Clock,
  Scale,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { ConsultationResult } from "@/types/consultation";

const CONFIDENCE_COLORS = {
  high: "bg-green-500/10 text-green-600 dark:text-green-400",
  medium: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  low: "bg-red-500/10 text-red-600 dark:text-red-400",
};

const SEVERITY_CONFIG = {
  info: { icon: Info, color: "text-blue-500", bg: "bg-blue-500/10" },
  warning: {
    icon: AlertTriangle,
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
  },
  critical: { icon: Shield, color: "text-red-500", bg: "bg-red-500/10" },
};

interface ResultsDisplayProps {
  result: ConsultationResult;
}

export function ResultsDisplay({ result }: ResultsDisplayProps) {
  return (
    <div className="space-y-6">
      {/* Primary Recommendation */}
      <Card className="border-primary/30">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                Recommended Filament
              </p>
              <h2 className="text-2xl font-bold text-primary">
                {result.recommendedFilament.primary.material}
              </h2>
              {result.recommendedFilament.primary.brand && (
                <p className="text-sm text-muted-foreground">
                  Brand: {result.recommendedFilament.primary.brand}
                </p>
              )}
            </div>
            <Badge className={CONFIDENCE_COLORS[result.overallConfidence]}>
              {result.overallConfidence} confidence
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {result.recommendedFilament.primary.reasoning}
          </p>
        </CardContent>
      </Card>

      {/* Print Estimate — time & cost */}
      {(result.estimatedPrintTime || result.estimatedCost) && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-4">
              {result.estimatedPrintTime && (
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">
                      Print Time
                    </p>
                    <p className="text-lg font-bold">
                      {result.estimatedPrintTime}
                    </p>
                  </div>
                </div>
              )}
              {result.estimatedCost && (
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">
                      Total Cost
                    </p>
                    <p className="text-lg font-bold">
                      {result.estimatedCost.totalCost}
                    </p>
                  </div>
                </div>
              )}
            </div>
            {result.estimatedCost && (
              <div className="mt-4 pt-3 border-t border-primary/10">
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div className="flex items-center gap-1.5">
                    <Scale className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-muted-foreground">Filament:</span>
                    <span className="font-medium">{result.estimatedCost.filamentGrams}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Material:</span>{" "}
                    <span className="font-medium">{result.estimatedCost.filamentCost}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Power:</span>{" "}
                    <span className="font-medium">{result.estimatedCost.electricityCost}</span>
                  </div>
                </div>
                {result.estimatedCost.notes && (
                  <p className="text-xs text-muted-foreground mt-2">
                    {result.estimatedCost.notes}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Material Analysis */}
      {result.materialAnalysis && (
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Why This Material?</h3>
            <div className="space-y-4 text-sm">
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                {result.materialAnalysis.whyThisMaterial.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
              <Separator />
              <div>
                <p className="font-medium mb-1">Compared to Original Material</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  {result.materialAnalysis.comparedToOriginal.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-medium mb-1">Environmental Suitability</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  {result.materialAnalysis.environmentalFit.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-medium mb-1">Structural Suitability</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  {result.materialAnalysis.structuralFit.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-medium mb-1">Tradeoffs</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  {result.materialAnalysis.tradeoffs.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommended Printers */}
      {result.recommendedPrinters?.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Printer className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Recommended Printers</h3>
            </div>
            <div className="space-y-3">
              {result.recommendedPrinters.map((p, i) => (
                <div key={i} className="flex items-start gap-3 rounded-lg border border-border p-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{p.model}</p>
                      {p.fromUserList && (
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                          Your printer
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{p.reasoning}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Printer Settings */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Printer className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Printer Settings</h3>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              ["Nozzle Temp", result.printerSettings.nozzleTemp],
              ["Bed Temp", result.printerSettings.bedTemp],
              ["Layer Height", result.printerSettings.layerHeight],
              ["Infill", result.printerSettings.infillPercentage],
              ["Infill Pattern", result.printerSettings.infillPattern],
              ["Print Speed", result.printerSettings.printSpeed],
              ["Wall Count", result.printerSettings.wallCount],
              [
                "Supports",
                result.printerSettings.supportRequired ? "Required" : "Not needed",
              ],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="font-medium">{value}</p>
              </div>
            ))}
          </div>
          {result.printerSettings.supportNotes && (
            <p className="text-xs text-muted-foreground mt-3">
              {result.printerSettings.supportNotes}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Print Orientation */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <RotateCcw className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Print Orientation</h3>
          </div>
          <p className="text-sm font-medium">
            {result.printOrientation.recommendation}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {result.printOrientation.reasoning}
          </p>
        </CardContent>
      </Card>

      {/* Structural Considerations */}
      {result.structuralConsiderations.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Structural Considerations</h3>
            <div className="space-y-3">
              {result.structuralConsiderations.map((item, i) => {
                const config = SEVERITY_CONFIG[item.severity];
                const Icon = config.icon;
                return (
                  <div
                    key={i}
                    className={`flex gap-3 rounded-lg p-3 ${config.bg}`}
                  >
                    <Icon className={`h-5 w-5 flex-shrink-0 mt-0.5 ${config.color}`} />
                    <div>
                      <p className="text-sm font-medium">{item.concern}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {item.recommendation}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Post-Processing */}
      {result.postProcessing.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Layers className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Post-Processing Steps</h3>
            </div>
            <div className="space-y-2">
              {result.postProcessing.map((step, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-2"
                >
                  <CheckCircle2
                    className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                      step.required ? "text-primary" : "text-muted-foreground"
                    }`}
                  />
                  <div>
                    <p className="text-sm font-medium">
                      {step.step}
                      {step.required && (
                        <Badge variant="outline" className="ml-2 text-[10px]">
                          Required
                        </Badge>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alternatives */}
      {result.recommendedFilament.alternatives.length > 0 && (
        <Accordion>
          <AccordionItem value="alternatives">
            <AccordionTrigger className="text-sm">
              Alternative Materials ({result.recommendedFilament.alternatives.length})
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                {result.recommendedFilament.alternatives.map((alt, i) => (
                  <div key={i} className="rounded-lg border border-border p-3">
                    <p className="text-sm font-medium">{alt.material}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {alt.reasoning}
                    </p>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}

      {/* Disclaimers */}
      {result.disclaimers.length > 0 && (
        <>
          <Separator />
          <div className="space-y-1">
            {result.disclaimers.map((d, i) => (
              <p key={i} className="text-xs text-muted-foreground">
                * {d}
              </p>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
