import type { Express, Request, Response, NextFunction } from "express";
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
import multer from "multer";
import { extractPlaceholdersFromDocx, validateDocxFile, fillDocxTemplate } from "./lib/docx-utils";

// Authentication middleware
function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Authentication required" });
  }
  next();
}

// Helper function to get userId from session (for type safety)
function getUserId(req: Request): number {
  if (!req.session.userId) {
    throw new Error("User not authenticated");
  }
  return req.session.userId;
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
  app.get("/api/integrations/status", requireAuth, async (req, res) => {
    try {
      const userId = getUserId(req);
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

  app.post("/api/integrations/config", requireAuth, async (req, res) => {
    try {
      const userId = getUserId(req);
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

      // Generate metrics for all Atlanta ZIPs for map choropleth
      const allZipsMetrics: Record<string, {
        load_kwh: number;
        carbon_intensity_kg_per_kwh: number;
        cii: number;
        aqi: number;
        price_cents_per_kwh: number;
      }> = {};

      ATLANTA_ZIPS.forEach((zipCode) => {
        const zipKpis = getZoneKpis(zipCode);
        allZipsMetrics[zipCode] = {
          load_kwh: zipKpis.load_kwh,
          carbon_intensity_kg_per_kwh: zipKpis.carbon_intensity_kg_per_kwh,
          cii: zipKpis.cii,
          aqi: zipKpis.aqi,
          price_cents_per_kwh: zipKpis.price_cents_per_kwh,
        };
      });

      res.json({
        kpis,
        trends_24h: trends,
        cleaner_hours: cleanerHours,
        all_zips_metrics: allZipsMetrics,
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
  app.post("/api/recommendations", requireAuth, async (req, res) => {
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
  const upload = multer({ storage: multer.memoryStorage() });

  app.post("/api/reports/templates", requireAuth, upload.single("file"), async (req, res) => {
    try {
      const userId = getUserId(req);
      const file = (req as any).file;
      const name = req.body.name;

      if (!file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      if (!name) {
        return res.status(400).json({ error: "Template name is required" });
      }

      const validation = validateDocxFile(file.buffer, file.originalname);
      if (!validation.valid) {
        return res.status(400).json({ error: validation.error });
      }

      const { placeholders, contentHash } = await extractPlaceholdersFromDocx(file.buffer);

      const template = await storage.createReportTemplate({
        userId,
        name,
        originalFilename: file.originalname,
        fileData: file.buffer.toString("base64"),
        fileSize: file.size,
        contentHash,
        description: req.body.description || null,
        placeholders,
      });

      res.json({
        id: template.id,
        name: template.name,
        placeholders: template.placeholders,
        uploadedAt: template.uploadedAt,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/reports/templates", requireAuth, async (req, res) => {
    try {
      const userId = getUserId(req);
      const templates = await storage.getReportTemplatesByUserId(userId);

      res.json(
        templates.map((t) => ({
          id: t.id,
          name: t.name,
          originalFilename: t.originalFilename,
          fileSize: t.fileSize,
          placeholders: t.placeholders,
          uploadedAt: t.uploadedAt,
          lastUsedAt: t.lastUsedAt,
        }))
      );
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/reports/templates/:id", requireAuth, async (req, res) => {
    try {
      const userId = getUserId(req);
      const templateId = parseInt(req.params.id);

      const template = await storage.getReportTemplateById(templateId);
      if (!template) {
        return res.status(404).json({ error: "Template not found" });
      }

      if (template.userId !== userId) {
        return res.status(403).json({ error: "Access denied" });
      }

      await storage.deleteReportTemplate(templateId);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/reports/generate", requireAuth, async (req, res) => {
    try {
      const userId = getUserId(req);
      const templateId = parseInt(req.body.templateId);

      if (!templateId) {
        return res.status(400).json({ error: "Template ID is required" });
      }

      const template = await storage.getReportTemplateById(templateId);
      if (!template) {
        return res.status(404).json({ error: "Template not found" });
      }

      if (template.userId !== userId) {
        return res.status(403).json({ error: "Access denied" });
      }

      const user = await storage.getUserById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const placeholderValues: Record<string, string | number> = {
        company_name: user.companyName,
        report_date: new Date().toLocaleDateString(),
        total_cost: "$45,230",
        carbon_savings: "12.5 tons",
        cii_improvement: "+8.2%",
        energy_usage: "342,000 kWh",
      };

      const templateBuffer = Buffer.from(template.fileData, "base64");
      const filledBuffer = fillDocxTemplate(templateBuffer, placeholderValues);

      const reportId = `report-${Date.now()}`;
      const reportName = `${template.name}_${new Date().toISOString().split('T')[0]}.docx`;

      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
      res.setHeader("Content-Disposition", `attachment; filename="${reportName}"`);
      res.send(filledBuffer);

      await storage.updateTemplateLastUsed(templateId);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ========== SUMMARY ==========
  app.get("/api/summary", requireAuth, async (req, res) => {
    try {
      const summary = getSummaryData();
      res.json(summary);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ========== AUTH ==========
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { email, password, companyName, role } = req.body;

      if (!email || !password || !companyName || !role) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Check if user already exists
      const existing = await storage.getUserByEmail(email);
      if (existing) {
        return res.status(409).json({ error: "Email already registered" });
      }

      // Hash password
      const bcrypt = await import("bcrypt");
      const passwordHash = await bcrypt.hash(password, 10);

      // Create user
      const user = await storage.createUser({
        email,
        passwordHash,
        companyName,
        role,
      });

      // Create session
      req.session.regenerate((err) => {
        if (err) {
          return res.status(500).json({ error: "Session creation failed" });
        }

        req.session.userId = user.id;
        req.session.email = user.email;
        req.session.companyName = user.companyName;
        req.session.role = user.role;

        req.session.save((err) => {
          if (err) {
            return res.status(500).json({ error: "Session save failed" });
          }

          res.json({
            userId: user.id,
            email: user.email,
            companyName: user.companyName,
            role: user.role,
          });
        });
      });
    } catch (error: any) {
      console.error("Registration error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Email and password required" });
      }

      // Find user
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Verify password
      const bcrypt = await import("bcrypt");
      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Prevent session fixation attacks
      req.session.regenerate((err) => {
        if (err) {
          return res.status(500).json({ error: "Session creation failed" });
        }

        req.session.userId = user.id;
        req.session.email = user.email;
        req.session.companyName = user.companyName;
        req.session.role = user.role;

        req.session.save((err) => {
          if (err) {
            return res.status(500).json({ error: "Session save failed" });
          }

          res.json({
            userId: user.id,
            email: user.email,
            companyName: user.companyName,
            role: user.role,
          });
        });
      });
    } catch (error: any) {
      console.error("Login error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/auth/session", async (req, res) => {
    if (req.session.userId) {
      res.json({
        authenticated: true,
        userId: req.session.userId,
        email: req.session.email,
        companyName: req.session.companyName,
        role: req.session.role,
      });
    } else {
      res.json({ authenticated: false });
    }
  });

  app.post("/api/auth/logout", async (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.clearCookie("equigrid.sid");
      res.json({ success: true });
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
