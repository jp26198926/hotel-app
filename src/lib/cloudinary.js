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

export default cloudinary;
