import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/StatusBadge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Switch } from "@/components/ui/switch";
import { RefreshCw, Save, Eye, EyeOff } from "lucide-react";
import type { IntegrationsStatus, IntegrationConfig } from "@shared/schema";

export default function Integrations() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showKeys, setShowKeys] = useState(false);
  const [config, setConfig] = useState<IntegrationConfig>({
    mode: "MOCK",
    eiaApiKey: "",
    airnowApiKey: "",
  });

  const { data: status, isLoading } = useQuery<IntegrationsStatus>({
    queryKey: ["/api/integrations/status"],
  });

  const saveMutation = useMutation({
    mutationFn: async (newConfig: IntegrationConfig) => {
      return await apiRequest("POST", "/api/integrations/config", newConfig);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/integrations/status"] });
      toast({
        title: "Configuration saved",
        description: "Integration settings have been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Save failed",
        description: "Unable to save integration settings. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    saveMutation.mutate(config);
  };

  const handleModeToggle = (checked: boolean) => {
    setConfig({ ...config, mode: checked ? "LIVE" : "MOCK" });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-2" data-testid="text-integrations-title">Integrations</h1>
      <p className="text-muted-foreground mb-8">
        Configure data sources and API connections
      </p>

      {/* Mode Toggle */}
      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold mb-1">Data Mode</h2>
            <p className="text-sm text-muted-foreground">
              {config.mode === "LIVE" 
                ? "Using real-time data from external APIs (requires API keys)"
                : "Using pre-loaded demo data for testing"
              }
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">Mock</span>
            <Switch
              checked={config.mode === "LIVE"}
              onCheckedChange={handleModeToggle}
              data-testid="switch-mode"
            />
            <span className="text-sm font-medium">Live</span>
          </div>
        </div>
      </Card>

      {/* API Keys */}
      {config.mode === "LIVE" && (
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">API Keys</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowKeys(!showKeys)}
              data-testid="button-toggle-keys"
            >
              {showKeys ? (
                <>
                  <EyeOff className="h-4 w-4 mr-2" />
                  Hide
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Show
                </>
              )}
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="eia">EIA API Key</Label>
              <Input
                id="eia"
                type={showKeys ? "text" : "password"}
                value={config.eiaApiKey}
                onChange={(e) => setConfig({ ...config, eiaApiKey: e.target.value })}
                placeholder="Enter your EIA Open Data API key"
                data-testid="input-eia-key"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Get a free key from{" "}
                <a
                  href="https://www.eia.gov/opendata/register.php"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  eia.gov/opendata
                </a>
              </p>
            </div>

            <div>
              <Label htmlFor="airnow">AirNow API Key</Label>
              <Input
                id="airnow"
                type={showKeys ? "text" : "password"}
                value={config.airnowApiKey}
                onChange={(e) => setConfig({ ...config, airnowApiKey: e.target.value })}
                placeholder="Enter your EPA AirNow API key"
                data-testid="input-airnow-key"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Get a free key from{" "}
                <a
                  href="https://docs.airnowapi.org/account/request/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  airnowapi.org
                </a>
              </p>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <Button
              onClick={handleSave}
              disabled={saveMutation.isPending}
              data-testid="button-save-config"
            >
              <Save className="h-4 w-4 mr-2" />
              {saveMutation.isPending ? "Saving..." : "Save Configuration"}
            </Button>
          </div>
        </Card>
      )}

      {/* API Status */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">API Status</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/integrations/status"] })}
            disabled={isLoading}
            data-testid="button-refresh-status"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {status?.apis.map((api) => (
              <div
                key={api.name}
                className="flex items-center justify-between p-4 rounded-lg border bg-card"
                data-testid={`api-status-${api.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="flex-1">
                  <div className="font-medium mb-1">{api.name}</div>
                  {api.lastSync && (
                    <div className="text-xs text-muted-foreground">
                      Last synced: {new Date(api.lastSync).toLocaleString()}
                    </div>
                  )}
                </div>
                <StatusBadge
                  status={api.status}
                  label={api.configured ? "Configured" : "Not Configured"}
                />
              </div>
            ))}
          </div>
        )}

        {status?.mode === "MOCK" && (
          <div className="mt-4 p-4 rounded-lg bg-muted/50">
            <p className="text-sm text-muted-foreground">
              Currently using mock data. Switch to Live mode and configure API keys to access real-time data.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
