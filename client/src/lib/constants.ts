export const PERSONAS = {
  operator: {
    label: "Data Center Operator",
    description: "Own and operate data center facilities",
    icon: "building",
  },
  cloud: {
    label: "Cloud Company",
    description: "Run workloads on cloud infrastructure",
    icon: "cloud",
  },
} as const;

export const REGIONS = [
  { value: "us-east", label: "US East" },
  { value: "us-west", label: "US West" },
  { value: "us-central", label: "US Central" },
] as const;

export const DEFAULT_ATLANTA_ZIP = "30331";

export const METRIC_LABELS = {
  cost_usd: "Cost",
  kwh: "Energy Usage",
  co2_kg: "CO₂ Emissions",
  cii: "Community Impact",
} as const;

export const API_NAMES = {
  EIA: "EIA Open Data",
  AIRNOW: "EPA AirNow",
  CAMD: "EPA CAMD",
  CENSUS: "US Census ACS",
  OPENMETEO: "Open-Meteo",
} as const;
