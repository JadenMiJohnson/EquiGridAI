import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, TrendingDown, TrendingUp } from "lucide-react";
import { formatCurrency, formatKwh, formatCO2, formatCII } from "@/lib/formatters";
import type { SummaryData } from "@shared/schema";

export default function Summary() {
  const { data: summary, isLoading } = useQuery<SummaryData>({
    queryKey: ["/api/summary"],
  });

  const handleExportPDF = () => {
    // TODO: Implement PDF export
    console.log("Exporting PDF...");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2" data-testid="text-summary-title">
            ROI & Impact Summary
          </h1>
          <p className="text-muted-foreground">
            Comprehensive overview of optimization results
          </p>
        </div>
        <Button onClick={handleExportPDF} data-testid="button-export-pdf">
          <Download className="h-4 w-4 mr-2" />
          Export PDF
        </Button>
      </div>

      {/* Before/After Comparison */}
      <Card className="p-6 mb-6">
        <h2 className="text-xl font-semibold mb-6">Performance Comparison</h2>
        
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-muted animate-pulse rounded" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 font-semibold">Metric</th>
                  <th className="text-right py-3 px-2 font-semibold">Before</th>
                  <th className="text-right py-3 px-2 font-semibold">After</th>
                  <th className="text-right py-3 px-2 font-semibold">Change</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b" data-testid="row-cost">
                  <td className="py-3 px-2">Cost</td>
                  <td className="py-3 px-2 text-right font-mono">
                    {summary ? formatCurrency(summary.before.cost_usd) : "-"}
                  </td>
                  <td className="py-3 px-2 text-right font-mono">
                    {summary ? formatCurrency(summary.after.cost_usd) : "-"}
                  </td>
                  <td className="py-3 px-2 text-right">
                    {summary && (
                      <div className="inline-flex items-center gap-1 text-chart-1">
                        <TrendingDown className="h-4 w-4" />
                        <span className="font-mono">
                          {formatCurrency(summary.before.cost_usd - summary.after.cost_usd)}
                        </span>
                      </div>
                    )}
                  </td>
                </tr>
                <tr className="border-b" data-testid="row-energy">
                  <td className="py-3 px-2">Energy Usage</td>
                  <td className="py-3 px-2 text-right font-mono">
                    {summary ? formatKwh(summary.before.kwh) : "-"}
                  </td>
                  <td className="py-3 px-2 text-right font-mono">
                    {summary ? formatKwh(summary.after.kwh) : "-"}
                  </td>
                  <td className="py-3 px-2 text-right">
                    {summary && (
                      <div className="inline-flex items-center gap-1 text-chart-1">
                        <TrendingDown className="h-4 w-4" />
                        <span className="font-mono">
                          {formatKwh(summary.before.kwh - summary.after.kwh)}
                        </span>
                      </div>
                    )}
                  </td>
                </tr>
                <tr className="border-b" data-testid="row-emissions">
                  <td className="py-3 px-2">CO₂ Emissions</td>
                  <td className="py-3 px-2 text-right font-mono">
                    {summary ? formatCO2(summary.before.co2_tons * 1000) : "-"}
                  </td>
                  <td className="py-3 px-2 text-right font-mono">
                    {summary ? formatCO2(summary.after.co2_tons * 1000) : "-"}
                  </td>
                  <td className="py-3 px-2 text-right">
                    {summary && (
                      <div className="inline-flex items-center gap-1 text-chart-1">
                        <TrendingDown className="h-4 w-4" />
                        <span className="font-mono">
                          {formatCO2((summary.before.co2_tons - summary.after.co2_tons) * 1000)}
                        </span>
                      </div>
                    )}
                  </td>
                </tr>
                <tr data-testid="row-cii">
                  <td className="py-3 px-2">Community Impact</td>
                  <td className="py-3 px-2 text-right font-mono">
                    {summary ? formatCII(summary.before.cii) : "-"}
                  </td>
                  <td className="py-3 px-2 text-right font-mono">
                    {summary ? formatCII(summary.after.cii) : "-"}
                  </td>
                  <td className="py-3 px-2 text-right">
                    {summary && (
                      <div className="inline-flex items-center gap-1 text-chart-1">
                        <TrendingUp className="h-4 w-4" />
                        <span className="font-mono">
                          +{formatCII(summary.after.cii - summary.before.cii)} pts
                        </span>
                      </div>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Top Impacted ZIPs */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">Top Impacted ZIP Codes</h2>
        
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {summary?.top_impacted_zips.map((zip, index) => (
              <div
                key={zip.zip}
                className="flex items-center justify-between p-4 rounded-lg border"
                data-testid={`zip-impact-${zip.zip}`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-mono font-semibold">ZIP {zip.zip}</div>
                    <div className="text-sm text-muted-foreground">
                      CII: {formatCII(zip.cii_before)} → {formatCII(zip.cii_after)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center gap-1 text-chart-1 font-semibold">
                    <TrendingUp className="h-4 w-4" />
                    +{formatCII(zip.cii_delta)} pts
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    CII Improvement
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && (!summary?.top_impacted_zips || summary.top_impacted_zips.length === 0) && (
          <div className="text-center py-8 text-muted-foreground">
            No optimization data available. Run recommendations to see impact analysis.
          </div>
        )}
      </Card>
    </div>
  );
}
