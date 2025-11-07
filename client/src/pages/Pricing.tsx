import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Check, Zap, Building2, Rocket } from "lucide-react";

export default function Pricing() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6" data-testid="text-pricing-title">
            Pricing Plans
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose the plan that fits your organization's needs
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Plan */}
            <Card className="p-8 flex flex-col" data-testid="card-plan-free">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="h-8 w-8 text-primary" />
                <h3 className="text-2xl font-bold">Free</h3>
              </div>
              <div className="mb-6">
                <div className="text-4xl font-bold mb-2">$0</div>
                <div className="text-sm text-muted-foreground">Perfect for exploring</div>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Mock data mode with demo scenarios</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Energy Zone public tool access</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Basic KPI dashboards</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Rule-based recommendations</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Community Impact Index (CII)</span>
                </li>
              </ul>
              <Link href="/login">
                <Button variant="outline" className="w-full" data-testid="button-select-free">
                  Get Started Free
                </Button>
              </Link>
            </Card>

            {/* Pro Plan */}
            <Card className="p-8 flex flex-col border-primary border-2 relative" data-testid="card-plan-pro">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </div>
              <div className="flex items-center gap-3 mb-4">
                <Building2 className="h-8 w-8 text-primary" />
                <h3 className="text-2xl font-bold">Pro</h3>
              </div>
              <div className="mb-6">
                <div className="text-4xl font-bold mb-2">$499<span className="text-xl text-muted-foreground">/mo</span></div>
                <div className="text-sm text-muted-foreground">For growing teams</div>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm font-medium">Everything in Free, plus:</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Live API mode with real-time data</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">AI-powered recommendations (GPT-5)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Automated ESG report generation</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Custom DOCX template upload</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Scenario optimization & ROI tracking</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Multi-region workload analysis</span>
                </li>
              </ul>
              <Link href="/demo">
                <Button className="w-full" data-testid="button-select-pro">
                  Request Demo
                </Button>
              </Link>
            </Card>

            {/* Enterprise Plan */}
            <Card className="p-8 flex flex-col" data-testid="card-plan-enterprise">
              <div className="flex items-center gap-3 mb-4">
                <Rocket className="h-8 w-8 text-primary" />
                <h3 className="text-2xl font-bold">Enterprise</h3>
              </div>
              <div className="mb-6">
                <div className="text-4xl font-bold mb-2">Custom</div>
                <div className="text-sm text-muted-foreground">For large organizations</div>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm font-medium">Everything in Pro, plus:</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Dedicated account manager</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Custom API integrations</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">White-label options</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Multi-facility management</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Advanced analytics & forecasting</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Priority support & training</span>
                </li>
              </ul>
              <Link href="/demo">
                <Button variant="outline" className="w-full" data-testid="button-select-enterprise">
                  Contact Sales
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-2">What's included in the free plan?</h3>
              <p className="text-sm text-muted-foreground">
                The free plan includes full access to mock data mode, allowing you to explore all features with pre-loaded demo scenarios. Perfect for evaluating the platform before connecting live data.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold mb-2">Do I need my own API keys?</h3>
              <p className="text-sm text-muted-foreground">
                For Pro and Enterprise plans with Live mode, you'll need free API keys from EIA and EPA AirNow. Other data sources (CAMD, Census, Open-Meteo) don't require keys. AI recommendations use our included GPT-5 integration.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold mb-2">Can I switch between Operator and Cloud personas?</h3>
              <p className="text-sm text-muted-foreground">
                Yes! All plans support both personas. Switch anytime in Settings to access persona-specific dashboards and recommendations.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold mb-2">What's the Community Impact Index (CII)?</h3>
              <p className="text-sm text-muted-foreground">
                CII is our proprietary metric combining carbon intensity, air quality, social vulnerability, and energy burden to measure your operation's holistic community impact on a 0-100 scale.
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
