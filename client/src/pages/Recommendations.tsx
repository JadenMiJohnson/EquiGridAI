import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { PersonaSwitch } from "@/components/PersonaSwitch";
import { Sparkles, TrendingDown, Leaf, DollarSign, Heart } from "lucide-react";
import { formatCurrency, formatCO2, formatPercent, formatCII } from "@/lib/formatters";
import type { RecommendationResponse, OperatorControls, CloudControls } from "@shared/schema";

export default function Recommendations() {
  const { session } = useAuth();
  const { toast } = useToast();
  
  const [operatorControls, setOperatorControls] = useState<OperatorControls>({
    cooling_setpoint_delta_f: 2,
    containment_pct: 80,
    batch_deferral_pct: 20,
  });

  const [cloudControls, setCloudControls] = useState<CloudControls>({
    shift_pct: 30,
    target_region: "us-west",
    target_hours: "9pm-1am",
  });

  const [result, setResult] = useState<RecommendationResponse | null>(null);

  const recMutation = useMutation({
    mutationFn: async () => {
      const controls = session?.role === "operator" ? operatorControls : cloudControls;
      return await apiRequest("POST", "/api/recommendations", {
        persona: session?.role,
        controls,
        companyName: session?.companyName,
      });
    },
    onSuccess: (data: RecommendationResponse) => {
      setResult(data);
      toast({
        title: "Recommendations generated",
        description: `Using ${data.source === "openai" ? "AI-powered" : "rule-based"} analysis`,
      });
    },
    onError: () => {
      toast({
        title: "Generation failed",
        description: "Unable to generate recommendations. Please try again.",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2" data-testid="text-recommendations-title">
            AI Recommendations
          </h1>
          <p className="text-muted-foreground">
            {session?.role === "operator" 
              ? "Optimize cooling systems and batch scheduling"
              : "Shift workloads for cleaner, cheaper energy"
            }
          </p>
        </div>
        <PersonaSwitch />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Controls Panel */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-6">Optimization Controls</h2>
            
            {session?.role === "operator" ? (
              <div className="space-y-6">
                <div>
                  <Label>Cooling Setpoint Increase: {operatorControls.cooling_setpoint_delta_f}°F</Label>
                  <Slider
                    value={[operatorControls.cooling_setpoint_delta_f]}
                    onValueChange={([value]) => setOperatorControls({ ...operatorControls, cooling_setpoint_delta_f: value })}
                    min={0}
                    max={10}
                    step={1}
                    className="mt-2"
                    data-testid="slider-cooling"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Reduces cooling power consumption by ~6-8% per degree
                  </p>
                </div>

                <div>
                  <Label>Hot/Cold Containment: {operatorControls.containment_pct}%</Label>
                  <Slider
                    value={[operatorControls.containment_pct]}
                    onValueChange={([value]) => setOperatorControls({ ...operatorControls, containment_pct: value })}
                    min={0}
                    max={100}
                    step={5}
                    className="mt-2"
                    data-testid="slider-containment"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Improves PUE through better airflow management
                  </p>
                </div>

                <div>
                  <Label>Batch Deferral (3-7pm → 9pm-1am): {operatorControls.batch_deferral_pct}%</Label>
                  <Slider
                    value={[operatorControls.batch_deferral_pct]}
                    onValueChange={([value]) => setOperatorControls({ ...operatorControls, batch_deferral_pct: value })}
                    min={0}
                    max={100}
                    step={5}
                    className="mt-2"
                    data-testid="slider-batch-deferral"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Shift batch jobs to cleaner, cheaper hours
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <Label>Workload Shift Percentage: {cloudControls.shift_pct}%</Label>
                  <Slider
                    value={[cloudControls.shift_pct]}
                    onValueChange={([value]) => setCloudControls({ ...cloudControls, shift_pct: value })}
                    min={0}
                    max={60}
                    step={5}
                    className="mt-2"
                    data-testid="slider-shift-pct"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Percentage of training workloads to shift
                  </p>
                </div>

                <div>
                  <Label>Target Region</Label>
                  <Select
                    value={cloudControls.target_region}
                    onValueChange={(value: any) => setCloudControls({ ...cloudControls, target_region: value })}
                  >
                    <SelectTrigger className="mt-2" data-testid="select-region">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us-east">US East</SelectItem>
                      <SelectItem value="us-west">US West</SelectItem>
                      <SelectItem value="us-central">US Central</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    Target region with cleaner energy mix
                  </p>
                </div>

                <div>
                  <Label>Target Hours</Label>
                  <Select
                    value={cloudControls.target_hours}
                    onValueChange={(value) => setCloudControls({ ...cloudControls, target_hours: value })}
                  >
                    <SelectTrigger className="mt-2" data-testid="select-hours">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="9pm-1am">9pm-1am (Off-Peak)</SelectItem>
                      <SelectItem value="1am-6am">1am-6am (Late Night)</SelectItem>
                      <SelectItem value="6am-10am">6am-10am (Morning)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    Target time window for workload execution
                  </p>
                </div>
              </div>
            )}

            <Button
              onClick={() => recMutation.mutate()}
              disabled={recMutation.isPending}
              className="w-full mt-6"
              size="lg"
              data-testid="button-generate"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              {recMutation.isPending ? "Generating..." : "Generate Recommendations"}
            </Button>
          </Card>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-3 space-y-6">
          {result ? (
            <>
              {/* ROI Widget */}
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-primary" />
                  ROI Summary
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <DollarSign className="h-6 w-6 text-chart-1 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-chart-1" data-testid="roi-cost">
                      {formatCurrency(result.roi.costSavedUSD)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">Cost Saved</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <TrendingDown className="h-6 w-6 text-chart-1 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-chart-1" data-testid="roi-savings">
                      {formatPercent(result.roi.savingsPct)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">Savings</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <Leaf className="h-6 w-6 text-chart-1 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-chart-1" data-testid="roi-emissions">
                      {formatCO2(result.roi.emissionsAvoidedTons * 1000)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">CO₂ Avoided</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <Heart className="h-6 w-6 text-chart-1 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-chart-1" data-testid="roi-cii">
                      +{formatCII(result.roi.ciiDelta)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">CII Improvement</div>
                  </div>
                </div>
              </Card>

              {/* AI Recommendations */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Recommendations
                  </h2>
                  <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                    {result.source === "openai" ? "AI-Powered" : "Rule-Based"}
                  </span>
                </div>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed" data-testid="text-recommendations">
                    {result.recommendations}
                  </div>
                </div>
              </Card>
            </>
          ) : (
            <Card className="p-12 text-center">
              <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">Ready to optimize?</p>
              <p className="text-sm text-muted-foreground">
                Adjust the controls and click "Generate Recommendations" to receive AI-powered insights
                tailored to your {session?.role === "operator" ? "facility" : "workload"} optimization goals.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
