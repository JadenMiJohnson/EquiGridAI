import type { Express } from "express";
import { createServer, type Server } from "http";
import * as storage from "./storage";
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
  insertDemoRequestSchema,
  integrationConfigApiSchema,
  recommendationRequestSchema,
} from "@shared/schema";
import bcrypt from "bcrypt";

// TODO: SECURITY - This is temporary for development. Remove in Task 2 when proper authentication is implemented.
// Creates a default demo user for testing before auth is fully implemented
let demoUserId: number | null = null;

async function getOrCreateDemoUser(): Promise<number> {
  if (demoUserId) return demoUserId;
  
  const demoEmail = "demo@equigrid.ai";
  let user = await storage.getUserByEmail(demoEmail);
  
  if (!user) {
    const passwordHash = await bcrypt.hash("demo123", 10);
    user = await storage.createUser({
      email: demoEmail,
      passwordHash,
      companyName: "Demo Company",
      role: "operator",
    });
  }
  
  demoUserId = user.id;
  return demoUserId;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // ========== DEMO REQUEST ==========
  app.post("/api/demo", async (req, res) => {
    try {
      const demoRequest = insertDemoRequestSchema.parse(req.body);
      await storage.saveDemoRequest(demoRequest);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // ========== INTEGRATIONS ==========
  app.get("/api/integrations/status", async (req, res) => {
    try {
      // TODO: SECURITY - Replace with req.session.userId in Task 2
      const userId = await getOrCreateDemoUser();
      const config = await storage.getIntegrationConfig(userId);
      
      // If no config exists, return default MOCK mode
      const mode = config?.mode || "MOCK";
      
      // Mock API status
      const apis = [
        {
          name: "EIA Open Data",
          configured: mode === "LIVE" && !!config?.eiaApiKey,
          lastSync: mode === "LIVE" ? new Date().toISOString() : undefined,
          status: mode === "LIVE" && config?.eiaApiKey ? "active" : "inactive",
        },
        {
          name: "EPA AirNow",
          configured: mode === "LIVE" && !!config?.airnowApiKey,
          lastSync: mode === "LIVE" ? new Date().toISOString() : undefined,
          status: mode === "LIVE" && config?.airnowApiKey ? "active" : "inactive",
        },
        {
          name: "EPA CAMD",
          configured: true,
          lastSync: mode === "LIVE" ? new Date().toISOString() : undefined,
          status: mode === "LIVE" ? "active" : "inactive",
        },
        {
          name: "US Census ACS",
          configured: true,
          lastSync: mode === "LIVE" ? new Date().toISOString() : undefined,
          status: mode === "LIVE" ? "active" : "inactive",
        },
        {
          name: "Open-Meteo",
          configured: true,
          lastSync: mode === "LIVE" ? new Date().toISOString() : undefined,
          status: mode === "LIVE" ? "active" : "inactive",
        },
      ];

      res.json({
        mode,
        apis,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/integrations/config", async (req, res) => {
    try {
      // TODO: SECURITY - Replace with req.session.userId in Task 2
      const userId = await getOrCreateDemoUser();
      const config = integrationConfigApiSchema.parse(req.body);
      await storage.saveIntegrationConfig(userId, config);
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
      // TODO: SECURITY - Replace with req.session.userId in Task 2
      const userId = await getOrCreateDemoUser();
      
      // Mock report generation
      const reportId = `report-${Date.now()}`;
      const reportName = `ESG_Report_${new Date().toISOString().split('T')[0]}.docx`;
      
      const version = {
        id: reportId,
        userId,
        name: reportName,
        filePath: `/tmp/reports/${reportId}.docx`,
        fileType: "docx" as const,
        templateName: req.body.templateName || null,
      };

      await storage.saveReportVersion(version);

      res.json({
        success: true,
        reportId,
        downloadUrl: `/api/reports/download/${reportId}`,
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
