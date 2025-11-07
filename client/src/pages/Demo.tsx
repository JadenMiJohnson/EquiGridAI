import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Building2, Cloud, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Demo() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    persona: "operator" as "operator" | "cloud",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const demoMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return await apiRequest("POST", "/api/demo", {
        name: data.name,
        email: data.email,
        organization: data.organization,
        persona: data.persona,
      });
    },
    onSuccess: () => {
      setSubmitted(true);
      toast({
        title: "Demo request submitted!",
        description: "We'll be in touch soon to schedule your personalized demo.",
      });
    },
    onError: () => {
      toast({
        title: "Submission failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    demoMutation.mutate(formData);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 py-12 px-4">
        <Card className="p-12 max-w-md text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Thank You!</h2>
          <p className="text-muted-foreground mb-6">
            We've received your demo request for <strong>{formData.organization}</strong>.
          </p>
          <p className="text-sm text-muted-foreground">
            Our team will reach out within 1 business day to schedule your personalized demo.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4" data-testid="text-demo-title">
            Request a Demo
          </h1>
          <p className="text-xl text-muted-foreground">
            See how EquiGrid AI can optimize your energy operations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card className="p-6">
            <Building2 className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2">For Data Center Operators</h3>
            <p className="text-sm text-muted-foreground">
              Reduce cooling costs, improve PUE, and optimize batch scheduling while demonstrating community impact
            </p>
          </Card>
          <Card className="p-6">
            <Cloud className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2">For Cloud Companies</h3>
            <p className="text-sm text-muted-foreground">
              Shift AI training and batch workloads to cleaner regions and off-peak hours for cost and carbon savings
            </p>
          </Card>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  data-testid="input-name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@company.com"
                  data-testid="input-email"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="organization">Organization *</Label>
              <Input
                id="organization"
                required
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                placeholder="Your Company Name"
                data-testid="input-organization"
              />
            </div>

            <div>
              <Label>I am a: *</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, persona: "operator" })}
                  className={cn(
                    "p-4 rounded-lg border-2 text-left transition-all hover-elevate",
                    formData.persona === "operator"
                      ? "border-primary bg-primary/5"
                      : "border-border"
                  )}
                  data-testid="button-persona-operator"
                >
                  <div className="flex items-start gap-3">
                    <Building2 className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <div className="font-medium mb-1">Data Center Operator</div>
                      <div className="text-xs text-muted-foreground">Own/operate facilities</div>
                    </div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, persona: "cloud" })}
                  className={cn(
                    "p-4 rounded-lg border-2 text-left transition-all hover-elevate",
                    formData.persona === "cloud"
                      ? "border-primary bg-primary/5"
                      : "border-border"
                  )}
                  data-testid="button-persona-cloud"
                >
                  <div className="flex items-start gap-3">
                    <Cloud className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <div className="font-medium mb-1">Cloud Company</div>
                      <div className="text-xs text-muted-foreground">Run cloud workloads</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="message">Additional Details (Optional)</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Tell us about your use case or any specific questions..."
                className="min-h-[120px]"
                data-testid="input-message"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={demoMutation.isPending}
              data-testid="button-submit-demo"
            >
              {demoMutation.isPending ? "Submitting..." : "Request Demo"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
