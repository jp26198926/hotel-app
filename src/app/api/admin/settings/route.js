import dbConnect from "@/lib/mongodb";
import AdminSettings from "@/models/AdminSettings";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();

    let settings = await AdminSettings.findOne({ settingsType: "main" });

    // If no settings exist, create default settings
    if (!settings) {
      settings = new AdminSettings({ settingsType: "main" });
      await settings.save();
    }

    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error("Error fetching admin settings:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch admin settings" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    await dbConnect();

    const body = await request.json();

    // Find existing settings or create new one
    let settings = await AdminSettings.findOne({ settingsType: "main" });

    if (!settings) {
      settings = new AdminSettings({ settingsType: "main", ...body });
    } else {
      // Update existing settings
      Object.keys(body).forEach((key) => {
        if (body[key] !== undefined) {
          settings[key] = body[key];
        }
      });
    }

    await settings.save();

    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error("Error updating admin settings:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update admin settings" },
      { status: 500 }
    );
  }
}
