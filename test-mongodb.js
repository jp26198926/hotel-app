// Test MongoDB connection and admin settings
import dotenv from "dotenv";
import dbConnect from "./src/lib/mongodb.js";
import AdminSettings from "./src/models/AdminSettings.js";

// Load environment variables
dotenv.config({ path: ".env.local" });

async function testMongoDB() {
  try {
    console.log("Connecting to MongoDB...");
    await dbConnect();
    console.log("✅ MongoDB connected successfully");

    // Test creating/updating settings
    console.log("Testing admin settings...");

    let settings = await AdminSettings.findOne({ settingsType: "main" });

    if (!settings) {
      settings = new AdminSettings({
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
      contactEmail: settings.contactEmail,
      heroTitle: settings.heroTitle,
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
