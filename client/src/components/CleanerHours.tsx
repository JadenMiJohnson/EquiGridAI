import { Badge } from "@/components/ui/badge";
import { Leaf } from "lucide-react";
import { CleanerHour } from "@shared/schema";

interface CleanerHoursProps {
  hours: CleanerHour[];
}

export function CleanerHours({ hours }: CleanerHoursProps) {
  if (hours.length === 0) {
    return (
      <div className="text-sm text-muted-foreground text-center py-4">
        No cleaner hours identified for this period
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2" data-testid="cleaner-hours-list">
      {hours.map((hour) => (
        <Badge
          key={hour.hour}
          variant="outline"
          className="gap-1.5 bg-chart-1/10 text-chart-1 border-chart-1/20 font-mono"
          data-testid={`cleaner-hour-${hour.hour}`}
        >
          <Leaf className="h-3 w-3" />
          {hour.label}
        </Badge>
      ))}
    </div>
  );
}
