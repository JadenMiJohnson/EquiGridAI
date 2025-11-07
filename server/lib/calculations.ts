// Energy calculation utilities

export interface FuelMix {
  coal: number;
  natural_gas: number;
  nuclear: number;
  wind: number;
  solar: number;
  hydro: number;
  other: number;
}

// Emission factors (kgCO₂/kWh)
const EMISSION_FACTORS: Record<keyof FuelMix, number> = {
  coal: 0.95,
  natural_gas: 0.40,
  nuclear: 0.012,
  wind: 0.012,
  solar: 0.045,
  hydro: 0.004,
  other: 0.50,
};

export function calculateCarbonIntensity(fuelMix: FuelMix): number {
  let ci = 0;
  for (const [fuel, share] of Object.entries(fuelMix)) {
    ci += share * EMISSION_FACTORS[fuel as keyof FuelMix];
  }
  return ci;
}

export function calculateCost(kWh: number, ratePerKwh: number): number {
  return kWh * ratePerKwh;
}

export function calculateEmissions(kWh: number, carbonIntensity: number): number {
  return kWh * carbonIntensity;
}

export function calculateCII(
  carbonIntensity: number,
  aqi: number,
  svi: number,
  energyBurden: number,
  zipData: Array<{ ci: number; aqi: number; svi: number; eb: number }>
): number {
  // Normalize each metric across all ZIPs (0-100 scale)
  const ciNorm = normalize(carbonIntensity, zipData.map(z => z.ci));
  const aqiNorm = normalize(aqi, zipData.map(z => z.aqi));
  const sviNorm = normalize(svi, zipData.map(z => z.svi));
  const ebNorm = normalize(energyBurden, zipData.map(z => z.eb));

  // Weighted combination (0-100 scale, lower is better)
  const cii = 0.35 * ciNorm + 0.25 * aqiNorm + 0.25 * sviNorm + 0.15 * ebNorm;
  
  // Invert so higher CII = better community impact
  return 100 - cii;
}

function normalize(value: number, allValues: number[]): number {
  const min = Math.min(...allValues);
  const max = Math.max(...allValues);
  if (max === min) return 50; // Midpoint if no variation
  return ((value - min) / (max - min)) * 100;
}

export function identifyCleanerHours(
  hourlyData: Array<{ hour: number; ci: number; price: number }>
): number[] {
  // Find 30th percentile thresholds
  const ciValues = hourlyData.map(h => h.ci).sort((a, b) => a - b);
  const priceValues = hourlyData.map(h => h.price).sort((a, b) => a - b);
  
  const ci30th = ciValues[Math.floor(ciValues.length * 0.3)];
  const price30th = priceValues[Math.floor(priceValues.length * 0.3)];

  // Find hours below both thresholds
  return hourlyData
    .filter(h => h.ci <= ci30th && h.price <= price30th)
    .map(h => h.hour);
}

export function calculateOperatorROI(
  baselineKwh: number,
  baselineCost: number,
  baselineEmissions: number,
  baselineCII: number,
  controls: {
    cooling_setpoint_delta_f: number;
    containment_pct: number;
    batch_deferral_pct: number;
  }
): {
  costSavedUSD: number;
  savingsPct: number;
  emissionsAvoidedTons: number;
  ciiDelta: number;
} {
  // Cooling: ~6.5% reduction per °F increase in setpoint
  const coolingSavingsPct = controls.cooling_setpoint_delta_f * 6.5;
  
  // Containment: improves PUE, estimate ~5% savings at 80% containment
  const containmentSavingsPct = (controls.containment_pct / 100) * 5;
  
  // Batch deferral: shifting to off-peak reduces cost by ~20% for deferred load
  const batchSavingsPct = (controls.batch_deferral_pct / 100) * 20;

  const totalSavingsPct = coolingSavingsPct + containmentSavingsPct + batchSavingsPct;
  const costSaved = baselineCost * (totalSavingsPct / 100);
  const emissionsAvoided = baselineEmissions * (totalSavingsPct / 100) / 1000; // Convert kg to tons
  const ciiDelta = baselineCII * 0.15; // Estimate 15% CII improvement

  return {
    costSavedUSD: costSaved,
    savingsPct: totalSavingsPct,
    emissionsAvoidedTons: emissionsAvoided,
    ciiDelta,
  };
}

export function calculateCloudROI(
  baselineKwh: number,
  baselineCost: number,
  baselineEmissions: number,
  baselineCII: number,
  controls: {
    shift_pct: number;
    target_region: string;
    target_hours: string;
  }
): {
  costSavedUSD: number;
  savingsPct: number;
  emissionsAvoidedTons: number;
  ciiDelta: number;
} {
  // Regional shift: us-west has ~30% cleaner grid than us-east
  const regionalCarbonReduction = controls.target_region === "us-west" ? 30 : 15;
  
  // Time shift: off-peak has ~20% lower prices and ~25% lower carbon
  const timeCostReduction = 20;
  const timeCarbonReduction = 25;

  const shiftFraction = controls.shift_pct / 100;
  
  const costSavingsPct = shiftFraction * timeCostReduction;
  const emissionsSavingsPct = shiftFraction * (regionalCarbonReduction + timeCarbonReduction) / 2;

  const costSaved = baselineCost * (costSavingsPct / 100);
  const emissionsAvoided = baselineEmissions * (emissionsSavingsPct / 100) / 1000; // kg to tons
  const ciiDelta = baselineCII * (shiftFraction * 0.2); // 20% improvement on shifted load

  return {
    costSavedUSD: costSaved,
    savingsPct: costSavingsPct,
    emissionsAvoidedTons: emissionsAvoided,
    ciiDelta,
  };
}
