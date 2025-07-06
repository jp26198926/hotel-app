import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

// Simple MIME type lookup without external dependency
function getMimeType(filename) {
  const ext = path.extname(filename).toLowerCase();
  const mimeTypes = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".webp": "image/webp",
    ".ico": "image/x-icon",
    ".bmp": "image/bmp",
    ".tiff": "image/tiff",
    ".tif": "image/tiff",
  };
  return mimeTypes[ext] || "application/octet-stream";
}

export async function GET(request, { params }) {
  try {
    const { slug } = params;
    const [type, filename] = slug;

    if (!type || !filename) {
      return new NextResponse("Invalid path", { status: 400 });
    }

    // Construct file path
    const filePath = path.join(
      process.cwd(),
      "public",
      "uploads",
      type,
      filename
    );

    try {
      // Check if file exists
      await fs.access(filePath);

      // Read file
      const fileBuffer = await fs.readFile(filePath);

      // Get mime type
      const mimeType = getMimeType(filename);

      // Return file with appropriate headers
      return new NextResponse(fileBuffer, {
        headers: {
          "Content-Type": mimeType,
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    } catch (error) {
      console.error("File not found:", filePath);
      return new NextResponse("File not found", { status: 404 });
    }
  } catch (error) {
    console.error("Error serving file:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
