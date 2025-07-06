import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import AppSetting from "@/models/AppSetting";
import {
  uploadToCloudinary,
  replaceInCloudinary,
  getRootFolder,
} from "@/lib/cloudinary";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const type = formData.get("type"); // 'logo', 'favicon', 'hero', 'gallery'

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!type || !["logo", "favicon", "hero", "gallery"].includes(type)) {
      return NextResponse.json(
        { error: "Invalid upload type" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = {
      logo: ["image/jpeg", "image/jpg", "image/png", "image/svg+xml"],
      favicon: [
        "image/png",
        "image/x-icon",
        "image/vnd.microsoft.icon",
        "image/ico",
        "application/octet-stream",
      ],
      hero: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
      gallery: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
    };

    if (!allowedTypes[type].includes(file.type)) {
      // For favicon, also allow files with .ico extension regardless of MIME type
      if (type === "favicon" && file.name.toLowerCase().endsWith(".ico")) {
        // Allow .ico files even with generic MIME types
      } else {
        return NextResponse.json(
          {
            error: `Invalid file type for ${type}. Allowed types: ${allowedTypes[
              type
            ].join(", ")}`,
          },
          { status: 400 }
        );
      }
    }

    // Check if Cloudinary is configured
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return NextResponse.json(
        {
          error:
            "Cloudinary is not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET environment variables.",
        },
        { status: 500 }
      );
    }

    // Get site name for folder structure
    let siteName = "Tang Mow Hotel";
    try {
      await connectToDatabase();
      const settings = await AppSetting.findOne({ settingsType: "main" });
      if (settings?.siteName) {
        siteName = settings.siteName;
      }
    } catch (error) {
      console.warn("Could not fetch site name from database, using default");
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let uploadResult;

    // For logo and favicon, use replace functionality to maintain consistent URLs
    if (type === "logo" || type === "favicon") {
      const fileName = type === "logo" ? "logo" : "favicon";
      uploadResult = await replaceInCloudinary(
        buffer,
        type,
        fileName,
        siteName
      );
    } else {
      // For hero and gallery images, allow multiple files
      uploadResult = await uploadToCloudinary(buffer, {
        folder: type,
        siteName: siteName,
        originalName: file.name,
      });
    }

    if (!uploadResult.success) {
      return NextResponse.json(
        { error: uploadResult.error || "Failed to upload to Cloudinary" },
        { status: 500 }
      );
    }

    console.log(`☁️  File uploaded to Cloudinary successfully:`);
    console.log(`   - Type: ${type}`);
    console.log(`   - Site: ${siteName} (${getRootFolder(siteName)})`);
    console.log(`   - URL: ${uploadResult.url}`);
    console.log(`   - Public ID: ${uploadResult.publicId}`);
    console.log(`   - Folder: ${uploadResult.folder}`);

    // For logo and favicon, update the database immediately
    if (type === "logo" || type === "favicon") {
      try {
        await connectToDatabase();

        const updateData = {};
        if (type === "logo") {
          updateData["branding.logo"] = uploadResult.url;
        } else if (type === "favicon") {
          updateData["branding.favicon"] = uploadResult.url;
        }

        const updatedSettings = await AppSetting.findOneAndUpdate(
          { settingsType: "main" },
          updateData,
          { new: true, upsert: true }
        );

        console.log(`✅ Updated ${type} in database: ${uploadResult.url}`);
      } catch (dbError) {
        console.error(`❌ Failed to update ${type} in database:`, dbError);
        // Don't fail the upload if database update fails
      }
    }

    const response = {
      success: true,
      message: `${type} uploaded successfully to Cloudinary`,
      fileUrl: uploadResult.url,
      cloudinary: {
        publicId: uploadResult.publicId,
        folder: uploadResult.folder,
        format: uploadResult.format,
        width: uploadResult.width,
        height: uploadResult.height,
        bytes: uploadResult.bytes,
      },
    };

    // For gallery uploads, include additional metadata
    if (type === "gallery") {
      response.metadata = {
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        cloudinaryPublicId: uploadResult.publicId,
      };
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
