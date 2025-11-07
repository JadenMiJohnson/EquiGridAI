import { Building2, Cloud } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

export function PersonaSwitch() {
  const { session, login } = useAuth();

  if (!session) return null;

  const handleSwitch = (role: "operator" | "cloud") => {
    if (session.role === role) return;
    login({
      ...session,
      role,
    });
  };

  return (
    <div className="inline-flex items-center rounded-lg bg-muted p-1" data-testid="persona-switch">
      <button
        onClick={() => handleSwitch("operator")}
        className={cn(
          "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all",
          session.role === "operator"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
        data-testid="button-persona-operator"
      >
        <Building2 className="h-4 w-4" />
        <span className="hidden sm:inline">Operator</span>
      </button>
      <button
        onClick={() => handleSwitch("cloud")}
        className={cn(
          "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all",
          session.role === "cloud"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
        data-testid="button-persona-cloud"
      >
        <Cloud className="h-4 w-4" />
        <span className="hidden sm:inline">Cloud</span>
      </button>
    </div>
  );
}
