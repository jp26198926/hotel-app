import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

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
