"use client";

import { useState, useEffect } from "react";
import {
  Save,
  Upload,
  RefreshCw,
  Plus,
  X,
  Eye,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui";
import { useToast } from "@/components/Toast";
import { useAdminSettings } from "@/context/AdminSettingsContext";
import AdminLayout from "@/components/admin/AdminLayout";
import Image from "next/image";

export default function HeroSectionPage() {
  const { showError, showSuccess } = useToast();
  const { heroSettings, saveHeroSettings } = useAdminSettings();
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingHeroImage, setUploadingHeroImage] = useState(false);
  const [loadingImages, setLoadingImages] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Local state for form inputs
  const [localHeroSettings, setLocalHeroSettings] = useState(heroSettings);

  // Update local state when context changes
  useEffect(() => {
    setLocalHeroSettings(heroSettings);
  }, [heroSettings]);

  // Initialize loading states for existing images
  useEffect(() => {
    if (localHeroSettings.backgroundImages?.length > 0) {
      const initialLoadingState = {};
      localHeroSettings.backgroundImages.forEach((image) => {
        initialLoadingState[image] = undefined; // undefined means not loaded yet
      });
      setLoadingImages(initialLoadingState);
    }
  }, [localHeroSettings.backgroundImages]);

  // Save settings to MongoDB
  const saveSettings = async () => {
    setIsSaving(true);
    try {
      await saveHeroSettings(localHeroSettings);
      showSuccess("Hero section settings saved successfully!");
    } catch (error) {
      showError("Failed to save hero section settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle file upload
  const handleFileUpload = async (file, type) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    try {
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const data = await response.json();
      return data.fileUrl;
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  // Handle background image upload
  const handleBackgroundImageUpload = async () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/jpeg,image/jpg,image/png,image/webp";
    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      setUploadingHeroImage(true);
      try {
        const fileUrl = await handleFileUpload(file, "hero");

        // Add the new image to the background images array
        const updatedHeroSettings = {
          ...localHeroSettings,
          backgroundImages: [
            ...(localHeroSettings.backgroundImages || []),
            fileUrl,
          ],
        };

        setLocalHeroSettings(updatedHeroSettings);

        // Auto-save the settings to database
        await saveHeroSettings(updatedHeroSettings);

        showSuccess("Background image uploaded and saved successfully!");
      } catch (error) {
        console.error("Background image upload error:", error);
        showError("Failed to upload background image. Please try again.");
      } finally {
        setUploadingHeroImage(false);
      }
    };
    fileInput.click();
  };

  // Remove background image
  const removeBackgroundImage = async (index) => {
    const updatedHeroSettings = {
      ...localHeroSettings,
      backgroundImages: localHeroSettings.backgroundImages.filter(
        (_, i) => i !== index
      ),
    };

    setLocalHeroSettings(updatedHeroSettings);

    try {
      // Auto-save the settings to database
      await saveHeroSettings(updatedHeroSettings);
      showSuccess("Background image removed successfully!");
    } catch (error) {
      console.error("Remove background image error:", error);
      showError("Failed to remove background image. Please try again.");
    }
  };

  // Handle image modal
  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsModalOpen(true);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
    setIsModalOpen(false);
  };

  // Handle image loading states
  const handleImageLoad = (imageUrl) => {
    setLoadingImages((prev) => ({ ...prev, [imageUrl]: false }));
  };

  const handleImageError = (imageUrl) => {
    setLoadingImages((prev) => ({ ...prev, [imageUrl]: false }));
    console.error("Image failed to load:", imageUrl);
  };

  // Add cache busting for uploaded images to ensure they display properly
  const getCachebustedUrl = (url) => {
    if (url && url.startsWith("/uploads/")) {
      return `${url}?t=${Date.now()}`;
    }
    return url;
  };

  // Handle Escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isModalOpen) {
        closeImageModal();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isModalOpen]);

  return (
    <AdminLayout>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Hero Section</h2>
          <p className="text-gray-600 mt-1">
            Configure the main hero section content
          </p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Hero Content */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                Hero Content
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Main Title
                </label>
                <input
                  type="text"
                  value={localHeroSettings.title || ""}
                  onChange={(e) =>
                    setLocalHeroSettings((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-gray-900 bg-white"
                  placeholder="Enter main title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={localHeroSettings.subtitle || ""}
                  onChange={(e) =>
                    setLocalHeroSettings((prev) => ({
                      ...prev,
                      subtitle: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-gray-900 bg-white"
                  placeholder="Enter subtitle"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={localHeroSettings.description || ""}
                  onChange={(e) =>
                    setLocalHeroSettings((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-gray-900 bg-white"
                  placeholder="Enter hero description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Call to Action
                </label>
                <input
                  type="text"
                  value={localHeroSettings.ctaText || ""}
                  onChange={(e) =>
                    setLocalHeroSettings((prev) => ({
                      ...prev,
                      ctaText: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-gray-900 bg-white"
                  placeholder="Enter primary CTA text"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Secondary Call to Action
                </label>
                <input
                  type="text"
                  value={localHeroSettings.ctaSecondaryText || ""}
                  onChange={(e) =>
                    setLocalHeroSettings((prev) => ({
                      ...prev,
                      ctaSecondaryText: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-gray-900 bg-white"
                  placeholder="Enter secondary CTA text"
                />
              </div>
            </div>

            {/* Hero Images */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                Background Images
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {localHeroSettings.backgroundImages?.length > 0 ? (
                  localHeroSettings.backgroundImages.map((image, index) => (
                    <div
                      key={index}
                      className="relative group bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                      onClick={() => openImageModal(image)}
                      title="Click to preview image"
                    >
                      <div
                        className={`aspect-video hero-image-container ${
                          loadingImages[image] === false ? "loaded" : ""
                        }`}
                      >
                        <Image
                          src={getCachebustedUrl(image)}
                          alt={`Background ${index + 1}`}
                          width={300}
                          height={200}
                          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 hero-image ${
                            loadingImages[image] === false ? "loaded" : ""
                          }`}
                          onLoad={() => handleImageLoad(image)}
                          onError={() => handleImageError(image)}
                        />
                        {/* Click to preview indicator */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-30">
                          <div className="bg-white bg-opacity-90 rounded-full p-3">
                            <Eye className="h-6 w-6 text-gray-700" />
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent modal from opening
                          removeBackgroundImage(index);
                        }}
                        className="absolute top-2 right-2 p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg z-10"
                        title="Remove image"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <div className="absolute bottom-2 left-2 right-2">
                        <div className="bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          Background {index + 1}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <ImageIcon className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-sm">
                      No background images uploaded yet
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      Upload images to display in the hero section
                    </p>
                  </div>
                )}
              </div>

              <Button
                onClick={handleBackgroundImageUpload}
                variant="outline"
                className="w-full upload-button"
                disabled={uploadingHeroImage}
              >
                {uploadingHeroImage ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                {uploadingHeroImage ? "Uploading..." : "Add Background Image"}
              </Button>
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex justify-end">
              <Button
                onClick={saveSettings}
                disabled={isSaving}
                className="bg-gradient-to-r from-red-700 to-orange-600 hover:from-red-800 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isSaving ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
          onClick={closeImageModal}
        >
          <div
            className="bg-white rounded-lg overflow-hidden shadow-lg max-w-4xl max-h-[90vh] w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <Image
                src={getCachebustedUrl(selectedImage)}
                alt="Selected Background Image"
                width={800}
                height={600}
                className="modal-image w-full h-auto object-cover max-h-[80vh]"
                onLoad={(e) => {
                  e.target.classList.add("loaded");
                }}
                onError={(e) => {
                  console.error("Modal image failed to load:", selectedImage);
                  e.target.style.display = "none";
                  const errorDiv = document.createElement("div");
                  errorDiv.className =
                    "w-full h-64 flex items-center justify-center bg-red-100 text-red-600";
                  errorDiv.innerHTML = "Failed to load image";
                  e.target.parentElement.appendChild(errorDiv);
                }}
              />
              <button
                onClick={closeImageModal}
                className="absolute top-3 right-3 p-2 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg transition-colors duration-200"
                title="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
