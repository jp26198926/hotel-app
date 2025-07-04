"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Upload,
  RefreshCw,
  Filter,
  Grid,
  List,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui";
import { useToast } from "@/components/Toast";
import AdminLayout from "@/components/admin/AdminLayout";
import Image from "next/image";

export default function GalleryPage() {
  const { showError, showSuccess } = useToast();
  const [viewMode, setViewMode] = useState("grid");

  // Gallery state
  const [galleryItems, setGalleryItems] = useState([]);
  const [loadingGallery, setLoadingGallery] = useState(false);
  const [galleryFilter, setGalleryFilter] = useState("all");

  // Modal state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadingMultiple, setUploadingMultiple] = useState(false);

  // Gallery functions
  const fetchGalleryItems = async () => {
    setLoadingGallery(true);
    try {
      const response = await fetch("/api/admin/gallery");
      const data = await response.json();
      if (data.success) {
        setGalleryItems(data.items || []);
      } else {
        showError(data.error || "Failed to fetch gallery items");
      }
    } catch (error) {
      console.error("Error fetching gallery items:", error);
      showError("Error fetching gallery items");
    } finally {
      setLoadingGallery(false);
    }
  };

  const handleGalleryDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this gallery item?")) return;
    setLoadingGallery(true);
    try {
      const response = await fetch(`/api/admin/gallery?id=${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        showSuccess("Gallery item deleted successfully!");
        fetchGalleryItems();
      } else {
        showError(data.error || "Failed to delete gallery item");
      }
    } catch (error) {
      console.error("Error deleting gallery item:", error);
      showError("Error deleting gallery item");
    } finally {
      setLoadingGallery(false);
    }
  };

  // Load gallery items on component mount
  useEffect(() => {
    fetchGalleryItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredItems = galleryItems.filter(
    (item) => galleryFilter === "all" || item.category === galleryFilter
  );

  // Multiple file upload handler
  const handleMultipleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);

    // Create preview data for each file
    const previews = files.map((file, index) => ({
      id: index,
      file,
      preview: URL.createObjectURL(file),
      title: file.name.replace(/\.[^/.]+$/, "").substring(0, 100), // Remove extension and limit to 100 chars
      description: "",
      category: "hotel-exterior",
      altText: file.name.substring(0, 200), // Limit to 200 chars
      tags: [],
      isFeatured: false,
      isPublic: true,
      displayOrder: 0,
    }));
    setSelectedFiles(previews);
  };

  // Upload multiple files
  const handleMultipleUpload = async () => {
    if (selectedFiles.length === 0) {
      showError("Please select files to upload");
      return;
    }

    setUploadingMultiple(true);
    setUploadProgress({});

    try {
      const uploadPromises = selectedFiles.map(async (fileData, index) => {
        const formData = new FormData();
        formData.append("file", fileData.file);
        formData.append("type", "gallery");

        // Update progress
        setUploadProgress((prev) => ({
          ...prev,
          [index]: { status: "uploading", progress: 0 },
        }));

        try {
          const uploadResponse = await fetch("/api/admin/upload", {
            method: "POST",
            body: formData,
          });

          const uploadData = await uploadResponse.json();
          if (!uploadData.success) {
            throw new Error(uploadData.error || "Upload failed");
          }

          // Update progress
          setUploadProgress((prev) => ({
            ...prev,
            [index]: { status: "saving", progress: 50 },
          }));

          // Save to gallery
          const galleryData = {
            ...fileData,
            imageUrl: uploadData.fileUrl,
            thumbnailUrl: uploadData.fileUrl, // Use same URL for thumbnail
            mimeType:
              fileData.file.type === "image/jpg"
                ? "image/jpeg"
                : fileData.file.type, // Normalize MIME type
            file: undefined, // Remove file object
            preview: undefined, // Remove preview URL
          };

          const saveResponse = await fetch("/api/admin/gallery", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(galleryData),
          });

          const saveData = await saveResponse.json();

          if (!saveData.success) {
            throw new Error(saveData.error || "Failed to save gallery item");
          }

          // Update progress
          setUploadProgress((prev) => ({
            ...prev,
            [index]: { status: "complete", progress: 100 },
          }));

          return saveData;
        } catch (error) {
          setUploadProgress((prev) => ({
            ...prev,
            [index]: { status: "error", progress: 0, error: error.message },
          }));
          throw error;
        }
      });

      const results = await Promise.allSettled(uploadPromises);
      const successful = results.filter(
        (result) => result.status === "fulfilled"
      );
      const failed = results.filter((result) => result.status === "rejected");

      if (successful.length > 0) {
        showSuccess(`Successfully uploaded ${successful.length} image(s)`);
        await fetchGalleryItems(); // Refresh gallery
      }

      if (failed.length > 0) {
        showError(`Failed to upload ${failed.length} image(s)`);
      }

      // Close modal if all successful
      if (failed.length === 0) {
        setIsUploadModalOpen(false);
        setSelectedFiles([]);
        setUploadProgress({});
      }
    } catch (error) {
      console.error("Error in multiple upload:", error);
      showError("Error uploading images");
    } finally {
      setUploadingMultiple(false);
    }
  };

  // Update selected file data
  const updateSelectedFileData = (index, field, value) => {
    setSelectedFiles((prev) =>
      prev.map((file, i) => (i === index ? { ...file, [field]: value } : file))
    );
  };

  // Remove selected file
  const removeSelectedFile = (index) => {
    setSelectedFiles((prev) => {
      const newFiles = prev.filter((_, i) => i !== index);
      // Clean up preview URL
      if (prev[index]?.preview) {
        URL.revokeObjectURL(prev[index].preview);
      }
      return newFiles;
    });
    setUploadProgress((prev) => {
      const newProgress = { ...prev };
      delete newProgress[index];
      return newProgress;
    });
  };

  return (
    <AdminLayout>
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Gallery Management
            </h3>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1 rounded ${
                    viewMode === "grid"
                      ? "bg-white text-gray-900 shadow"
                      : "text-gray-500"
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1 rounded ${
                    viewMode === "list"
                      ? "bg-white text-gray-900 shadow"
                      : "text-gray-500"
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
              <Button
                onClick={() => setIsUploadModalOpen(true)}
                className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Image
              </Button>
            </div>
          </div>

          {/* Gallery Filter */}
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-700">Filter by category:</span>
            <select
              value={galleryFilter}
              onChange={(e) => setGalleryFilter(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="hotel-exterior">Hotel Exterior</option>
              <option value="hotel-interior">Hotel Interior</option>
              <option value="rooms">Rooms</option>
              <option value="restaurant">Restaurant</option>
              <option value="amenities">Amenities</option>
              <option value="events">Events</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Gallery Items */}
          {loadingGallery && !galleryItems.length ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin text-gray-500" />
              <span className="ml-2 text-gray-500">
                Loading gallery items...
              </span>
            </div>
          ) : (
            <div
              className={`${
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                  : "space-y-4"
              }`}
            >
              {filteredItems.map((item) => (
                <div
                  key={item._id}
                  className={`bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow ${
                    viewMode === "list" ? "flex items-center space-x-4 p-4" : ""
                  }`}
                >
                  <div
                    className={`${
                      viewMode === "list"
                        ? "w-20 h-20 flex-shrink-0"
                        : "aspect-square"
                    }`}
                  >
                    <Image
                      src={item.imageUrl}
                      alt={item.altText}
                      width={viewMode === "list" ? 80 : 300}
                      height={viewMode === "list" ? 80 : 300}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className={`${viewMode === "list" ? "flex-1" : "p-3"}`}>
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900 truncate">
                        {item.title}
                      </h4>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleGalleryDelete(item._id)}
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                        {item.category}
                      </span>
                      {item.isFeatured && (
                        <span className="text-xs px-2 py-1 bg-yellow-100 rounded-full text-yellow-600">
                          Featured
                        </span>
                      )}
                      {!item.isPublic && (
                        <span className="text-xs px-2 py-1 bg-red-100 rounded-full text-red-600">
                          Private
                        </span>
                      )}
                    </div>
                    {viewMode === "list" && item.description && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loadingGallery && galleryItems.length === 0 && (
            <div className="text-center py-12">
              <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No gallery items
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by uploading your first image.
              </p>
              <div className="mt-6">
                <Button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Image
                </Button>
              </div>
            </div>
          )}

          {/* Filtered Empty State */}
          {!loadingGallery &&
            galleryItems.length > 0 &&
            filteredItems.length === 0 && (
              <div className="text-center py-8">
                <Filter className="mx-auto h-8 w-8 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No items in this category
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try selecting a different category or upload images for this
                  category.
                </p>
              </div>
            )}
        </div>
      </div>

      {/* Multiple Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Upload Multiple Images
                </h3>
                <button
                  onClick={() => {
                    setIsUploadModalOpen(false);
                    setSelectedFiles([]);
                    setUploadProgress({});
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              {/* File Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Images
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleMultipleFileSelect}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Select multiple images to upload at once
                </p>
              </div>

              {/* Selected Files Preview */}
              {selectedFiles.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-md font-medium text-gray-900">
                    Selected Images ({selectedFiles.length})
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedFiles.map((fileData, index) => (
                      <div
                        key={index}
                        className="border rounded-lg p-4 bg-gray-50"
                      >
                        <div className="flex items-start space-x-4">
                          {/* Image Preview */}
                          <div className="relative w-20 h-20 flex-shrink-0">
                            <Image
                              src={fileData.preview}
                              alt="Preview"
                              fill
                              className="object-cover rounded-md"
                            />
                            <button
                              onClick={() => removeSelectedFile(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                            >
                              ×
                            </button>
                          </div>

                          {/* File Details */}
                          <div className="flex-1 space-y-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Title
                              </label>
                              <input
                                type="text"
                                value={fileData.title}
                                onChange={(e) =>
                                  updateSelectedFileData(
                                    index,
                                    "title",
                                    e.target.value
                                  )
                                }
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Category
                              </label>
                              <select
                                value={fileData.category}
                                onChange={(e) =>
                                  updateSelectedFileData(
                                    index,
                                    "category",
                                    e.target.value
                                  )
                                }
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              >
                                <option value="hotel-exterior">
                                  Hotel Exterior
                                </option>
                                <option value="hotel-interior">
                                  Hotel Interior
                                </option>
                                <option value="rooms">Rooms</option>
                                <option value="restaurant">Restaurant</option>
                                <option value="amenities">Amenities</option>
                                <option value="events">Events</option>
                                <option value="other">Other</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Description
                              </label>
                              <textarea
                                value={fileData.description}
                                onChange={(e) =>
                                  updateSelectedFileData(
                                    index,
                                    "description",
                                    e.target.value
                                  )
                                }
                                rows={2}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                            </div>

                            <div className="flex items-center space-x-4">
                              <label className="flex items-center text-sm text-gray-700">
                                <input
                                  type="checkbox"
                                  checked={fileData.isFeatured}
                                  onChange={(e) =>
                                    updateSelectedFileData(
                                      index,
                                      "isFeatured",
                                      e.target.checked
                                    )
                                  }
                                  className="mr-2"
                                />
                                Featured
                              </label>
                              <label className="flex items-center text-sm text-gray-700">
                                <input
                                  type="checkbox"
                                  checked={fileData.isPublic}
                                  onChange={(e) =>
                                    updateSelectedFileData(
                                      index,
                                      "isPublic",
                                      e.target.checked
                                    )
                                  }
                                  className="mr-2"
                                />
                                Public
                              </label>
                            </div>

                            {/* Upload Progress */}
                            {uploadProgress[index] && (
                              <div className="mt-2">
                                <div className="flex items-center justify-between text-xs mb-1">
                                  <span
                                    className={`
                                    ${
                                      uploadProgress[index].status ===
                                      "complete"
                                        ? "text-green-600"
                                        : ""
                                    }
                                    ${
                                      uploadProgress[index].status === "error"
                                        ? "text-red-600"
                                        : ""
                                    }
                                    ${
                                      uploadProgress[index].status ===
                                        "uploading" ||
                                      uploadProgress[index].status === "saving"
                                        ? "text-blue-600"
                                        : ""
                                    }
                                  `}
                                  >
                                    {uploadProgress[index].status ===
                                      "uploading" && "Uploading..."}
                                    {uploadProgress[index].status ===
                                      "saving" && "Saving..."}
                                    {uploadProgress[index].status ===
                                      "complete" && "Complete"}
                                    {uploadProgress[index].status === "error" &&
                                      "Error"}
                                  </span>
                                  <span>{uploadProgress[index].progress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1">
                                  <div
                                    className={`h-1 rounded-full transition-all duration-300 ${
                                      uploadProgress[index].status ===
                                      "complete"
                                        ? "bg-green-500"
                                        : uploadProgress[index].status ===
                                          "error"
                                        ? "bg-red-500"
                                        : "bg-blue-500"
                                    }`}
                                    style={{
                                      width: `${uploadProgress[index].progress}%`,
                                    }}
                                  ></div>
                                </div>
                                {uploadProgress[index].error && (
                                  <p className="text-xs text-red-600 mt-1">
                                    {uploadProgress[index].error}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {selectedFiles.length > 0 && (
                    <span>{selectedFiles.length} image(s) selected</span>
                  )}
                </div>
                <div className="flex space-x-3">
                  <Button
                    onClick={() => {
                      setIsUploadModalOpen(false);
                      setSelectedFiles([]);
                      setUploadProgress({});
                    }}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700"
                    disabled={uploadingMultiple}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleMultipleUpload}
                    disabled={selectedFiles.length === 0 || uploadingMultiple}
                    className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white"
                  >
                    {uploadingMultiple ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload{" "}
                        {selectedFiles.length > 0
                          ? `${selectedFiles.length} `
                          : ""}
                        Image{selectedFiles.length !== 1 ? "s" : ""}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
