import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Convert site name to slug for folder naming
 * @param {string} siteName - The site name to convert
 * @returns {string} - Slugified site name
 */
function createSlug(siteName) {
  return siteName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

/**
 * Get the root folder name based on site name
 * @param {string} siteName - The site name
 * @returns {string} - The folder path for Cloudinary
 */
export function getRootFolder(siteName = "Tang Mow Hotel") {
  const slug = createSlug(siteName);
  return slug || "tang-mow-hotel"; // Fallback if slug is empty
}

/**
 * Upload file to Cloudinary
 * @param {Buffer|string} fileBuffer - The file buffer or base64 string
 * @param {Object} options - Upload options
 * @returns {Promise<Object>} - Upload result
 */
export async function uploadToCloudinary(fileBuffer, options = {}) {
  const {
    folder = "general",
    siteName = "Tang Mow Hotel",
    type = "image",
    originalName = "upload",
    overwrite = false,
  } = options;

  const rootFolder = getRootFolder(siteName);
  const fullFolder = `${rootFolder}/${folder}`;

  try {
    const uploadOptions = {
      folder: fullFolder,
      resource_type: type === "video" ? "video" : "image",
      overwrite,
      unique_filename: !overwrite,
      use_filename: true,
      filename_override: overwrite ? originalName : undefined,
    };

    // If it's a Buffer, convert to base64
    let uploadData = fileBuffer;
    if (Buffer.isBuffer(fileBuffer)) {
      uploadData = `data:image/jpeg;base64,${fileBuffer.toString("base64")}`;
    }

    const result = await cloudinary.uploader.upload(uploadData, uploadOptions);

    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      folder: fullFolder,
      format: result.format,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Delete file from Cloudinary
 * @param {string} publicId - The public ID of the file to delete
 * @returns {Promise<Object>} - Deletion result
 */
export async function deleteFromCloudinary(publicId) {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return {
      success: result.result === "ok",
      result: result.result,
    };
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Replace an existing file in Cloudinary (for logo/favicon replacement)
 * @param {Buffer|string} fileBuffer - The new file buffer
 * @param {string} folder - The folder name (logo, favicon, etc.)
 * @param {string} fileName - The specific filename to replace
 * @param {string} siteName - The site name for root folder
 * @returns {Promise<Object>} - Upload result
 */
export async function replaceInCloudinary(
  fileBuffer,
  folder,
  fileName,
  siteName
) {
  const rootFolder = getRootFolder(siteName);
  const fullFolder = `${rootFolder}/${folder}`;
  const publicId = `${fullFolder}/${fileName}`;

  try {
    // Delete the old file first
    await deleteFromCloudinary(publicId);

    // Upload the new file with the same public ID structure
    const result = await uploadToCloudinary(fileBuffer, {
      folder,
      siteName,
      originalName: fileName,
      overwrite: true,
    });

    return result;
  } catch (error) {
    console.error("Cloudinary replace error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * List all resources in a Cloudinary folder
 * @param {string} folderPath - The folder path to search
 * @param {Object} options - Search options
 * @returns {Promise<Object>} - List result
 */
export async function listCloudinaryResources(folderPath = "", options = {}) {
  try {
    const searchOptions = {
      type: "upload",
      prefix: folderPath,
      max_results: options.maxResults || 500,
      ...options,
    };

    // Use the search API with proper syntax
    const result = await cloudinary.search
      .expression(`folder:${folderPath}*`)
      .max_results(searchOptions.max_results)
      .execute();

    return {
      success: true,
      resources: result.resources,
      totalCount: result.total_count,
      nextCursor: result.next_cursor,
    };
  } catch (error) {
    console.error("Cloudinary list error:", error);

    // Fallback to admin API if search fails
    try {
      const adminResult = await cloudinary.api.resources({
        type: "upload",
        prefix: folderPath,
        max_results: options.maxResults || 500,
      });

      return {
        success: true,
        resources: adminResult.resources,
        totalCount: adminResult.total_count || adminResult.resources.length,
        nextCursor: adminResult.next_cursor,
      };
    } catch (adminError) {
      console.error("Cloudinary admin API error:", adminError);
      return {
        success: false,
        error: adminError.message || error.message,
        resources: [],
        totalCount: 0,
      };
    }
  }
}

/**
 * Get Cloudinary usage and storage information
 * @returns {Promise<Object>} - Usage information
 */
export async function getCloudinaryUsage() {
  try {
    const usage = await cloudinary.api.usage();

    return {
      success: true,
      usage: {
        storage: usage.storage || {},
        bandwidth: usage.bandwidth || {},
        requests: usage.requests || {},
        transformations: usage.transformations || {},
        plan: usage.plan || "Free",
      },
    };
  } catch (error) {
    console.error("Cloudinary usage error:", error);
    return {
      success: false,
      error: error.message,
      usage: {
        storage: { usage: 0, limit: 0 },
        bandwidth: { usage: 0, limit: 0 },
        requests: 0,
        transformations: 0,
        plan: "Unknown",
      },
    };
  }
}

/**
 * Delete multiple resources from Cloudinary
 * @param {string[]} publicIds - Array of public IDs to delete
 * @returns {Promise<Object>} - Deletion result
 */
export async function deleteMultipleFromCloudinary(publicIds) {
  try {
    const result = await cloudinary.api.delete_resources(publicIds);

    return {
      success: true,
      deleted: result.deleted,
      deletedCounts: result.deleted_counts,
      partial: result.partial || false,
    };
  } catch (error) {
    console.error("Cloudinary bulk delete error:", error);
    return {
      success: false,
      error: error.message,
      deleted: {},
      deletedCounts: {},
    };
  }
}

/**
 * Find orphaned Cloudinary resources by comparing with database
 * @param {string} siteName - The site name for folder structure
 * @returns {Promise<Object>} - Analysis result
 */
export async function analyzeCloudinaryResources(siteName) {
  try {
    const rootFolder = getRootFolder(siteName);

    // Get all resources from the site's folder
    const resourcesResult = await listCloudinaryResources(rootFolder);

    if (!resourcesResult.success) {
      throw new Error(resourcesResult.error);
    }

    const analysis = {
      totalResources: resourcesResult.totalCount,
      byFolder: {},
      orphanedResources: [],
      errors: [],
    };

    // Group resources by folder type
    const folderTypes = ["logo", "favicon", "hero", "gallery"];

    for (const folderType of folderTypes) {
      const folderPrefix = `${rootFolder}/${folderType}`;
      const folderResources = resourcesResult.resources.filter((resource) =>
        resource.public_id.startsWith(folderPrefix)
      );

      analysis.byFolder[folderType] = {
        totalResources: folderResources.length,
        resources: folderResources,
        orphaned: [],
      };
    }

    return {
      success: true,
      analysis,
      usage: await getCloudinaryUsage(),
    };
  } catch (error) {
    console.error("Cloudinary analysis error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

export default cloudinary;
