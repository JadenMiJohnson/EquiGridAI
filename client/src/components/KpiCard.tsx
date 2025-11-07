import { Card } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  label: string;
  value: string;
  delta?: {
    value: string;
    isPositive: boolean;
    label?: string;
  };
  icon?: React.ReactNode;
  loading?: boolean;
}

export function KpiCard({ label, value, delta, icon, loading }: KpiCardProps) {
  if (loading) {
    return (
      <Card className="p-6">
        <div className="space-y-3">
          <div className="h-4 w-24 bg-muted animate-pulse rounded" />
          <div className="h-8 w-32 bg-muted animate-pulse rounded" />
          <div className="h-3 w-20 bg-muted animate-pulse rounded" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 hover-elevate transition-all" data-testid={`kpi-card-${label.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-2">{label}</p>
          <p className="text-3xl font-bold tabular-nums" data-testid={`kpi-value-${label.toLowerCase().replace(/\s+/g, '-')}`}>{value}</p>
          {delta && (
            <div className="flex items-center gap-1.5 mt-2">
              <div
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                  delta.isPositive
                    ? "bg-chart-1/10 text-chart-1"
                    : "bg-destructive/10 text-destructive"
                )}
                data-testid={`kpi-delta-${label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {delta.isPositive ? (
                  <ArrowUp className="h-3 w-3" />
                ) : (
                  <ArrowDown className="h-3 w-3" />
                )}
                {delta.value}
              </div>
              {delta.label && (
                <span className="text-xs text-muted-foreground">{delta.label}</span>
              )}
            </div>
          )}
        </div>
        {icon && (
          <div className="text-muted-foreground/30">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
