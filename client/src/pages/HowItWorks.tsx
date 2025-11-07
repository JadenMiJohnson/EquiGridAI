import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Database, BarChart3, Zap, ArrowRight } from "lucide-react";

export default function HowItWorks() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6" data-testid="text-howitworks-title">
            How It Works
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Three simple steps to optimize your energy operations for cost, carbon, and community impact
          </p>
        </div>
      </section>

      {/* 3-Step Flow */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto space-y-16">
            {/* Step 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-xl mb-4">
                  1
                </div>
                <h2 className="text-3xl font-bold mb-4">Connect Your Data</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Choose between Mock Mode (pre-loaded demo data) or Live Mode (connect to free government and weather APIs). No proprietary data required—we leverage public sources like EIA, EPA AirNow, CAMD, Census, and Open-Meteo.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                    <span className="text-muted-foreground">Toggle Live/Mock mode in one click</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                    <span className="text-muted-foreground">Securely store API keys server-side</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                    <span className="text-muted-foreground">Hourly automatic refresh when in Live mode</span>
                  </li>
                </ul>
              </div>
              <Card className="order-1 md:order-2 p-8 bg-gradient-to-br from-primary/10 to-primary/5" data-testid="card-step-1">
                <Database className="h-20 w-20 text-primary mb-4" />
                <div className="text-sm font-mono text-muted-foreground space-y-2">
                  <div>✓ EIA Grid Mix</div>
                  <div>✓ EPA Air Quality</div>
                  <div>✓ Weather Data</div>
                  <div>✓ Demographics</div>
                </div>
              </Card>
            </div>

            {/* Arrow */}
            <div className="flex justify-center">
              <ArrowRight className="h-8 w-8 text-muted-foreground" />
            </div>

            {/* Step 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <Card className="p-8 bg-gradient-to-br from-chart-2/10 to-chart-2/5" data-testid="card-step-2">
                <BarChart3 className="h-20 w-20 text-chart-2 mb-4" />
                <div className="text-sm font-mono text-muted-foreground space-y-2">
                  <div>→ Carbon Intensity</div>
                  <div>→ Cost Analysis</div>
                  <div>→ Community Impact</div>
                  <div>→ Cleaner Hours</div>
                </div>
              </Card>
              <div>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-chart-2 text-white font-bold text-xl mb-4">
                  2
                </div>
                <h2 className="text-3xl font-bold mb-4">Analyze & Visualize</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Our engine processes real-time data to compute key metrics: carbon intensity (kgCO₂/kWh), energy costs, air quality impact, and our proprietary Community Impact Index (CII) that combines environmental and social factors.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-chart-2 mt-2" />
                    <span className="text-muted-foreground">Interactive maps with ZIP-level granularity</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-chart-2 mt-2" />
                    <span className="text-muted-foreground">24-hour trend charts for optimization windows</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-chart-2 mt-2" />
                    <span className="text-muted-foreground">Persona-specific dashboards (Operator vs Cloud)</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex justify-center">
              <ArrowRight className="h-8 w-8 text-muted-foreground" />
            </div>

            {/* Step 3 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-chart-3 text-white font-bold text-xl mb-4">
                  3
                </div>
                <h2 className="text-3xl font-bold mb-4">Optimize & Report</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Get AI-powered recommendations tailored to your persona. Operators optimize cooling and batch scheduling; Cloud users shift workloads across regions and times. Export compliance reports with ROI documentation.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-chart-3 mt-2" />
                    <span className="text-muted-foreground">GPT-5 powered recommendations with ROI calculations</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-chart-3 mt-2" />
                    <span className="text-muted-foreground">Scenario comparison (baseline vs optimized)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-chart-3 mt-2" />
                    <span className="text-muted-foreground">Automated ESG report generation (DOCX/PDF)</span>
                  </li>
                </ul>
              </div>
              <Card className="order-1 md:order-2 p-8 bg-gradient-to-br from-chart-3/10 to-chart-3/5" data-testid="card-step-3">
                <Zap className="h-20 w-20 text-chart-3 mb-4" />
                <div className="text-sm font-mono text-muted-foreground space-y-2">
                  <div>💰 Cost: -25%</div>
                  <div>🌱 CO₂: -40%</div>
                  <div>📊 CII: +15 pts</div>
                  <div>✅ Report Ready</div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Explore the Energy Zone tool or request a personalized demo
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/energy-zone">
              <Button size="lg" data-testid="button-cta-energy-zone">
                Try Energy Zone
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline" data-testid="button-cta-demo">
                Request Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
