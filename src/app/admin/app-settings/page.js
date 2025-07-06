"use client";

import { useState, useEffect } from "react";
import { Save, Upload, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui";
import { useToast } from "@/components/Toast";
import { useAdminSettings } from "@/context/AdminSettingsContext";
import AdminLayout from "@/components/admin/AdminLayout";
import SafeImage from "@/components/SafeImage";

export default function AppSettingsPage() {
  const { showError, showSuccess } = useToast();
  const { appSettings, saveAppSettings } = useAdminSettings();
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);

  // Local state for form inputs
  const [localAppSettings, setLocalAppSettings] = useState(appSettings);

  // Update local state when context changes
  useEffect(() => {
    setLocalAppSettings(appSettings);
  }, [appSettings]);

  // Handle app settings change
  const handleAppSettingsChange = (key, value) => {
    setLocalAppSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Save settings to MongoDB
  const saveSettings = async () => {
    setIsSaving(true);
    try {
      await saveAppSettings(localAppSettings);
      showSuccess("App settings saved successfully!");
    } catch (error) {
      showError("Failed to save app settings. Please try again.");
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

  // Handle logo upload
  const handleLogoUpload = async () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/jpeg,image/jpg,image/png,image/svg+xml";
    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      setUploadingLogo(true);
      try {
        const fileUrl = await handleFileUpload(file, "logo");

        // Update local state to show the new logo immediately
        handleAppSettingsChange("logo", fileUrl);

        showSuccess("Logo uploaded and replaced successfully!");

        // Refresh the context to get the updated settings from the server
        window.location.reload();
      } catch (error) {
        console.error("Logo upload error:", error);
        showError("Failed to upload logo. Please try again.");
      } finally {
        setUploadingLogo(false);
      }
    };
    fileInput.click();
  };

  // Handle favicon upload
  const handleFaviconUpload = async () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept =
      "image/png,image/x-icon,image/vnd.microsoft.icon,.ico,.png";
    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      setUploadingFavicon(true);
      try {
        const fileUrl = await handleFileUpload(file, "favicon");

        // Update local state to show the new favicon immediately
        handleAppSettingsChange("favicon", fileUrl);

        showSuccess("Favicon uploaded and replaced successfully!");

        // Refresh the context to get the updated settings from the server
        window.location.reload();
      } catch (error) {
        console.error("Favicon upload error:", error);
        showError("Failed to upload favicon. Please try again.");
      } finally {
        setUploadingFavicon(false);
      }
    };
    fileInput.click();
  };

  return (
    <AdminLayout>
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Basic Settings */}
            <div className="space-y-6">
              <h3 className="text-base font-medium text-gray-900 border-b pb-2 font-poppins">
                Basic Information
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                  Site Name
                </label>
                <input
                  type="text"
                  value={localAppSettings.siteName}
                  onChange={(e) =>
                    handleAppSettingsChange("siteName", e.target.value)
                  }
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-gray-900 bg-white font-poppins"
                  placeholder="Enter site name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                  Site Description
                </label>
                <textarea
                  value={localAppSettings.siteDescription}
                  onChange={(e) =>
                    handleAppSettingsChange("siteDescription", e.target.value)
                  }
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-gray-900 bg-white font-poppins"
                  placeholder="Enter site description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={localAppSettings.contactEmail}
                  onChange={(e) =>
                    handleAppSettingsChange("contactEmail", e.target.value)
                  }
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-gray-900 bg-white font-poppins"
                  placeholder="Enter contact email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={localAppSettings.contactPhone || ""}
                  onChange={(e) =>
                    handleAppSettingsChange("contactPhone", e.target.value)
                  }
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-gray-900 bg-white font-poppins"
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                  Address
                </label>
                <textarea
                  value={localAppSettings.address || ""}
                  onChange={(e) =>
                    handleAppSettingsChange("address", e.target.value)
                  }
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-gray-900 bg-white font-poppins"
                  placeholder="Enter hotel address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                  Facebook Link
                </label>
                <input
                  type="url"
                  value={localAppSettings.facebookLink || ""}
                  onChange={(e) =>
                    handleAppSettingsChange("facebookLink", e.target.value)
                  }
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-gray-900 bg-white font-poppins"
                  placeholder="https://facebook.com/yourpage"
                />
              </div>
            </div>

            {/* Visual Settings */}
            <div className="space-y-6">
              <h3 className="text-base font-medium text-gray-900 border-b pb-2 font-poppins">
                Visual Settings
              </h3>

              {/* Production Warning */}
              {process.env.NODE_ENV === "production" && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-amber-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-amber-800">
                        Production Environment Limitation
                      </h3>
                      <div className="mt-2 text-sm text-amber-700">
                        <p>
                          Uploaded files may be lost when the server restarts on
                          this hosting platform. For production use, consider
                          implementing cloud storage (Cloudinary, AWS S3, etc.).
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  Uploading a new logo will replace the existing one and update
                  the database automatically.
                </p>
                <div className="flex items-center space-x-4">
                  {localAppSettings.logo && (
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                      <SafeImage
                        src={localAppSettings.logo}
                        alt="Logo"
                        width={64}
                        height={64}
                        className="object-cover"
                      />
                    </div>
                  )}
                  <Button
                    onClick={handleLogoUpload}
                    disabled={uploadingLogo}
                    variant="outline"
                    className="upload-button"
                  >
                    {uploadingLogo ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4 mr-2" />
                    )}
                    {uploadingLogo
                      ? "Replacing..."
                      : localAppSettings.logo
                      ? "Replace Logo"
                      : "Upload Logo"}
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Favicon
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  Uploading a new favicon will replace the existing one and
                  update the database automatically.
                </p>
                <div className="flex items-center space-x-4">
                  {localAppSettings.favicon && (
                    <div className="w-8 h-8 bg-gray-100 rounded overflow-hidden">
                      <SafeImage
                        src={localAppSettings.favicon}
                        alt="Favicon"
                        width={32}
                        height={32}
                        className="object-cover"
                      />
                    </div>
                  )}
                  <Button
                    onClick={handleFaviconUpload}
                    disabled={uploadingFavicon}
                    variant="outline"
                    className="upload-button"
                  >
                    {uploadingFavicon ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4 mr-2" />
                    )}
                    {uploadingFavicon
                      ? "Replacing..."
                      : localAppSettings.favicon
                      ? "Replace Favicon"
                      : "Upload Favicon"}
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                  Primary Color
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={localAppSettings.primaryColor || "#D4A574"}
                    onChange={(e) =>
                      handleAppSettingsChange("primaryColor", e.target.value)
                    }
                    className="w-12 h-10 rounded-lg cursor-pointer border border-gray-300"
                  />
                  <input
                    type="text"
                    value={localAppSettings.primaryColor || "#D4A574"}
                    onChange={(e) =>
                      handleAppSettingsChange("primaryColor", e.target.value)
                    }
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-gray-900 bg-white font-poppins"
                    placeholder="#000000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                  Secondary Color
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={localAppSettings.secondaryColor || "#8B4513"}
                    onChange={(e) =>
                      handleAppSettingsChange("secondaryColor", e.target.value)
                    }
                    className="w-12 h-10 rounded-lg cursor-pointer border border-gray-300"
                  />
                  <input
                    type="text"
                    value={localAppSettings.secondaryColor || "#8B4513"}
                    onChange={(e) =>
                      handleAppSettingsChange("secondaryColor", e.target.value)
                    }
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-gray-900 bg-white font-poppins"
                    placeholder="#000000"
                  />
                </div>
              </div>
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
    </AdminLayout>
  );
}
