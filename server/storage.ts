import type { DemoRequest, IntegrationConfig, ReportVersion } from "@shared/schema";

export interface IStorage {
  // Demo requests
  saveDemoRequest(request: DemoRequest): Promise<void>;
  getDemoRequests(): Promise<DemoRequest[]>;

  // Integration config
  saveIntegrationConfig(config: IntegrationConfig): Promise<void>;
  getIntegrationConfig(): Promise<IntegrationConfig>;

  // Report versions
  saveReportVersion(version: ReportVersion): Promise<void>;
  getReportVersions(): Promise<ReportVersion[]>;
}

export class MemStorage implements IStorage {
  private demoRequests: DemoRequest[] = [];
  private integrationConfig: IntegrationConfig = {
    mode: "MOCK",
    eiaApiKey: "",
    airnowApiKey: "",
  };
  private reportVersions: ReportVersion[] = [];

  async saveDemoRequest(request: DemoRequest): Promise<void> {
    this.demoRequests.push({
      ...request,
      createdAt: new Date().toISOString(),
    });
  }

  async getDemoRequests(): Promise<DemoRequest[]> {
    return this.demoRequests;
  }

  async saveIntegrationConfig(config: IntegrationConfig): Promise<void> {
    this.integrationConfig = config;
  }

  async getIntegrationConfig(): Promise<IntegrationConfig> {
    return this.integrationConfig;
  }

  async saveReportVersion(version: ReportVersion): Promise<void> {
    this.reportVersions.push(version);
  }

  async getReportVersions(): Promise<ReportVersion[]> {
    return this.reportVersions.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
}

export const storage = new MemStorage();
