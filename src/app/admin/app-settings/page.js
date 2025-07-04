"use client";

import { useState, useEffect } from "react";
import { Save, Upload, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui";
import { useToast } from "@/components/Toast";
import { useAdminSettings } from "@/context/AdminSettingsContext";
import AdminLayout from "@/components/admin/AdminLayout";
import Image from "next/image";

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
        handleAppSettingsChange("logo", fileUrl);

        // Auto-save the settings to database
        const updatedSettings = { ...localAppSettings, logo: fileUrl };
        await saveAppSettings(updatedSettings);

        showSuccess("Logo uploaded and saved successfully!");
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
        handleAppSettingsChange("favicon", fileUrl);

        // Auto-save the settings to database
        const updatedSettings = { ...localAppSettings, favicon: fileUrl };
        await saveAppSettings(updatedSettings);

        showSuccess("Favicon uploaded and saved successfully!");
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo
                </label>
                <div className="flex items-center space-x-4">
                  {localAppSettings.logo && (
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                      <Image
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
                    {uploadingLogo ? "Uploading..." : "Upload Logo"}
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Favicon
                </label>
                <div className="flex items-center space-x-4">
                  {localAppSettings.favicon && (
                    <div className="w-8 h-8 bg-gray-100 rounded overflow-hidden">
                      <Image
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
                    {uploadingFavicon ? "Uploading..." : "Upload Favicon"}
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
