import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DollarSign, FileCheck, Heart, Building2, Cloud, ArrowRight } from "lucide-react";
import heroImage from "@assets/generated_images/Data_center_hero_background_474eae2d.png";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[600px] md:min-h-[700px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/70" />
        
        <div className="relative z-10 container mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight" data-testid="text-hero-title">
            Powering Profits<br />with Purpose
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
            Optimize your data center and cloud operations for cost savings, compliance, and community impact with AI-powered energy recommendations
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/energy-zone">
              <Button size="lg" variant="default" className="text-lg" data-testid="button-try-energy-zone">
                Try Energy Zone
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button
                size="lg"
                variant="outline"
                className="text-lg bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
                data-testid="button-request-demo"
              >
                Request Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Value Cards */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Triple Bottom Line Impact
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 hover-elevate transition-all" data-testid="card-value-cost">
              <DollarSign className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">Cost Savings</h3>
              <p className="text-muted-foreground">
                Reduce energy costs by 15-30% through intelligent workload shifting, cooling optimization, and cleaner energy timing
              </p>
            </Card>
            <Card className="p-8 hover-elevate transition-all" data-testid="card-value-compliance">
              <FileCheck className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">Compliance & Reporting</h3>
              <p className="text-muted-foreground">
                Automated ESG reporting with DOCX templates, carbon intensity tracking, and regulatory compliance documentation
              </p>
            </Card>
            <Card className="p-8 hover-elevate transition-all" data-testid="card-value-community">
              <Heart className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">Community Impact</h3>
              <p className="text-muted-foreground">
                Measure and improve your Community Impact Index (CII) by reducing air pollution and energy burden in vulnerable communities
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Who We Serve
          </h2>
          <p className="text-xl text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Two personas, one mission: sustainable energy optimization
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="p-8 hover-elevate transition-all" data-testid="card-persona-operator">
              <Building2 className="h-16 w-16 text-primary mb-6" />
              <h3 className="text-2xl font-semibold mb-3">Data Center Operators</h3>
              <p className="text-muted-foreground mb-6">
                Own and operate facilities. Optimize cooling setpoints, containment systems, and batch workload scheduling to reduce PUE and energy costs while improving local air quality.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Cooling system optimization</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>PUE improvement tracking</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Batch deferral strategies</span>
                </li>
              </ul>
            </Card>
            <Card className="p-8 hover-elevate transition-all" data-testid="card-persona-cloud">
              <Cloud className="h-16 w-16 text-primary mb-6" />
              <h3 className="text-2xl font-semibold mb-3">Cloud & Data-Using Companies</h3>
              <p className="text-muted-foreground mb-6">
                Run workloads on cloud infrastructure. Shift training and batch jobs across regions and time windows to access cleaner, cheaper energy while maintaining performance SLAs.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Cross-region workload shifting</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Off-peak hour scheduling</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Carbon intensity optimization</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2" data-testid="stat-savings">15-30%</div>
              <div className="text-sm opacity-90">Cost Savings</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2" data-testid="stat-carbon">40%</div>
              <div className="text-sm opacity-90">Carbon Reduction</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2" data-testid="stat-apis">5</div>
              <div className="text-sm opacity-90">Free API Integrations</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2" data-testid="stat-metrics">100+</div>
              <div className="text-sm opacity-90">Sustainability Metrics</div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Optimize Your Energy Strategy?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Start exploring your energy zone or request a personalized demo
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/energy-zone">
              <Button size="lg" variant="default" data-testid="button-cta-energy-zone">
                Explore Energy Zone
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
