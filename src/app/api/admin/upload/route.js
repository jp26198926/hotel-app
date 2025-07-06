import { NextResponse } from "next/server";
import { writeFile, mkdir, readdir, unlink } from "fs/promises";
import path from "path";
import { connectToDatabase } from "@/lib/mongoose";
import AppSetting from "@/models/AppSetting";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const type = formData.get("type"); // 'logo' or 'favicon'

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

    // Create upload directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), "public", "uploads", type);
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }

    // For logo and favicon, remove old files first
    if (type === "logo" || type === "favicon") {
      await connectToDatabase();

      // Get current settings to find old file
      const currentSettings = await AppSetting.findOne({
        settingsType: "main",
      });

      if (currentSettings) {
        const oldFileUrl =
          type === "logo"
            ? currentSettings.branding?.logo
            : currentSettings.branding?.favicon;

        if (oldFileUrl && oldFileUrl.startsWith("/uploads/")) {
          // Extract filename from URL
          const oldFileName = path.basename(oldFileUrl);
          const oldFilePath = path.join(uploadDir, oldFileName);

          try {
            await unlink(oldFilePath);
            console.log(`Deleted old ${type} file: ${oldFileName}`);
          } catch (error) {
            console.log(
              `Could not delete old ${type} file (may not exist): ${oldFileName}`
            );
          }
        }
      }
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = path.extname(file.name);
    const fileName = `${type}-${timestamp}${fileExtension}`;
    const filePath = path.join(uploadDir, fileName);

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Return the URL path for the uploaded file
    const fileUrl = `/uploads/${type}/${fileName}`;

    // For logo and favicon, update the database immediately
    if (type === "logo" || type === "favicon") {
      try {
        await connectToDatabase();

        const updateData = {};
        if (type === "logo") {
          updateData["branding.logo"] = fileUrl;
        } else if (type === "favicon") {
          updateData["branding.favicon"] = fileUrl;
        }

        await AppSetting.findOneAndUpdate(
          { settingsType: "main" },
          updateData,
          { new: true, upsert: true }
        );

        console.log(`Updated ${type} in database: ${fileUrl}`);
      } catch (dbError) {
        console.error(`Failed to update ${type} in database:`, dbError);
        // Don't fail the upload if database update fails
      }
    }

    const response = {
      success: true,
      message: `${type} uploaded successfully`,
      fileUrl: fileUrl,
    };

    // For gallery uploads, include additional metadata
    if (type === "gallery") {
      response.metadata = {
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        uploadPath: fileName,
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
