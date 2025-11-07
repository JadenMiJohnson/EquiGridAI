import type { ZoneKpis, HourData, CleanerHour, TimeseriesPoint } from "@shared/schema";

// Mock ZIP codes for Atlanta metro area
export const ATLANTA_ZIPS = [
  "30301", "30302", "30303", "30305", "30306", "30307", "30308", "30309", "30310",
  "30311", "30312", "30313", "30314", "30315", "30316", "30317", "30318", "30319",
  "30320", "30321", "30322", "30324", "30326", "30327", "30328", "30329", "30331",
];

export function getZoneKpis(zip: string): ZoneKpis {
  // Generate consistent mock data based on ZIP
  const zipNum = parseInt(zip.slice(-2));
  const seed = zipNum % 100;

  return {
    zip,
    load_kwh: 15000 + seed * 200,
    carbon_intensity_kg_per_kwh: 0.35 + (seed / 100) * 0.15,
    aqi: 40 + seed * 0.8,
    price_cents_per_kwh: 8.5 + (seed / 100) * 2,
    energy_burden_pct: 3 + (seed / 100) * 2,
    svi: 0.3 + (seed / 100) * 0.4,
    cii: 65 - (seed / 2),
  };
}

export function get24HourTrends(): HourData[] {
  const trends: HourData[] = [];
  
  for (let hour = 0; hour < 24; hour++) {
    // Carbon intensity higher during peak hours (noon-8pm)
    const isPeak = hour >= 12 && hour <= 20;
    const baseCi = 0.40;
    const ciVariation = isPeak ? 0.10 : -0.05;
    
    // Price follows similar pattern but slightly offset
    const basePrice = 9.0;
    const priceVariation = isPeak ? 2.5 : -1.5;
    
    // Load peaks in afternoon
    const baseLoad = 15000;
    const loadVariation = isPeak ? 5000 : -2000;

    trends.push({
      hour,
      carbon_intensity: baseCi + ciVariation + (Math.random() * 0.04 - 0.02),
      price: basePrice + priceVariation + (Math.random() * 0.5 - 0.25),
      load: baseLoad + loadVariation + (Math.random() * 1000 - 500),
      temp_f: 65 + (Math.sin((hour - 6) * Math.PI / 12) * 10) + (Math.random() * 3 - 1.5),
    });
  }
  
  return trends;
}

export function getCleanerHours(trends: HourData[]): CleanerHour[] {
  // Identify hours with low CI and price
  const ciValues = trends.map(t => t.carbon_intensity).sort((a, b) => a - b);
  const priceValues = trends.map(t => t.price).sort((a, b) => a - b);
  
  const ci30th = ciValues[Math.floor(ciValues.length * 0.3)];
  const price30th = priceValues[Math.floor(priceValues.length * 0.3)];

  return trends
    .filter(t => t.carbon_intensity <= ci30th && t.price <= price30th)
    .map(t => ({
      hour: t.hour,
      label: formatHour(t.hour),
    }));
}

function formatHour(hour: number): string {
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour}${period}`;
}

export function getMetricsData(persona: "operator" | "cloud") {
  const baselineCost = persona === "operator" ? 85000 : 120000;
  const baselineKwh = persona === "operator" ? 850000 : 1200000;
  const baselineCO2 = persona === "operator" ? 340000 : 480000;
  const baselineCII = persona === "operator" ? 58 : 62;

  // Generate 30 days of timeseries data
  const costSeries: TimeseriesPoint[] = [];
  const carbonSeries: TimeseriesPoint[] = [];
  
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const timestamp = date.toISOString().split('T')[0];

    // Baseline with some variation
    const dailyCost = baselineCost / 30 + (Math.random() * 1000 - 500);
    const dailyCarbon = baselineCO2 / 30 + (Math.random() * 5000 - 2500);

    // Optimized: 20% lower on average
    const optimizedCost = dailyCost * 0.80 + (Math.random() * 500 - 250);
    const optimizedCarbon = dailyCarbon * 0.75 + (Math.random() * 3000 - 1500);

    costSeries.push({
      timestamp,
      baseline: dailyCost,
      optimized: optimizedCost,
    });

    carbonSeries.push({
      timestamp,
      baseline: dailyCarbon,
      optimized: optimizedCarbon,
    });
  }

  return {
    persona,
    kpis: {
      cost_usd: {
        label: "Cost",
        value: baselineCost,
        unit: "USD",
        delta: -20,
        deltaLabel: "vs optimized",
      },
      kwh: {
        label: "Energy",
        value: baselineKwh,
        unit: "kWh",
        delta: -18,
        deltaLabel: "vs optimized",
      },
      co2_kg: {
        label: "CO₂",
        value: baselineCO2,
        unit: "kg",
        delta: -25,
        deltaLabel: "vs optimized",
      },
      cii: {
        label: "CII",
        value: baselineCII,
        unit: "pts",
        delta: 8,
        deltaLabel: "vs optimized",
      },
    },
    timeseries: {
      cost: costSeries,
      carbon: carbonSeries,
    },
    map_summary: ATLANTA_ZIPS.slice(0, 10).map(zip => getZoneKpis(zip)),
  };
}

export function getSummaryData() {
  return {
    before: {
      cost_usd: 85000,
      kwh: 850000,
      co2_tons: 340,
      cii: 58,
    },
    after: {
      cost_usd: 68000,
      kwh: 697000,
      co2_tons: 255,
      cii: 66,
    },
    top_impacted_zips: [
      { zip: "30331", cii_before: 52, cii_after: 68, cii_delta: 16 },
      { zip: "30314", cii_before: 55, cii_after: 69, cii_delta: 14 },
      { zip: "30310", cii_before: 58, cii_after: 70, cii_delta: 12 },
      { zip: "30315", cii_before: 60, cii_after: 71, cii_delta: 11 },
      { zip: "30316", cii_before: 54, cii_after: 64, cii_delta: 10 },
    ],
  };
}
