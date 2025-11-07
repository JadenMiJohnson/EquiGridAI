import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";

interface StatusBadgeProps {
  status: "active" | "inactive" | "error";
  label?: string;
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const config = {
    active: {
      icon: CheckCircle2,
      text: label || "Active",
      className: "bg-chart-1/10 text-chart-1 border-chart-1/20",
    },
    inactive: {
      icon: AlertCircle,
      text: label || "Inactive",
      className: "bg-muted text-muted-foreground border-border",
    },
    error: {
      icon: XCircle,
      text: label || "Error",
      className: "bg-destructive/10 text-destructive border-destructive/20",
    },
  };

  const { icon: Icon, text, className } = config[status];

  return (
    <Badge variant="outline" className={cn("gap-1.5 font-medium", className)} data-testid={`status-${status}`}>
      <Icon className="h-3 w-3" />
      {text}
    </Badge>
  );
}
