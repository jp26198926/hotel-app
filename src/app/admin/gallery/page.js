"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Edit,
  Upload,
  Save,
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
  const [galleryFormData, setGalleryFormData] = useState({
    title: "",
    description: "",
    category: "hotel-exterior",
    altText: "",
    tags: [],
    location: "",
    photographer: "",
    dateTaken: "",
    isFeatured: false,
    isPublic: true,
    displayOrder: 0,
    imageUrl: "",
  });
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [galleryFilter, setGalleryFilter] = useState("all");
  const [editingGalleryItem, setEditingGalleryItem] = useState(null);

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

  const handleGalleryUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingGallery(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "gallery");

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setGalleryFormData((prev) => ({
          ...prev,
          imageUrl: data.fileUrl,
        }));
        showSuccess("Image uploaded successfully!");
      } else {
        showError(data.error || "Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      showError("Error uploading image");
    } finally {
      setUploadingGallery(false);
    }
  };

  const handleGallerySubmit = async (e) => {
    e.preventDefault();
    if (
      !galleryFormData.imageUrl ||
      !galleryFormData.title ||
      !galleryFormData.altText
    ) {
      showError("Please fill in all required fields");
      return;
    }

    setLoadingGallery(true);
    try {
      const method = editingGalleryItem ? "PUT" : "POST";
      const body = editingGalleryItem
        ? { ...galleryFormData, id: editingGalleryItem._id }
        : galleryFormData;

      const response = await fetch("/api/admin/gallery", {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (data.success) {
        showSuccess(
          `Gallery item ${
            editingGalleryItem ? "updated" : "created"
          } successfully!`
        );
        fetchGalleryItems();
        resetGalleryForm();
      } else {
        showError(
          data.error ||
            `Failed to ${editingGalleryItem ? "update" : "create"} gallery item`
        );
      }
    } catch (error) {
      console.error("Error saving gallery item:", error);
      showError("Error saving gallery item");
    } finally {
      setLoadingGallery(false);
    }
  };

  const handleGalleryEdit = (item) => {
    setEditingGalleryItem(item);
    setGalleryFormData({
      ...item,
      tags: item.tags || [],
    });
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

  const resetGalleryForm = () => {
    setGalleryFormData({
      title: "",
      description: "",
      category: "hotel-exterior",
      altText: "",
      tags: [],
      location: "",
      photographer: "",
      dateTaken: "",
      isFeatured: false,
      isPublic: true,
      displayOrder: 0,
      imageUrl: "",
    });
    setEditingGalleryItem(null);
  };

  // Load gallery items on component mount
  useEffect(() => {
    fetchGalleryItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredItems = galleryItems.filter(
    (item) => galleryFilter === "all" || item.category === galleryFilter
  );

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
                onClick={() => document.getElementById("galleryUpload").click()}
                disabled={uploadingGallery}
                className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white"
              >
                {uploadingGallery ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                Add Image
              </Button>
            </div>
          </div>

          {/* Gallery Upload Form */}
          <form
            onSubmit={handleGallerySubmit}
            className="mb-6 p-4 border rounded-lg bg-gray-50"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image *
                </label>
                <input
                  type="file"
                  id="galleryUpload"
                  accept="image/*"
                  onChange={handleGalleryUpload}
                  className="hidden"
                />
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    onClick={() =>
                      document.getElementById("galleryUpload").click()
                    }
                    disabled={uploadingGallery}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Choose Image
                  </Button>
                  {galleryFormData.imageUrl && (
                    <div className="flex items-center space-x-2">
                      <Image
                        src={galleryFormData.imageUrl}
                        alt="Preview"
                        width={40}
                        height={40}
                        className="w-10 h-10 object-cover rounded"
                      />
                      <span className="text-sm text-green-600">
                        Image uploaded
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={galleryFormData.title}
                  onChange={(e) =>
                    setGalleryFormData((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={galleryFormData.category}
                  onChange={(e) =>
                    setGalleryFormData((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="hotel-exterior">Hotel Exterior</option>
                  <option value="hotel-interior">Hotel Interior</option>
                  <option value="rooms">Rooms</option>
                  <option value="restaurant">Restaurant</option>
                  <option value="facilities">Facilities</option>
                  <option value="events">Events</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alt Text *
                </label>
                <input
                  type="text"
                  value={galleryFormData.altText}
                  onChange={(e) =>
                    setGalleryFormData((prev) => ({
                      ...prev,
                      altText: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={galleryFormData.description}
                  onChange={(e) =>
                    setGalleryFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2 flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={galleryFormData.isFeatured}
                    onChange={(e) =>
                      setGalleryFormData((prev) => ({
                        ...prev,
                        isFeatured: e.target.checked,
                      }))
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Featured</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={galleryFormData.isPublic}
                    onChange={(e) =>
                      setGalleryFormData((prev) => ({
                        ...prev,
                        isPublic: e.target.checked,
                      }))
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Public</span>
                </label>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-4">
              {editingGalleryItem && (
                <Button
                  type="button"
                  onClick={resetGalleryForm}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700"
                >
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                disabled={loadingGallery || !galleryFormData.imageUrl}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
              >
                {loadingGallery ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {editingGalleryItem ? "Update" : "Add"} Image
              </Button>
            </div>
          </form>

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
              <option value="facilities">Facilities</option>
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
                          onClick={() => handleGalleryEdit(item)}
                          className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
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
                  onClick={() =>
                    document.getElementById("galleryUpload").click()
                  }
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
    </AdminLayout>
  );
}
