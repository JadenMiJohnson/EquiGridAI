import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ZipSearchBar } from "@/components/ZipSearchBar";
import { KpiCard } from "@/components/KpiCard";
import { CleanerHours } from "@/components/CleanerHours";
import { EnergyZoneMap } from "@/components/EnergyZoneMap";
import { Card } from "@/components/ui/card";
import { DEFAULT_ATLANTA_ZIP } from "@/lib/constants";
import { formatNumber, formatKwh } from "@/lib/formatters";
import { Map as MapIcon, TrendingUp, Zap, Cloud, DollarSign, Leaf } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { ZoneData } from "@shared/schema";

// Backend response structure (matches FastAPI /api/energy/zone)
type EnergyPoint = { hour: string; carbon: number; price: number };
type EnergyZoneResponse = {
  zoneId: string;
  load_kwh: number;
  carbon_intensity: number;
  aqi: number;
  price_cents_per_kwh: number;
  series: EnergyPoint[];
  cleaner_hours_iso: string[];
};

export default function EnergyZone() {
  const [searchZip, setSearchZip] = useState(DEFAULT_ATLANTA_ZIP);

  const { data, isLoading, error } = useQuery<ZoneData>({
    queryKey: ["/api/zone", searchZip],
    queryFn: async () => {
      const base = import.meta.env.VITE_API_BASE ?? "http://127.0.0.1:8000";
      const res = await fetch(`${base}/api/energy/zone/${searchZip}`);
      if (!res.ok) throw new Error(`Energy API failed: ${res.status}`);
      const d: EnergyZoneResponse = await res.json();

      // Map backend -> frontend (ZoneData)
      // Map backend -> frontend (ZoneData)
      const zoneData: ZoneData = {
        kpis: {
          zip: searchZip,                                 // <-- required by your schema
          load_kwh: d.load_kwh,
          carbon_intensity_kg_per_kwh: d.carbon_intensity,
          aqi: d.aqi,
          price_cents_per_kwh: d.price_cents_per_kwh,
          energy_burden_pct: 0,                           // <-- placeholder (mock)
          svi: 0,                                         // <-- placeholder (mock)
          cii: 0,
        },
        trends_24h: d.series.map((p) => ({
          hour: new Date(p.hour).getHours(),     // number (0–23)
          carbon_intensity: p.carbon,
          price: p.price,
          load: d.load_kwh,                      // backend has total, so reuse
          temp_f: undefined,                     // optional field
        })),
        cleaner_hours: d.cleaner_hours_iso.map((iso) => {
          const dt = new Date(iso);
          return {
            hour: dt.getHours(),
            label: dt.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }),
          };
        }),
      };


      return zoneData;
    },
  });

  const handleSearch = (zip: string) => setSearchZip(zip);

  if (error) {
    return (
      <div className="p-4 text-red-400">
        Failed to load energy data: {(error as Error).message}
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4" data-testid="text-energyzone-title">
              Your Energy Zone
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Explore real-time energy metrics, carbon intensity, and air quality by ZIP code
            </p>
            <ZipSearchBar onSearch={handleSearch} initialZip={searchZip} loading={isLoading} />
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
          </div>
          <div className="rounded-lg overflow-hidden" style={{ height: "500px" }}>
            <EnergyZoneMap data={data} selectedZip={searchZip} onZipClick={handleSearch} />
          </div>
          <div className="energy-map-wrapper rounded-lg overflow-hidden" style={{ height: "500px" }}>
            <EnergyZoneMap 
              data={data}
              selectedZip={searchZip}
              onZipClick={handleSearch}
            />
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

        {/* 24-Hour Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Carbon Intensity Chart */}
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

          {/* Price Chart */}
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
