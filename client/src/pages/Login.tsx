import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, Cloud, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const handleQuickLogin = async (persona: "operator" | "cloud") => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: `demo@${persona}.equigrid.ai`,
          password: "demo123",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      login(data);
      toast({
        title: "Logged in successfully",
        description: `Welcome to EquiGrid AI as ${persona === "operator" ? "Data Center Operator" : "Cloud Company"}`,
      });
      // Small delay to ensure session state updates before navigation
      setTimeout(() => setLocation("/app/dashboard"), 0);
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Missing credentials",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      login(data);
      toast({
        title: "Logged in successfully",
        description: "Welcome to EquiGrid AI",
      });
      // Small delay to ensure session state updates before navigation
      setTimeout(() => setLocation("/app/dashboard"), 0);
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 py-12 px-4">
      <div className="w-full max-w-5xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="h-10 w-10 text-primary" />
            <h1 className="text-3xl font-bold">EquiGrid AI</h1>
          </div>
          <p className="text-muted-foreground">
            Login to access your personalized energy optimization dashboard
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Quick Login */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Quick Demo Login</h2>
              <p className="text-sm text-muted-foreground">
                Choose your persona to explore the platform instantly
              </p>
            </div>

            <Card className="p-6 hover-elevate transition-all cursor-pointer" onClick={() => handleQuickLogin("operator")} data-testid="card-quick-login-operator">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Data Center Operator</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Optimize cooling, containment, and batch scheduling for your facility
                  </p>
                  <Button className="w-full" disabled={isLoading} data-testid="button-quick-login-operator">
                    {isLoading ? "Logging in..." : "Login as Operator"}
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="p-6 hover-elevate transition-all cursor-pointer" onClick={() => handleQuickLogin("cloud")} data-testid="card-quick-login-cloud">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Cloud className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Cloud Company</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Shift workloads across regions and times for cleaner, cheaper energy
                  </p>
                  <Button className="w-full" disabled={isLoading} data-testid="button-quick-login-cloud">
                    {isLoading ? "Logging in..." : "Login as Cloud User"}
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Email/Password Login */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6">Email Login</h2>
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  data-testid="input-email"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  data-testid="input-password"
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading} data-testid="button-email-login">
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p>Use demo accounts above or register your own account</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
