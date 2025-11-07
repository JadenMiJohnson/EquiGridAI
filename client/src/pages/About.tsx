import { Card } from "@/components/ui/card";
import { Target, Users, Lightbulb } from "lucide-react";

export default function About() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6" data-testid="text-about-title">
            About EquiGrid AI
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We're on a mission to make sustainable energy operations accessible, profitable, and impactful for data centers and cloud companies worldwide
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <Target className="h-12 w-12 text-primary" />
              <h2 className="text-3xl font-bold">Our Mission</h2>
            </div>
            <p className="text-lg text-muted-foreground mb-6">
              The data center industry accounts for 2% of global electricity consumption and is projected to grow exponentially. Yet most operators and cloud users lack the tools to optimize energy usage for cost, carbon, and community impact simultaneously.
            </p>
            <p className="text-lg text-muted-foreground mb-6">
              EquiGrid AI bridges this gap by combining free government and weather APIs with AI-powered recommendations to deliver actionable insights that improve your bottom line while reducing environmental and social impact.
            </p>
            <p className="text-lg text-muted-foreground">
              We believe profitability and sustainability aren't competing goals—they're complementary when you have the right data and intelligence.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="p-8 text-center" data-testid="card-value-accessible">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                <Lightbulb className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Accessible</h3>
              <p className="text-muted-foreground">
                Leveraging free APIs and transparent calculations to make sustainability data available to organizations of all sizes
              </p>
            </Card>
            <Card className="p-8 text-center" data-testid="card-value-actionable">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                <Target className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Actionable</h3>
              <p className="text-muted-foreground">
                Providing specific, measurable recommendations with clear ROI projections—not just dashboards and reports
              </p>
            </Card>
            <Card className="p-8 text-center" data-testid="card-value-holistic">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Holistic</h3>
              <p className="text-muted-foreground">
                Measuring impact across financial, environmental, and social dimensions through our Community Impact Index
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Origin Story */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Origin Story</h2>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-muted-foreground mb-4">
                EquiGrid AI was founded in 2024 when our team recognized a critical gap: while large tech companies invest heavily in sustainability teams and proprietary tools, mid-size operators and cloud users were left navigating fragmented data sources and expensive consultants.
              </p>
              <p className="text-muted-foreground mb-4">
                We discovered that government agencies like the EPA and EIA already provide real-time energy and environmental data—for free. The challenge was making it accessible, correlated, and actionable.
              </p>
              <p className="text-muted-foreground">
                By combining these public data sources with modern AI and an intuitive interface, we've created a platform that democratizes energy optimization. Whether you operate a single colocation facility or manage cloud workloads across multiple regions, EquiGrid AI gives you the intelligence to power profits with purpose.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Lean & Focused Team</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            A small team of engineers, data scientists, and sustainability experts building the future of energy intelligence
          </p>
          <div className="text-center">
            <p className="text-lg text-muted-foreground">
              Our distributed team combines expertise in data center operations, cloud architecture, environmental science, and machine learning to deliver a product that speaks to real operational challenges.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
