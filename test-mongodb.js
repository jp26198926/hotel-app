// Test MongoDB connection and admin settings
import dotenv from "dotenv";

// Load environment variables first
dotenv.config({ path: ".env.local" });

// Set environment variable manually for testing
process.env.MONGODB_URI = "mongodb://localhost:27017/hotelms";

import dbConnect from "./src/lib/mongodb.js";
import AppSetting from "./src/models/AppSetting.js";

async function testMongoDB() {
  try {
    console.log("Connecting to MongoDB...");
    await dbConnect();
    console.log("✅ MongoDB connected successfully");

    // Test creating/updating settings
    console.log("Testing admin settings...");

    let settings = await AppSetting.findOne({ settingsType: "main" });

    if (!settings) {
      settings = new AppSetting({
        settingsType: "main",
        siteName: "Tang Mow Hotel - Test",
        siteDescription: "Test MongoDB Integration",
      });
      await settings.save();
      console.log("✅ Created new admin settings");
    } else {
      console.log("✅ Found existing admin settings");
    }

    console.log("Settings:", {
      siteName: settings.siteName,
      siteDescription: settings.siteDescription,
      contactEmail: settings.contactInfo?.email,
      heroTitle: settings.heroSettings?.title,
      primaryColor: settings.branding?.primaryColor,
      createdAt: settings.createdAt,
    });

    console.log("✅ MongoDB integration test completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ MongoDB test failed:", error);
    process.exit(1);
  }
}

testMongoDB();
