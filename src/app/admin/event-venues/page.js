"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Edit,
  Upload,
  Save,
  RefreshCw,
  X,
  Eye,
  EyeOff,
  Star,
  MapPin,
  Users,
  Calendar,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui";
import { useToast } from "@/components/Toast";
import AdminLayout from "@/components/admin/AdminLayout";
import Image from "next/image";

export default function EventVenuesPage() {
  const { showError, showSuccess } = useToast();

  // State
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVenue, setEditingVenue] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Delete confirmation modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [venueToDelete, setVenueToDelete] = useState(null);
  const [deletingVenue, setDeletingVenue] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    name: "",
    subtitle: "",
    description: "",
    imageUrl: "",
    capacity: "",
    features: [""],
    buttonText: "Book Event Space",
    buttonColor: "red",
    displayOrder: 0,
    isActive: true,
    isFeatured: false,
    category: "other",
    pricing: {
      halfDay: "",
      fullDay: "",
      hourly: "",
    },
    amenities: {
      audioVisual: false,
      wifi: true,
      catering: false,
      parking: true,
      airConditioning: true,
      projector: false,
    },
    contactInfo: {
      email: "",
      phone: "",
    },
  });

  // Fetch venues
  const fetchVenues = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/event-venues");
      const data = await response.json();
      if (data.success) {
        setVenues(data.venues || []);
      } else {
        showError(data.error || "Failed to fetch venues");
      }
    } catch (error) {
      console.error("Error fetching venues:", error);
      showError("Error fetching venues");
    } finally {
      setLoading(false);
    }
  };

  // Load venues on component mount
  useEffect(() => {
    fetchVenues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);
      formDataUpload.append("type", "gallery");

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formDataUpload,
      });

      const data = await response.json();
      if (data.success) {
        setFormData((prev) => ({ ...prev, imageUrl: data.fileUrl }));
        showSuccess("Image uploaded successfully!");
      } else {
        showError(data.error || "Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      showError("Error uploading image");
    } finally {
      setUploadingImage(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.description ||
      !formData.imageUrl ||
      !formData.capacity
    ) {
      showError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const method = editingVenue ? "PUT" : "POST";
      const body = editingVenue
        ? { ...formData, id: editingVenue._id }
        : formData;

      const response = await fetch("/api/admin/event-venues", {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (data.success) {
        showSuccess(
          `Venue ${editingVenue ? "updated" : "created"} successfully!`
        );
        fetchVenues();
        resetForm();
        setIsModalOpen(false);
      } else {
        showError(
          data.error || `Failed to ${editingVenue ? "update" : "create"} venue`
        );
      }
    } catch (error) {
      console.error("Error saving venue:", error);
      showError("Error saving venue");
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      subtitle: "",
      description: "",
      imageUrl: "",
      capacity: "",
      features: [""],
      buttonText: "Book Event Space",
      buttonColor: "red",
      displayOrder: 0,
      isActive: true,
      isFeatured: false,
      category: "other",
      pricing: {
        halfDay: "",
        fullDay: "",
        hourly: "",
      },
      amenities: {
        audioVisual: false,
        wifi: true,
        catering: false,
        parking: true,
        airConditioning: true,
        projector: false,
      },
      contactInfo: {
        email: "",
        phone: "",
      },
    });
    setEditingVenue(null);
  };

  // Handle edit
  const handleEdit = (venue) => {
    setEditingVenue(venue);
    setFormData({
      ...venue,
      features: venue.features || [""],
      pricing: venue.pricing || { halfDay: "", fullDay: "", hourly: "" },
      amenities: venue.amenities || {
        audioVisual: false,
        wifi: true,
        catering: false,
        parking: true,
        airConditioning: true,
        projector: false,
      },
      contactInfo: venue.contactInfo || { email: "", phone: "" },
    });
    setIsModalOpen(true);
  };

  // Handle delete
  const handleDelete = (venue) => {
    setVenueToDelete(venue);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!venueToDelete) return;

    setDeletingVenue(true);
    try {
      const response = await fetch(
        `/api/admin/event-venues?id=${venueToDelete._id}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();
      if (data.success) {
        showSuccess("Venue deleted successfully!");
        fetchVenues();
        setIsDeleteModalOpen(false);
        setVenueToDelete(null);
      } else {
        showError(data.error || "Failed to delete venue");
      }
    } catch (error) {
      console.error("Error deleting venue:", error);
      showError("Error deleting venue");
    } finally {
      setDeletingVenue(false);
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setVenueToDelete(null);
  };

  // Handle feature changes
  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData((prev) => ({ ...prev, features: newFeatures }));
  };

  const addFeature = () => {
    setFormData((prev) => ({ ...prev, features: [...prev.features, ""] }));
  };

  const removeFeature = (index) => {
    if (formData.features.length > 1) {
      const newFeatures = formData.features.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, features: newFeatures }));
    }
  };

  return (
    <AdminLayout>
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Event Venues Management
            </h3>
            <Button
              onClick={() => {
                resetForm();
                setIsModalOpen(true);
              }}
              className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Venue
            </Button>
          </div>

          {/* Venues List */}
          {loading && venues.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-6 w-6 animate-spin text-gray-500" />
              <span className="ml-2 text-gray-500">Loading venues...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {venues.map((venue) => (
                <div
                  key={venue._id}
                  className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="relative h-48">
                    <Image
                      src={venue.imageUrl}
                      alt={venue.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2 right-2 flex space-x-1">
                      {venue.isFeatured && (
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                          <Star className="w-3 h-3 inline mr-1" />
                          Featured
                        </span>
                      )}
                      {!venue.isActive && (
                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                          Inactive
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900 truncate">
                        {venue.name}
                      </h4>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleEdit(venue)}
                          className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(venue)}
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <Users className="w-4 h-4 mr-1" />
                      {venue.capacity}
                    </div>

                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {venue.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          venue.category === "ballroom"
                            ? "bg-purple-100 text-purple-800"
                            : venue.category === "conference"
                            ? "bg-blue-100 text-blue-800"
                            : venue.category === "meeting"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {venue.category}
                      </span>
                      <span className="text-xs text-gray-500">
                        Order: {venue.displayOrder}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && venues.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No event venues
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating your first event venue.
              </p>
              <div className="mt-6">
                <Button
                  onClick={() => {
                    resetForm();
                    setIsModalOpen(true);
                  }}
                  className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Venue
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingVenue ? "Edit Venue" : "Add New Venue"}
                </h3>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Venue Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subtitle
                    </label>
                    <input
                      type="text"
                      value={formData.subtitle}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          subtitle: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Capacity *
                    </label>
                    <input
                      type="text"
                      value={formData.capacity}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          capacity: e.target.value,
                        }))
                      }
                      placeholder="e.g., 300 guests"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          category: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="ballroom">Ballroom</option>
                      <option value="conference">Conference</option>
                      <option value="meeting">Meeting</option>
                      <option value="banquet">Banquet</option>
                      <option value="outdoor">Outdoor</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Venue Image *
                  </label>
                  <input
                    type="file"
                    id="venueImageUpload"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <div className="flex items-center space-x-4">
                    <Button
                      type="button"
                      onClick={() =>
                        document.getElementById("venueImageUpload").click()
                      }
                      disabled={uploadingImage}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Choose Image
                    </Button>
                    {formData.imageUrl && (
                      <div className="flex items-center space-x-2">
                        <Image
                          src={formData.imageUrl}
                          alt="Preview"
                          width={60}
                          height={60}
                          className="w-15 h-15 object-cover rounded"
                        />
                        <span className="text-sm text-green-600">
                          Image uploaded
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Features
                  </label>
                  {formData.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 mb-2"
                    >
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) =>
                          handleFeatureChange(index, e.target.value)
                        }
                        placeholder="Enter feature"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {formData.features.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="p-2 text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    onClick={addFeature}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Feature
                  </Button>
                </div>

                {/* Button Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Button Text
                    </label>
                    <input
                      type="text"
                      value={formData.buttonText}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          buttonText: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Button Color
                    </label>
                    <select
                      value={formData.buttonColor}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          buttonColor: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="red">Red</option>
                      <option value="orange">Orange</option>
                      <option value="blue">Blue</option>
                      <option value="green">Green</option>
                      <option value="purple">Purple</option>
                      <option value="indigo">Indigo</option>
                    </select>
                  </div>
                </div>

                {/* Settings */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Display Order
                    </label>
                    <input
                      type="number"
                      value={formData.displayOrder}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          displayOrder: parseInt(e.target.value) || 0,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="flex items-center">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            isActive: e.target.checked,
                          }))
                        }
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                      />
                      <span className="text-sm text-gray-700">Active</span>
                    </label>
                  </div>

                  <div className="flex items-center">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isFeatured}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            isFeatured: e.target.checked,
                          }))
                        }
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                      />
                      <span className="text-sm text-gray-700">Featured</span>
                    </label>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
                  <Button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      resetForm();
                    }}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      loading ||
                      !formData.name ||
                      !formData.description ||
                      !formData.imageUrl ||
                      !formData.capacity
                    }
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                  >
                    {loading ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    {editingVenue ? "Update" : "Create"} Venue
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && venueToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Delete Event Venue
                  </h3>
                  <p className="text-sm text-gray-500">
                    This action cannot be undone
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-gray-700">
                  Are you sure you want to delete &ldquo;
                  <span className="font-medium">{venueToDelete.name}</span>
                  &rdquo;?
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  This will permanently remove the venue from your website.
                </p>
              </div>

              <div className="flex items-center justify-end space-x-3">
                <Button
                  onClick={cancelDelete}
                  disabled={deletingVenue}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700"
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmDelete}
                  disabled={deletingVenue}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {deletingVenue ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
