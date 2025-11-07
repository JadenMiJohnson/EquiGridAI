import { z } from "zod";

// ========== AUTH & SESSION ==========
export const sessionSchema = z.object({
  userId: z.string(),
  role: z.enum(["operator", "cloud"]),
  companyName: z.string(),
  email: z.string().email(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const quickLoginSchema = z.object({
  persona: z.enum(["operator", "cloud"]),
});

export type Session = z.infer<typeof sessionSchema>;
export type LoginRequest = z.infer<typeof loginSchema>;
export type QuickLoginRequest = z.infer<typeof quickLoginSchema>;

// ========== DEMO REQUEST ==========
export const demoRequestSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  organization: z.string().min(1),
  persona: z.enum(["operator", "cloud"]),
  createdAt: z.string().datetime().optional(),
});

export type DemoRequest = z.infer<typeof demoRequestSchema>;

// ========== INTEGRATIONS ==========
export const integrationConfigSchema = z.object({
  mode: z.enum(["LIVE", "MOCK"]),
  eiaApiKey: z.string().optional(),
  airnowApiKey: z.string().optional(),
});

export const apiStatusSchema = z.object({
  name: z.string(),
  configured: z.boolean(),
  lastSync: z.string().datetime().optional(),
  status: z.enum(["active", "inactive", "error"]),
});

export const integrationsStatusSchema = z.object({
  mode: z.enum(["LIVE", "MOCK"]),
  apis: z.array(apiStatusSchema),
});

export type IntegrationConfig = z.infer<typeof integrationConfigSchema>;
export type ApiStatus = z.infer<typeof apiStatusSchema>;
export type IntegrationsStatus = z.infer<typeof integrationsStatusSchema>;

// ========== ZONE DATA ==========
export const zoneKpisSchema = z.object({
  zip: z.string(),
  load_kwh: z.number(),
  carbon_intensity_kg_per_kwh: z.number(),
  aqi: z.number(),
  price_cents_per_kwh: z.number(),
  energy_burden_pct: z.number(),
  svi: z.number(),
  cii: z.number(),
});

export const hourDataSchema = z.object({
  hour: z.number(),
  carbon_intensity: z.number(),
  price: z.number(),
  load: z.number(),
  temp_f: z.number().optional(),
});

export const cleanerHourSchema = z.object({
  hour: z.number(),
  label: z.string(),
});

export const zoneDataSchema = z.object({
  kpis: zoneKpisSchema,
  trends_24h: z.array(hourDataSchema),
  cleaner_hours: z.array(cleanerHourSchema),
});

export type ZoneKpis = z.infer<typeof zoneKpisSchema>;
export type HourData = z.infer<typeof hourDataSchema>;
export type CleanerHour = z.infer<typeof cleanerHourSchema>;
export type ZoneData = z.infer<typeof zoneDataSchema>;

// ========== METRICS & DASHBOARD ==========
export const kpiCardDataSchema = z.object({
  label: z.string(),
  value: z.number(),
  unit: z.string(),
  delta: z.number().optional(),
  deltaLabel: z.string().optional(),
});

export const timeseriesPointSchema = z.object({
  timestamp: z.string(),
  baseline: z.number(),
  optimized: z.number().optional(),
});

export const metricsDataSchema = z.object({
  persona: z.enum(["operator", "cloud"]),
  kpis: z.object({
    cost_usd: kpiCardDataSchema,
    kwh: kpiCardDataSchema,
    co2_kg: kpiCardDataSchema,
    cii: kpiCardDataSchema,
  }),
  timeseries: z.object({
    cost: z.array(timeseriesPointSchema),
    carbon: z.array(timeseriesPointSchema),
  }),
  map_summary: z.array(zoneKpisSchema),
});

export type KpiCardData = z.infer<typeof kpiCardDataSchema>;
export type TimeseriesPoint = z.infer<typeof timeseriesPointSchema>;
export type MetricsData = z.infer<typeof metricsDataSchema>;

// ========== RECOMMENDATIONS ==========
export const operatorControlsSchema = z.object({
  cooling_setpoint_delta_f: z.number().min(0).max(10),
  containment_pct: z.number().min(0).max(100),
  batch_deferral_pct: z.number().min(0).max(100),
});

export const cloudControlsSchema = z.object({
  shift_pct: z.number().min(0).max(60),
  target_region: z.enum(["us-east", "us-west", "us-central"]),
  target_hours: z.string(),
});

export const recommendationRequestSchema = z.object({
  persona: z.enum(["operator", "cloud"]),
  controls: z.union([operatorControlsSchema, cloudControlsSchema]),
  companyName: z.string(),
});

export const roiDataSchema = z.object({
  costSavedUSD: z.number(),
  savingsPct: z.number(),
  emissionsAvoidedTons: z.number(),
  ciiDelta: z.number(),
});

export const recommendationResponseSchema = z.object({
  roi: roiDataSchema,
  recommendations: z.string(),
  source: z.enum(["openai", "rule-based"]),
});

export type OperatorControls = z.infer<typeof operatorControlsSchema>;
export type CloudControls = z.infer<typeof cloudControlsSchema>;
export type RecommendationRequest = z.infer<typeof recommendationRequestSchema>;
export type RoiData = z.infer<typeof roiDataSchema>;
export type RecommendationResponse = z.infer<typeof recommendationResponseSchema>;

// ========== REPORTS ==========
export const reportTemplateUploadSchema = z.object({
  name: z.string(),
  placeholders: z.array(z.string()),
});

export const fieldMappingSchema = z.object({
  placeholder: z.string(),
  metricKey: z.string(),
});

export const reportGenerateRequestSchema = z.object({
  templateId: z.string(),
  fieldMappings: z.array(fieldMappingSchema),
  persona: z.enum(["operator", "cloud"]),
});

export const reportVersionSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.string().datetime(),
  downloadUrl: z.string(),
});

export type ReportTemplateUpload = z.infer<typeof reportTemplateUploadSchema>;
export type FieldMapping = z.infer<typeof fieldMappingSchema>;
export type ReportGenerateRequest = z.infer<typeof reportGenerateRequestSchema>;
export type ReportVersion = z.infer<typeof reportVersionSchema>;

// ========== SUMMARY ==========
export const zipImpactSchema = z.object({
  zip: z.string(),
  cii_before: z.number(),
  cii_after: z.number(),
  cii_delta: z.number(),
});

export const summaryDataSchema = z.object({
  before: z.object({
    cost_usd: z.number(),
    kwh: z.number(),
    co2_tons: z.number(),
    cii: z.number(),
  }),
  after: z.object({
    cost_usd: z.number(),
    kwh: z.number(),
    co2_tons: z.number(),
    cii: z.number(),
  }),
  top_impacted_zips: z.array(zipImpactSchema),
});

export type ZipImpact = z.infer<typeof zipImpactSchema>;
export type SummaryData = z.infer<typeof summaryDataSchema>;
