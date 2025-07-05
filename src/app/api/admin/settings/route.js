import { connectToDatabase } from "@/lib/mongoose";
import AppSetting from "@/models/AppSetting";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();

    let settings = await AppSetting.findOne({ settingsType: "main" });

    // If no settings exist, create default settings
    if (!settings) {
      settings = new AppSetting({ settingsType: "main" });
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
    await connectToDatabase();

    const body = await request.json();

    // Find existing settings or create new one
    let settings = await AppSetting.findOne({ settingsType: "main" });

    if (!settings) {
      settings = new AppSetting({ settingsType: "main" });
    }

    // Handle nested updates for AppSetting structure
    if (body.siteName !== undefined) settings.siteName = body.siteName;
    if (body.siteDescription !== undefined)
      settings.siteDescription = body.siteDescription;
    if (body.contactEmail !== undefined)
      settings.contactInfo.email = body.contactEmail;
    if (body.contactPhone !== undefined)
      settings.contactInfo.phone = body.contactPhone;
    if (body.address !== undefined) settings.contactInfo.address = body.address;
    if (body.facebookLink !== undefined)
      settings.socialMedia.facebook = body.facebookLink;
    if (body.logo !== undefined) settings.branding.logo = body.logo;
    if (body.favicon !== undefined) settings.branding.favicon = body.favicon;
    if (body.primaryColor !== undefined)
      settings.branding.primaryColor = body.primaryColor;
    if (body.secondaryColor !== undefined)
      settings.branding.secondaryColor = body.secondaryColor;

    // Hero settings
    if (body.heroTitle !== undefined)
      settings.heroSettings.title = body.heroTitle;
    if (body.heroSubtitle !== undefined)
      settings.heroSettings.subtitle = body.heroSubtitle;
    if (body.heroDescription !== undefined)
      settings.heroSettings.description = body.heroDescription;
    if (body.heroCtaText !== undefined)
      settings.heroSettings.primaryCTA = body.heroCtaText;
    if (body.heroCtaSecondaryText !== undefined)
      settings.heroSettings.secondaryCTA = body.heroCtaSecondaryText;
    if (body.heroBackgroundImages !== undefined)
      settings.heroSettings.backgroundImages = body.heroBackgroundImages;

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
