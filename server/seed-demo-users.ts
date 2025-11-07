import bcrypt from "bcrypt";
import * as storage from "./storage";

async function seedDemoUsers() {
  console.log("Seeding demo users...");

  try {
    // Demo operator user
    const operatorEmail = "demo@operator.equigrid.ai";
    const operatorExists = await storage.getUserByEmail(operatorEmail);
    
    if (!operatorExists) {
      const operatorPassword = await bcrypt.hash("demo123", 10);
      await storage.createUser({
        email: operatorEmail,
        passwordHash: operatorPassword,
        companyName: "Atlanta Data Center",
        role: "operator",
      });
      console.log("✓ Created demo operator user:", operatorEmail);
    } else {
      console.log("✓ Demo operator user already exists:", operatorEmail);
    }

    // Demo cloud user
    const cloudEmail = "demo@cloud.equigrid.ai";
    const cloudExists = await storage.getUserByEmail(cloudEmail);
    
    if (!cloudExists) {
      const cloudPassword = await bcrypt.hash("demo123", 10);
      await storage.createUser({
        email: cloudEmail,
        passwordHash: cloudPassword,
        companyName: "FinOptima Cloud",
        role: "cloud",
      });
      console.log("✓ Created demo cloud user:", cloudEmail);
    } else {
      console.log("✓ Demo cloud user already exists:", cloudEmail);
    }

    console.log("\nDemo users ready:");
    console.log("- Operator: demo@operator.equigrid.ai / demo123");
    console.log("- Cloud:    demo@cloud.equigrid.ai / demo123");
  } catch (error) {
    console.error("Error seeding demo users:", error);
    process.exit(1);
  }
}

seedDemoUsers();
