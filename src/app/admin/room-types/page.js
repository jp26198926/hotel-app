"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Eye,
  EyeOff,
  Save,
  X,
  Upload,
  Star,
  Home,
  Users,
  DollarSign,
  Bed,
  Wifi,
  Tv,
  Car,
  Coffee,
  Waves,
  MapPin,
  Mountain,
  Utensils,
  Image as ImageIcon,
} from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

const AMENITY_ICONS = {
  wifi: Wifi,
  tv: Tv,
  ac: "AC",
  minibar: "🍷",
  balcony: "🌅",
  seaView: Waves,
  cityView: MapPin,
  kitchenette: Utensils,
  jacuzzi: "🛁",
  fireplace: "🔥",
  breakfast: "🍳",
  gymAccess: "🏋️",
  parking: Car,
  roomService: "🛎️",
  laundry: "👕",
  safe: "🔒",
  hairdryer: "💨",
  bathrobes: "👘",
  slippers: "🥿",
  toiletries: "🧴",
  workDesk: "💻",
  ironingBoard: "👔",
  coffeemaker: Coffee,
  telephone: "📞",
};

const AMENITY_LABELS = {
  wifi: "Wi-Fi",
  tv: "Television",
  ac: "Air Conditioning",
  minibar: "Mini Bar",
  balcony: "Balcony",
  seaView: "Sea View",
  cityView: "City View",
  kitchenette: "Kitchenette",
  jacuzzi: "Jacuzzi",
  fireplace: "Fireplace",
  breakfast: "Breakfast Included",
  gymAccess: "Gym Access",
  parking: "Parking",
  roomService: "Room Service",
  laundry: "Laundry Service",
  safe: "Safe",
  hairdryer: "Hair Dryer",
  bathrobes: "Bathrobes",
  slippers: "Slippers",
  toiletries: "Toiletries",
  workDesk: "Work Desk",
  ironingBoard: "Ironing Board",
  coffeemaker: "Coffee Maker",
  telephone: "Telephone",
};

export default function RoomTypesPage() {
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterActive, setFilterActive] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingRoomType, setEditingRoomType] = useState(null);
  const [deleteRoomType, setDeleteRoomType] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    shortDescription: "",
    pricing: {
      basePrice: "",
      weekendPrice: "",
      holidayPrice: "",
      currency: "PGK",
    },
    capacity: {
      adults: "",
      children: "",
      maxGuests: "",
    },
    bedConfiguration: {
      bedType: "queen",
      bedCount: 1,
      sofa: false,
    },
    roomSize: "",
    amenities: [],
    images: [],
    inclusions: [],
    features: [],
    policies: {
      smoking: "notAllowed",
      pets: "notAllowed",
      extraBed: {
        available: false,
        cost: 0,
      },
    },
    availability: {
      totalRooms: "",
      maintenanceRooms: 0,
    },
    isActive: true,
    sortOrder: 0,
  });

  const [newImage, setNewImage] = useState({
    url: "",
    alt: "",
    isPrimary: false,
    caption: "",
  });

  // Fetch room types
  const fetchRoomTypes = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/room-types");
      const data = await response.json();

      if (data.success) {
        setRoomTypes(data.data);
      } else {
        toast.error("Failed to fetch room types");
      }
    } catch (error) {
      console.error("Error fetching room types:", error);
      toast.error("Error fetching room types");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomTypes();
  }, []);

  // Filter room types
  const filteredRoomTypes = roomTypes.filter((roomType) => {
    const matchesSearch =
      roomType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      roomType.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterActive === "all" ||
      (filterActive === "active" && roomType.isActive) ||
      (filterActive === "inactive" && !roomType.isActive);
    return matchesSearch && matchesFilter;
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === "checkbox" ? checked : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  // Handle nested object changes
  const handleNestedChange = (parent, child, value) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [child]: value,
      },
    }));
  };

  // Handle array changes
  const handleArrayChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle amenity toggle
  const handleAmenityToggle = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  // Handle image management
  const addImage = () => {
    if (newImage.url && newImage.alt) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, { ...newImage }],
      }));
      setNewImage({ url: "", alt: "", isPrimary: false, caption: "" });
    }
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const setPrimaryImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.map((img, i) => ({
        ...img,
        isPrimary: i === index,
      })),
    }));
  };

  // Handle list item management
  const addListItem = (field, value) => {
    if (value.trim()) {
      setFormData((prev) => ({
        ...prev,
        [field]: [...prev[field], value.trim()],
      }));
    }
  };

  const removeListItem = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  // Open modal for add/edit
  const openModal = (roomType = null) => {
    if (roomType) {
      setEditingRoomType(roomType);
      setFormData({
        ...roomType,
        pricing: roomType.pricing || {
          basePrice: "",
          weekendPrice: "",
          holidayPrice: "",
          currency: "PGK",
        },
        capacity: roomType.capacity || {
          adults: "",
          children: "",
          maxGuests: "",
        },
        bedConfiguration: roomType.bedConfiguration || {
          bedType: "queen",
          bedCount: 1,
          sofa: false,
        },
        policies: roomType.policies || {
          smoking: "notAllowed",
          pets: "notAllowed",
          extraBed: {
            available: false,
            cost: 0,
          },
        },
        availability: roomType.availability || {
          totalRooms: "",
          maintenanceRooms: 0,
        },
        amenities: roomType.amenities || [],
        images: roomType.images || [],
        inclusions: roomType.inclusions || [],
        features: roomType.features || [],
      });
    } else {
      setEditingRoomType(null);
      setFormData({
        name: "",
        slug: "",
        description: "",
        shortDescription: "",
        pricing: {
          basePrice: "",
          weekendPrice: "",
          holidayPrice: "",
          currency: "PGK",
        },
        capacity: {
          adults: "",
          children: "",
          maxGuests: "",
        },
        bedConfiguration: {
          bedType: "queen",
          bedCount: 1,
          sofa: false,
        },
        roomSize: "",
        amenities: [],
        images: [],
        inclusions: [],
        features: [],
        policies: {
          smoking: "notAllowed",
          pets: "notAllowed",
          extraBed: {
            available: false,
            cost: 0,
          },
        },
        availability: {
          totalRooms: "",
          maintenanceRooms: 0,
        },
        isActive: true,
        sortOrder: 0,
      });
    }
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setEditingRoomType(null);
    setNewImage({ url: "", alt: "", isPrimary: false, caption: "" });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = editingRoomType
        ? `/api/admin/room-types?id=${editingRoomType._id}`
        : "/api/admin/room-types";

      const method = editingRoomType ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(
          editingRoomType
            ? "Room type updated successfully"
            : "Room type created successfully"
        );
        closeModal();
        fetchRoomTypes();
      } else {
        toast.error(data.error || "Failed to save room type");
      }
    } catch (error) {
      console.error("Error saving room type:", error);
      toast.error("Error saving room type");
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deleteRoomType) return;

    try {
      const response = await fetch(
        `/api/admin/room-types?id=${deleteRoomType._id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success("Room type deleted successfully");
        setShowDeleteModal(false);
        setDeleteRoomType(null);
        fetchRoomTypes();
      } else {
        toast.error(data.error || "Failed to delete room type");
      }
    } catch (error) {
      console.error("Error deleting room type:", error);
      toast.error("Error deleting room type");
    }
  };

  // Open delete modal
  const openDeleteModal = (roomType) => {
    setDeleteRoomType(roomType);
    setShowDeleteModal(true);
  };

  // Auto-generate slug from name
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  };

  // Handle name change to auto-generate slug
  const handleNameChange = (e) => {
    const name = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name,
      slug: generateSlug(name),
    }));
  };

  return (
    <AdminLayout>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Room Types
              </h1>
              <p className="text-sm text-gray-600">
                Manage hotel room types and configurations
              </p>
            </div>
            <button
              onClick={() => openModal()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Room Type
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search room types..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              value={filterActive}
              onChange={(e) => setFilterActive(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Room Types List */}
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading room types...</p>
            </div>
          ) : filteredRoomTypes.length === 0 ? (
            <div className="text-center py-8">
              <Home className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No room types found
              </h3>
              <p className="text-gray-600">
                {searchTerm || filterActive !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "Get started by adding your first room type."}
              </p>
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredRoomTypes.map((roomType) => {
                const primaryImage =
                  roomType.images?.find((img) => img.isPrimary) ||
                  roomType.images?.[0];

                return (
                  <div
                    key={roomType._id}
                    className="border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col lg:flex-row">
                      {/* Room Image */}
                      <div className="lg:w-80 h-48 lg:h-auto relative bg-gray-100 rounded-t-lg lg:rounded-l-lg lg:rounded-t-none overflow-hidden">
                        {primaryImage ? (
                          <Image
                            src={primaryImage.url}
                            alt={primaryImage.alt || roomType.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 320px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <ImageIcon className="w-16 h-16 text-gray-400" />
                          </div>
                        )}

                        {/* Room Type Badge */}
                        <div className="absolute top-3 left-3">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              roomType.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {roomType.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>

                      {/* Room Details */}
                      <div className="flex-1 p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {roomType.name}
                              </h3>
                            </div>
                            <p className="text-gray-600 mb-3 line-clamp-2">
                              {roomType.description}
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                              <div className="flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-600">
                                  {roomType.pricing?.currency || "PGK"}{" "}
                                  {roomType.pricing?.basePrice || "N/A"}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-600">
                                  {roomType.capacity?.maxGuests || "N/A"} guests
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Bed className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-600">
                                  {roomType.bedConfiguration?.bedCount || 1}{" "}
                                  {roomType.bedConfiguration?.bedType || "bed"}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Home className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-600">
                                  {roomType.roomSize || "N/A"} sq ft
                                </span>
                              </div>
                            </div>

                            {roomType.amenities &&
                              roomType.amenities.length > 0 && (
                                <div className="mb-3">
                                  <div className="flex flex-wrap gap-2">
                                    {roomType.amenities
                                      .slice(0, 6)
                                      .map((amenity) => (
                                        <span
                                          key={amenity}
                                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                                        >
                                          {AMENITY_LABELS[amenity] || amenity}
                                        </span>
                                      ))}
                                    {roomType.amenities.length > 6 && (
                                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                                        +{roomType.amenities.length - 6} more
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}

                            {/* Room availability */}
                            <div className="text-sm text-gray-500">
                              <span className="font-medium">Available:</span>{" "}
                              {(roomType.availability?.totalRooms || 0) -
                                (roomType.availability?.maintenanceRooms ||
                                  0)}{" "}
                              of {roomType.availability?.totalRooms || 0} rooms
                            </div>
                          </div>

                          <div className="flex items-center gap-2 ml-4">
                            <button
                              onClick={() => openModal(roomType)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => openDeleteModal(roomType)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingRoomType ? "Edit Room Type" : "Add New Room Type"}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Room Type Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleNameChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug *
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short Description
                </label>
                <textarea
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>

              {/* Pricing */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Pricing Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Base Price *
                    </label>
                    <input
                      type="number"
                      name="pricing.basePrice"
                      value={formData.pricing.basePrice}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Weekend Price
                    </label>
                    <input
                      type="number"
                      name="pricing.weekendPrice"
                      value={formData.pricing.weekendPrice}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Holiday Price
                    </label>
                    <input
                      type="number"
                      name="pricing.holidayPrice"
                      value={formData.pricing.holidayPrice}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>

              {/* Capacity */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Capacity
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adults *
                    </label>
                    <input
                      type="number"
                      name="capacity.adults"
                      value={formData.capacity.adults}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      min="1"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Children
                    </label>
                    <input
                      type="number"
                      name="capacity.children"
                      value={formData.capacity.children}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Guests *
                    </label>
                    <input
                      type="number"
                      name="capacity.maxGuests"
                      value={formData.capacity.maxGuests}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      min="1"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Bed Configuration */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Bed Configuration
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bed Type *
                    </label>
                    <select
                      name="bedConfiguration.bedType"
                      value={formData.bedConfiguration.bedType}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      required
                    >
                      <option value="single">Single</option>
                      <option value="double">Double</option>
                      <option value="queen">Queen</option>
                      <option value="king">King</option>
                      <option value="twin">Twin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bed Count *
                    </label>
                    <input
                      type="number"
                      name="bedConfiguration.bedCount"
                      value={formData.bedConfiguration.bedCount}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      min="1"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Room Size (sq ft) *
                    </label>
                    <input
                      type="number"
                      name="roomSize"
                      value={formData.roomSize}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      min="1"
                      required
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="bedConfiguration.sofa"
                      checked={formData.bedConfiguration.sofa}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">
                      Includes sofa bed
                    </span>
                  </label>
                </div>
              </div>

              {/* Amenities */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Amenities
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {Object.entries(AMENITY_LABELS).map(([key, label]) => (
                    <label key={key} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.amenities.includes(key)}
                        onChange={() => handleAmenityToggle(key)}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Availability
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Rooms *
                    </label>
                    <input
                      type="number"
                      name="availability.totalRooms"
                      value={formData.availability.totalRooms}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      min="0"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maintenance Rooms
                    </label>
                    <input
                      type="number"
                      name="availability.maintenanceRooms"
                      value={formData.availability.maintenanceRooms}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              {/* Images Management */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Room Images
                </h3>

                {/* Existing Images */}
                {formData.images.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Current Images
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {formData.images.map((image, index) => (
                        <div
                          key={index}
                          className="relative border border-gray-200 rounded-lg overflow-hidden"
                        >
                          <div className="aspect-video relative">
                            <Image
                              src={image.url}
                              alt={image.alt}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, 50vw"
                            />
                          </div>
                          <div className="p-3">
                            <p className="text-sm font-medium text-gray-900 mb-1">
                              {image.alt}
                            </p>
                            {image.caption && (
                              <p className="text-xs text-gray-600 mb-2">
                                {image.caption}
                              </p>
                            )}
                            <div className="flex items-center justify-between">
                              <label className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={image.isPrimary}
                                  onChange={() => setPrimaryImage(index)}
                                  className="mr-2"
                                />
                                <span className="text-xs text-gray-700">
                                  Primary
                                </span>
                              </label>
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="text-red-600 hover:text-red-800 text-xs"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add New Image */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    Add New Image
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Image URL
                      </label>
                      <input
                        type="url"
                        value={newImage.url}
                        onChange={(e) =>
                          setNewImage((prev) => ({
                            ...prev,
                            url: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Alt Text
                      </label>
                      <input
                        type="text"
                        value={newImage.alt}
                        onChange={(e) =>
                          setNewImage((prev) => ({
                            ...prev,
                            alt: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        placeholder="Room description"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Caption (optional)
                      </label>
                      <input
                        type="text"
                        value={newImage.caption}
                        onChange={(e) =>
                          setNewImage((prev) => ({
                            ...prev,
                            caption: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        placeholder="Image caption"
                      />
                    </div>
                    <div className="flex items-center">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newImage.isPrimary}
                          onChange={(e) =>
                            setNewImage((prev) => ({
                              ...prev,
                              isPrimary: e.target.checked,
                            }))
                          }
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">
                          Set as primary image
                        </span>
                      </label>
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={addImage}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        Add Image
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Settings */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Settings
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sort Order
                    </label>
                    <input
                      type="number"
                      name="sortOrder"
                      value={formData.sortOrder}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div className="flex items-center pt-8">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Active</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {editingRoomType ? "Update" : "Create"} Room Type
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Delete Room Type
              </h3>
            </div>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete{" "}
              <strong>{deleteRoomType?.name}</strong>? This action cannot be
              undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
