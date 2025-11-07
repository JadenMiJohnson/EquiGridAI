import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/lib/theme-context";
import { useAuth } from "@/lib/auth-context";
import { PersonaSwitch } from "@/components/PersonaSwitch";
import { Sun, Moon, User, Mail, Building } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { session } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-2" data-testid="text-settings-title">Settings</h1>
      <p className="text-muted-foreground mb-8">
        Manage your preferences and account settings
      </p>

      <div className="space-y-6">
        {/* Appearance */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Appearance</h2>
          
          <div className="space-y-4">
            <div>
              <Label className="mb-3 block">Theme</Label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setTheme("light")}
                  className={cn(
                    "p-4 rounded-lg border-2 flex items-center gap-3 transition-all hover-elevate",
                    theme === "light" ? "border-primary bg-primary/5" : "border-border"
                  )}
                  data-testid="button-theme-light"
                >
                  <Sun className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">Light</div>
                    <div className="text-xs text-muted-foreground">Clean and bright</div>
                  </div>
                </button>
                <button
                  onClick={() => setTheme("dark")}
                  className={cn(
                    "p-4 rounded-lg border-2 flex items-center gap-3 transition-all hover-elevate",
                    theme === "dark" ? "border-primary bg-primary/5" : "border-border"
                  )}
                  data-testid="button-theme-dark"
                >
                  <Moon className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">Dark</div>
                    <div className="text-xs text-muted-foreground">Calm and focused</div>
                  </div>
                </button>
              </div>
            </div>

            <div>
              <Label className="mb-3 block">Theme Preview</Label>
              <div className="p-6 rounded-lg border bg-background">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-primary" />
                    <span className="text-sm font-medium">Primary</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-secondary" />
                    <span className="text-sm font-medium">Secondary</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-muted" />
                    <span className="text-sm font-medium">Muted</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Account */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Account Information</h2>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <User className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <div className="text-sm font-medium">User ID</div>
                <div className="text-sm text-muted-foreground font-mono" data-testid="text-user-id">
                  {session?.userId}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <div className="text-sm font-medium">Email</div>
                <div className="text-sm text-muted-foreground" data-testid="text-user-email">
                  {session?.email}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Building className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <div className="text-sm font-medium">Organization</div>
                <div className="text-sm text-muted-foreground" data-testid="text-user-company">
                  {session?.companyName}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Persona */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Persona</h2>
          
          <div className="space-y-4">
            <div>
              <Label className="mb-3 block">Active Persona</Label>
              <PersonaSwitch />
            </div>
            
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">
                {session?.role === "operator" 
                  ? "As a Data Center Operator, you'll see facility-specific metrics, cooling optimization controls, and PUE tracking."
                  : "As a Cloud Company, you'll see workload shifting recommendations, regional carbon intensity data, and off-peak scheduling options."
                }
              </p>
            </div>
          </div>
        </Card>

        {/* Storage Note */}
        <div className="text-xs text-muted-foreground text-center p-4 border rounded-lg">
          Settings are stored locally in your browser. Clear your browser data to reset preferences.
        </div>
      </div>
    </div>
  );
}
