import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import {
  listCloudinaryResources,
  getCloudinaryUsage,
  deleteMultipleFromCloudinary,
  getRootFolder,
} from "@/lib/cloudinary";
import Gallery from "@/models/Gallery";
import AppSetting from "@/models/AppSetting";
import RoomType from "@/models/RoomType";
import EventType from "@/models/EventType";

export async function GET() {
  try {
    await connectToDatabase();

    // Get site name from settings
    const settings = await AppSetting.findOne({ settingsType: "main" });
    const siteName = settings?.siteName || "Tang Mow Hotel";
    const rootFolder = getRootFolder(siteName);

    // Get Cloudinary usage info
    const usageResult = await getCloudinaryUsage();

    // Get all resources from our site folder
    const resourcesResult = await listCloudinaryResources(rootFolder);

    if (!resourcesResult.success) {
      return NextResponse.json(
        { success: false, error: resourcesResult.error },
        { status: 500 }
      );
    }

    const results = {
      totalResources: resourcesResult.totalCount,
      orphanedResources: 0,
      cleanupResults: [],
      errors: [],
      usage: usageResult.success ? usageResult.usage : null,
      siteName,
      rootFolder,
    };

    // Group resources by folder type
    const folderTypes = [
      "logo",
      "favicon",
      "hero",
      "gallery",
      "room-types",
      "event-venues",
    ];

    for (const folderType of folderTypes) {
      const folderPrefix = `${rootFolder}/${folderType}`;
      const folderResources = resourcesResult.resources.filter((resource) =>
        resource.public_id.startsWith(folderPrefix)
      );

      // Check for orphaned resources
      const orphanedResources = await findOrphanedCloudinaryResources(
        folderType,
        folderResources
      );
      results.orphanedResources += orphanedResources.length;

      results.cleanupResults.push({
        directory: folderType,
        totalResources: folderResources.length,
        orphanedResources: orphanedResources.length,
        resources: orphanedResources,
      });
    }

    return NextResponse.json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error("Error analyzing Cloudinary resources:", error);
    return NextResponse.json(
      { success: false, error: "Failed to analyze Cloudinary resources" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();

    const { action, directory } = await request.json();

    if (action === "cleanup") {
      // Get site name from settings
      const settings = await AppSetting.findOne({ settingsType: "main" });
      const siteName = settings?.siteName || "Tang Mow Hotel";
      const rootFolder = getRootFolder(siteName);

      const results = await cleanupOrphanedCloudinaryResources(
        directory,
        rootFolder
      );
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

async function findOrphanedCloudinaryResources(folderType, resources) {
  const orphanedResources = [];

  for (const resource of resources) {
    const resourceUrl = resource.secure_url;
    const publicId = resource.public_id;
    let isOrphaned = true;

    try {
      // Check different collections based on folder type
      switch (folderType) {
        case "gallery":
          const galleryItem = await Gallery.findOne({
            $or: [
              { imageUrl: resourceUrl },
              {
                imageUrl: { $regex: publicId.split("/").pop(), $options: "i" },
              },
            ],
          });
          if (galleryItem) isOrphaned = false;
          break;

        case "logo":
        case "favicon":
        case "hero":
          const settings = await AppSetting.findOne({
            $or: [
              { "branding.logo": resourceUrl },
              { "branding.favicon": resourceUrl },
              { "heroSettings.backgroundImages": resourceUrl },
              {
                "branding.logo": {
                  $regex: publicId.split("/").pop(),
                  $options: "i",
                },
              },
              {
                "branding.favicon": {
                  $regex: publicId.split("/").pop(),
                  $options: "i",
                },
              },
              {
                "heroSettings.backgroundImages": {
                  $regex: publicId.split("/").pop(),
                  $options: "i",
                },
              },
            ],
          });
          if (settings) isOrphaned = false;
          break;

        case "room-types":
          const roomTypes = await RoomType.find({
            $or: [
              { "images.url": resourceUrl },
              {
                "images.url": {
                  $regex: publicId.split("/").pop(),
                  $options: "i",
                },
              },
            ],
          });
          if (roomTypes.length > 0) isOrphaned = false;
          break;

        case "event-venues":
          const eventTypes = await EventType.find({
            $or: [
              { "images.url": resourceUrl },
              {
                "images.url": {
                  $regex: publicId.split("/").pop(),
                  $options: "i",
                },
              },
            ],
          });
          if (eventTypes.length > 0) isOrphaned = false;
          break;

        default:
          // For unknown folder types, assume resources are valid
          isOrphaned = false;
          break;
      }

      if (isOrphaned) {
        orphanedResources.push({
          publicId: resource.public_id,
          url: resource.secure_url,
          filename: resource.public_id.split("/").pop(),
          size: resource.bytes || 0,
          format: resource.format,
          createdAt: resource.created_at,
          width: resource.width,
          height: resource.height,
        });
      }
    } catch (error) {
      console.error(`Error checking resource ${publicId}:`, error);
      // If we can't check, assume it's valid to be safe
    }
  }

  return orphanedResources;
}

async function cleanupOrphanedCloudinaryResources(
  targetDirectory = null,
  rootFolder
) {
  const results = {
    deletedResources: 0,
    deletedSize: 0,
    errors: [],
  };

  try {
    // Get all resources from the root folder
    const resourcesResult = await listCloudinaryResources(rootFolder);

    if (!resourcesResult.success) {
      throw new Error(resourcesResult.error);
    }

    const folderTypes = targetDirectory
      ? [targetDirectory]
      : ["logo", "favicon", "hero", "gallery", "room-types", "event-venues"];

    for (const folderType of folderTypes) {
      const folderPrefix = `${rootFolder}/${folderType}`;
      const folderResources = resourcesResult.resources.filter((resource) =>
        resource.public_id.startsWith(folderPrefix)
      );

      const orphanedResources = await findOrphanedCloudinaryResources(
        folderType,
        folderResources
      );

      if (orphanedResources.length > 0) {
        // Delete orphaned resources in batches
        const batchSize = 100; // Cloudinary API limit
        const publicIds = orphanedResources.map(
          (resource) => resource.publicId
        );

        for (let i = 0; i < publicIds.length; i += batchSize) {
          const batch = publicIds.slice(i, i + batchSize);
          try {
            const deleteResult = await deleteMultipleFromCloudinary(batch);
            if (deleteResult.success) {
              results.deletedResources += Object.keys(
                deleteResult.deleted
              ).length;
              results.deletedSize += orphanedResources
                .filter((resource) => batch.includes(resource.publicId))
                .reduce((total, resource) => total + resource.size, 0);
            } else {
              results.errors.push({
                batch: batch.join(", "),
                error: deleteResult.error,
              });
            }
          } catch (error) {
            results.errors.push({
              batch: batch.join(", "),
              error: error.message,
            });
          }
        }
      }
    }

    return results;
  } catch (error) {
    console.error("Error cleaning up Cloudinary resources:", error);
    results.errors.push({
      general: error.message,
    });
    return results;
  }
}
