import { Link } from "wouter";
import { Zap } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">EquiGrid AI</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">
              Optimizing data center and cloud operations for cost savings, compliance, and community impact through AI-powered energy recommendations.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/energy-zone">
                  <a className="text-muted-foreground hover:text-foreground transition-colors">
                    Energy Zone
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/how-it-works">
                  <a className="text-muted-foreground hover:text-foreground transition-colors">
                    How It Works
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/pricing">
                  <a className="text-muted-foreground hover:text-foreground transition-colors">
                    Pricing
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about">
                  <a className="text-muted-foreground hover:text-foreground transition-colors">
                    About Us
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/demo">
                  <a className="text-muted-foreground hover:text-foreground transition-colors">
                    Request Demo
                  </a>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© {currentYear} EquiGrid AI. Powering Profits with Purpose.</p>
        </div>
      </div>
    </footer>
  );
}
