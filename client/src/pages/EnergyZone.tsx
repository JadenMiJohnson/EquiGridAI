import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ZipSearchBar } from "@/components/ZipSearchBar";
import { KpiCard } from "@/components/KpiCard";
import { CleanerHours } from "@/components/CleanerHours";
import { Card } from "@/components/ui/card";
import { DEFAULT_ATLANTA_ZIP } from "@/lib/constants";
import { formatNumber, formatKwh } from "@/lib/formatters";
import { Map as MapIcon, TrendingUp, Zap, Cloud, DollarSign, Leaf } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { ZoneData } from "@shared/schema";

export default function EnergyZone() {
  const [searchZip, setSearchZip] = useState(DEFAULT_ATLANTA_ZIP);

  const { data, isLoading } = useQuery<ZoneData>({
    queryKey: ["/api/zone", searchZip],
  });

  const handleSearch = (zip: string) => {
    setSearchZip(zip);
  };

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4" data-testid="text-energyzone-title">
              Your Energy Zone
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Explore real-time energy metrics, carbon intensity, and air quality by ZIP code
            </p>
            <ZipSearchBar
              onSearch={handleSearch}
              initialZip={searchZip}
              loading={isLoading}
            />
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Map */}
        <Card className="p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <MapIcon className="h-5 w-5 text-primary" />
              Energy Zone Map - ZIP {searchZip}
            </h2>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 text-xs rounded-lg bg-primary/10 text-primary border border-primary/20">
                Load
              </button>
              <button className="px-3 py-1.5 text-xs rounded-lg border">
                Carbon
              </button>
              <button className="px-3 py-1.5 text-xs rounded-lg border">
                CII
              </button>
            </div>
          </div>
          <div className="aspect-video bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg flex items-center justify-center border-2 border-dashed border-primary/20">
            <div className="text-center">
              <MapIcon className="h-16 w-16 text-primary/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground mb-1">
                MapLibre GL Choropleth Map
              </p>
              <p className="text-xs text-muted-foreground">
                Showing ZIP-level energy metrics for {searchZip}
              </p>
            </div>
          </div>
          <div className="mt-4 text-xs text-muted-foreground">
            <p>• Green: Low impact / Cleaner energy</p>
            <p>• Yellow: Moderate impact</p>
            <p>• Red: High impact / Dirtier energy</p>
          </div>
        </Card>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KpiCard
            label="Energy Load"
            value={data ? formatKwh(data.kpis.load_kwh) : "0 kWh"}
            icon={<Zap className="h-8 w-8" />}
            loading={isLoading}
          />
          <KpiCard
            label="Carbon Intensity"
            value={data ? `${formatNumber(data.kpis.carbon_intensity_kg_per_kwh, 3)} kg/kWh` : "0 kg/kWh"}
            icon={<Leaf className="h-8 w-8" />}
            loading={isLoading}
          />
          <KpiCard
            label="Air Quality (AQI)"
            value={data ? formatNumber(data.kpis.aqi, 0) : "0"}
            icon={<Cloud className="h-8 w-8" />}
            loading={isLoading}
          />
          <KpiCard
            label="Price"
            value={data ? `${formatNumber(data.kpis.price_cents_per_kwh, 1)}¢/kWh` : "0¢/kWh"}
            icon={<DollarSign className="h-8 w-8" />}
            loading={isLoading}
          />
        </div>

        {/* 24h Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              24-Hour Carbon Intensity
            </h2>
            {isLoading ? (
              <div className="h-64 bg-muted animate-pulse rounded" />
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={data?.trends_24h || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="hour"
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                    label={{ value: "Hour", position: "insideBottom", offset: -5 }}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                    label={{ value: "kgCO₂/kWh", angle: -90, position: "insideLeft" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="carbon_intensity"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              24-Hour Price
            </h2>
            {isLoading ? (
              <div className="h-64 bg-muted animate-pulse rounded" />
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={data?.trends_24h || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="hour"
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                    label={{ value: "Hour", position: "insideBottom", offset: -5 }}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                    label={{ value: "¢/kWh", angle: -90, position: "insideLeft" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="hsl(var(--chart-3))"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </Card>
        </div>

        {/* Cleaner Hours */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">
            Cleaner Hours (Low Carbon & Low Price)
          </h2>
          {isLoading ? (
            <div className="h-20 bg-muted animate-pulse rounded" />
          ) : (
            <CleanerHours hours={data?.cleaner_hours || []} />
          )}
        </Card>
      </div>
    </div>
  );
}
