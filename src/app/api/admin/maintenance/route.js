import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import { promises as fs } from "fs";
import path from "path";
import Gallery from "@/models/Gallery";
import AppSetting from "@/models/AppSetting";
import RoomType from "@/models/RoomType";
import EventType from "@/models/EventType";

export async function GET() {
  try {
    await connectToDatabase();

    // Get all directories in uploads
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    const uploadDirs = await fs.readdir(uploadsDir);

    const results = {
      totalFiles: 0,
      orphanedFiles: 0,
      cleanupResults: [],
      errors: [],
    };

    for (const dir of uploadDirs) {
      const dirPath = path.join(uploadsDir, dir);
      const stat = await fs.stat(dirPath);

      if (stat.isDirectory()) {
        try {
          const files = await fs.readdir(dirPath);
          const uploadFiles = files.filter((file) => !file.startsWith("."));

          results.totalFiles += uploadFiles.length;

          // Check files against database
          const orphanedFiles = await findOrphanedFiles(dir, uploadFiles);
          results.orphanedFiles += orphanedFiles.length;

          results.cleanupResults.push({
            directory: dir,
            totalFiles: uploadFiles.length,
            orphanedFiles: orphanedFiles.length,
            files: orphanedFiles,
          });
        } catch (error) {
          results.errors.push({
            directory: dir,
            error: error.message,
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error("Error analyzing uploads:", error);
    return NextResponse.json(
      { success: false, error: "Failed to analyze uploads" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();

    const { action, directory } = await request.json();

    if (action === "cleanup") {
      const results = await cleanupOrphanedFiles(directory);
      return NextResponse.json({
        success: true,
        data: results,
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error performing maintenance:", error);
    return NextResponse.json(
      { success: false, error: "Failed to perform maintenance" },
      { status: 500 }
    );
  }
}

async function findOrphanedFiles(directory, files) {
  const orphanedFiles = [];

  for (const file of files) {
    const filePath = `/uploads/${directory}/${file}`;
    let isOrphaned = true;

    try {
      // Check different collections based on directory
      switch (directory) {
        case "gallery":
          const galleryItem = await Gallery.findOne({
            $or: [
              { imageUrl: filePath },
              { imageUrl: file },
              { imageUrl: { $regex: file, $options: "i" } },
            ],
          });
          if (galleryItem) isOrphaned = false;
          break;

        case "logo":
        case "favicon":
        case "hero":
          const settings = await AppSetting.findOne({
            $or: [
              { "branding.logo": filePath },
              { "branding.favicon": filePath },
              { "branding.logo": file },
              { "branding.favicon": file },
              { "heroSettings.backgroundImages": filePath },
              { "heroSettings.backgroundImages": file },
              { "branding.logo": { $regex: file, $options: "i" } },
              { "branding.favicon": { $regex: file, $options: "i" } },
              {
                "heroSettings.backgroundImages": {
                  $regex: file,
                  $options: "i",
                },
              },
            ],
          });
          if (settings) isOrphaned = false;
          break;

        case "room-types":
          // Check RoomType model images
          const roomTypes = await RoomType.find({
            $or: [
              { "images.url": filePath },
              { "images.url": file },
              { "images.url": { $regex: file, $options: "i" } },
            ],
          });
          if (roomTypes.length > 0) isOrphaned = false;
          break;

        case "event-venues":
          // Check EventType model images
          const eventTypes = await EventType.find({
            $or: [
              { "images.url": filePath },
              { "images.url": file },
              { "images.url": { $regex: file, $options: "i" } },
            ],
          });
          if (eventTypes.length > 0) isOrphaned = false;
          break;

        default:
          // For unknown directories, assume files are valid
          isOrphaned = false;
          break;
      }

      if (isOrphaned) {
        orphanedFiles.push({
          filename: file,
          path: filePath,
          size: await getFileSize(directory, file),
        });
      }
    } catch (error) {
      console.error(`Error checking file ${file}:`, error);
      // If we can't check, assume it's valid to be safe
    }
  }

  return orphanedFiles;
}

async function cleanupOrphanedFiles(targetDirectory = null) {
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  const uploadDirs = targetDirectory
    ? [targetDirectory]
    : await fs.readdir(uploadsDir);

  const results = {
    deletedFiles: 0,
    deletedSize: 0,
    errors: [],
  };

  for (const dir of uploadDirs) {
    const dirPath = path.join(uploadsDir, dir);

    try {
      const stat = await fs.stat(dirPath);
      if (!stat.isDirectory()) continue;

      const files = await fs.readdir(dirPath);
      const uploadFiles = files.filter((file) => !file.startsWith("."));

      const orphanedFiles = await findOrphanedFiles(dir, uploadFiles);

      for (const orphanedFile of orphanedFiles) {
        try {
          const filePath = path.join(dirPath, orphanedFile.filename);
          await fs.unlink(filePath);
          results.deletedFiles++;
          results.deletedSize += orphanedFile.size;
        } catch (error) {
          results.errors.push({
            file: orphanedFile.filename,
            error: error.message,
          });
        }
      }
    } catch (error) {
      results.errors.push({
        directory: dir,
        error: error.message,
      });
    }
  }

  return results;
}

async function getFileSize(directory, filename) {
  try {
    const filePath = path.join(
      process.cwd(),
      "public",
      "uploads",
      directory,
      filename
    );
    const stats = await fs.stat(filePath);
    return stats.size;
  } catch (error) {
    return 0;
  }
}
