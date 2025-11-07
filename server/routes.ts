import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateRecommendation } from "./lib/openai-client";
import { calculateOperatorROI, calculateCloudROI } from "./lib/calculations";
import {
  getZoneKpis,
  get24HourTrends,
  getCleanerHours,
  getMetricsData,
  getSummaryData,
  ATLANTA_ZIPS,
} from "./data/mock-data";
import {
  demoRequestSchema,
  integrationConfigSchema,
  recommendationRequestSchema,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // ========== DEMO REQUEST ==========
  app.post("/api/demo", async (req, res) => {
    try {
      const demoRequest = demoRequestSchema.parse(req.body);
      await storage.saveDemoRequest(demoRequest);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // ========== INTEGRATIONS ==========
  app.get("/api/integrations/status", async (req, res) => {
    try {
      const config = await storage.getIntegrationConfig();
      
      // Mock API status
      const apis = [
        {
          name: "EIA Open Data",
          configured: config.mode === "LIVE" && !!config.eiaApiKey,
          lastSync: config.mode === "LIVE" ? new Date().toISOString() : undefined,
          status: config.mode === "LIVE" && config.eiaApiKey ? "active" : "inactive",
        },
        {
          name: "EPA AirNow",
          configured: config.mode === "LIVE" && !!config.airnowApiKey,
          lastSync: config.mode === "LIVE" ? new Date().toISOString() : undefined,
          status: config.mode === "LIVE" && config.airnowApiKey ? "active" : "inactive",
        },
        {
          name: "EPA CAMD",
          configured: true,
          lastSync: config.mode === "LIVE" ? new Date().toISOString() : undefined,
          status: config.mode === "LIVE" ? "active" : "inactive",
        },
        {
          name: "US Census ACS",
          configured: true,
          lastSync: config.mode === "LIVE" ? new Date().toISOString() : undefined,
          status: config.mode === "LIVE" ? "active" : "inactive",
        },
        {
          name: "Open-Meteo",
          configured: true,
          lastSync: config.mode === "LIVE" ? new Date().toISOString() : undefined,
          status: config.mode === "LIVE" ? "active" : "inactive",
        },
      ];

      res.json({
        mode: config.mode,
        apis,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/integrations/config", async (req, res) => {
    try {
      const config = integrationConfigSchema.parse(req.body);
      await storage.saveIntegrationConfig(config);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // ========== ZONE DATA ==========
  app.get("/api/zone", async (req, res) => {
    try {
      const zip = (req.query.zip as string) || "30331";
      
      // Validate ZIP is in our dataset
      if (!ATLANTA_ZIPS.includes(zip)) {
        return res.status(404).json({ error: "ZIP code not found in dataset" });
      }

      const kpis = getZoneKpis(zip);
      const trends = get24HourTrends();
      const cleanerHours = getCleanerHours(trends);

      res.json({
        kpis,
        trends_24h: trends,
        cleaner_hours: cleanerHours,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ========== METRICS ==========
  app.get("/api/metrics", async (req, res) => {
    try {
      const persona = (req.query.persona as "operator" | "cloud") || "operator";
      const metrics = getMetricsData(persona);
      res.json(metrics);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ========== RECOMMENDATIONS ==========
  app.post("/api/recommendations", async (req, res) => {
    try {
      const request = recommendationRequestSchema.parse(req.body);
      
      // Calculate ROI based on persona
      const baselineKwh = request.persona === "operator" ? 850000 : 1200000;
      const baselineCost = request.persona === "operator" ? 85000 : 120000;
      const baselineEmissions = request.persona === "operator" ? 340000 : 480000;
      const baselineCII = request.persona === "operator" ? 58 : 62;

      const roi = request.persona === "operator"
        ? calculateOperatorROI(
            baselineKwh,
            baselineCost,
            baselineEmissions,
            baselineCII,
            request.controls as any
          )
        : calculateCloudROI(
            baselineKwh,
            baselineCost,
            baselineEmissions,
            baselineCII,
            request.controls as any
          );

      // Generate recommendations
      const { text, source } = await generateRecommendation(
        request.persona,
        request.companyName,
        roi,
        request.controls
      );

      res.json({
        roi,
        recommendations: text,
        source,
      });
    } catch (error: any) {
      console.error("Recommendation error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // ========== REPORTS ==========
  app.post("/api/reports/templates/upload", async (req, res) => {
    try {
      // Mock DOCX parsing - in real implementation would use docx library
      const placeholders = [
        "{{COMPANY_NAME}}",
        "{{TOTAL_COST}}",
        "{{CARBON_EMISSIONS}}",
        "{{CII_SCORE}}",
        "{{ENERGY_USAGE}}",
        "{{REPORT_DATE}}",
      ];

      res.json({
        name: req.body.name || "Custom Template",
        placeholders,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/reports/generate", async (req, res) => {
    try {
      // Mock report generation
      const reportId = `report-${Date.now()}`;
      const reportName = `ESG_Report_${new Date().toISOString().split('T')[0]}.docx`;
      
      const version = {
        id: reportId,
        name: reportName,
        createdAt: new Date().toISOString(),
        downloadUrl: `/api/reports/download/${reportId}`,
      };

      await storage.saveReportVersion(version);

      res.json({
        success: true,
        reportId,
        downloadUrl: version.downloadUrl,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ========== SUMMARY ==========
  app.get("/api/summary", async (req, res) => {
    try {
      const summary = getSummaryData();
      res.json(summary);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ========== AUTH (Mock) ==========
  app.post("/api/auth/login", async (req, res) => {
    try {
      // Mock authentication - accept any credentials
      const session = {
        userId: `user-${Date.now()}`,
        role: req.body.role || "operator",
        companyName: req.body.companyName || "Demo Company",
        email: req.body.email || "demo@equigrid.ai",
      };
      
      res.json(session);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/auth/session", async (req, res) => {
    // Mock session check
    res.json({ authenticated: false });
  });

  app.post("/api/auth/logout", async (req, res) => {
    res.json({ success: true });
  });

  const httpServer = createServer(app);
  return httpServer;
}
