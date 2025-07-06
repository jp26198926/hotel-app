"use client";

import { useState, useEffect, useCallback } from "react";
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
  Hotel,
  Users,
  DollarSign,
  Bed,
  MapPin,
  Wrench,
  CheckCircle,
  AlertCircle,
  Clock,
  Building,
  Home,
  Waves,
  Mountain,
  TreePine,
  Calendar,
  User,
  Key,
  Accessibility,
} from "lucide-react";
import { useToast } from "@/components/Toast";

const STATUS_COLORS = {
  available: "bg-green-100 text-green-800",
  occupied: "bg-red-100 text-red-800",
  maintenance: "bg-yellow-100 text-yellow-800",
  cleaning: "bg-blue-100 text-blue-800",
  reserved: "bg-purple-100 text-purple-800",
  outOfOrder: "bg-gray-100 text-gray-800",
};

const CLEANING_STATUS_COLORS = {
  clean: "bg-green-100 text-green-800",
  dirty: "bg-red-100 text-red-800",
  inspected: "bg-blue-100 text-blue-800",
  outOfOrder: "bg-gray-100 text-gray-800",
};

const VIEW_TYPES = {
  sea: { label: "Sea View", icon: Waves },
  city: { label: "City View", icon: Building },
  garden: { label: "Garden View", icon: TreePine },
  pool: { label: "Pool View", icon: Waves },
  mountain: { label: "Mountain View", icon: Mountain },
  courtyard: { label: "Courtyard View", icon: Home },
};

const WING_OPTIONS = [
  { value: "north", label: "North Wing" },
  { value: "south", label: "South Wing" },
  { value: "east", label: "East Wing" },
  { value: "west", label: "West Wing" },
  { value: "central", label: "Central Wing" },
];

const ACCESSIBILITY_FEATURES = [
  { value: "wheelchair", label: "Wheelchair Accessible" },
  { value: "hearing", label: "Hearing Assistance" },
  { value: "visual", label: "Visual Assistance" },
  { value: "mobility", label: "Mobility Assistance" },
  { value: "bathroom", label: "Accessible Bathroom" },
  { value: "elevator", label: "Elevator Access" },
];

export default function RoomsPage() {
  const { showSuccess, showError } = useToast();
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterFloor, setFilterFloor] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [deleteRoom, setDeleteRoom] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    roomNumber: "",
    roomType: "",
    floor: "",
    wing: "",
    status: "available",
    housekeeping: {
      cleaningStatus: "clean",
      cleaningNotes: "",
    },
    maintenance: {
      maintenanceNotes: "",
      nextMaintenanceDate: "",
    },
    features: {
      view: "",
      balcony: false,
      connecting: false,
    },
    accessibilityFeatures: [],
    keyCardNumbers: [],
    notes: "",
  });

  const reloadRooms = useCallback(async () => {
    try {
      const response = await fetch("/api/rooms");
      const data = await response.json();
      if (data.success) {
        setRooms(data.data);
      } else {
        console.error("Failed to fetch rooms:", data.error);
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadRooms = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/rooms");
        const data = await response.json();
        if (isMounted && data.success) {
          setRooms(data.data);
        } else if (isMounted) {
          console.error("Failed to fetch rooms:", data.error);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error fetching rooms:", error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    const loadRoomTypes = async () => {
      try {
        const response = await fetch("/api/room-types");
        const data = await response.json();
        if (isMounted && data.success) {
          setRoomTypes(data.data);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error fetching room types:", error);
        }
      }
    };

    loadRooms();
    loadRoomTypes();

    return () => {
      isMounted = false;
    };
  }, []);

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

  const handleAccessibilityChange = (feature) => {
    setFormData((prev) => ({
      ...prev,
      accessibilityFeatures: prev.accessibilityFeatures.includes(feature)
        ? prev.accessibilityFeatures.filter((f) => f !== feature)
        : [...prev.accessibilityFeatures, feature],
    }));
  };

  const handleKeyCardChange = (index, value) => {
    setFormData((prev) => ({
      ...prev,
      keyCardNumbers: prev.keyCardNumbers.map((card, i) =>
        i === index ? value : card
      ),
    }));
  };

  const addKeyCard = () => {
    setFormData((prev) => ({
      ...prev,
      keyCardNumbers: [...prev.keyCardNumbers, ""],
    }));
  };

  const removeKeyCard = (index) => {
    setFormData((prev) => ({
      ...prev,
      keyCardNumbers: prev.keyCardNumbers.filter((_, i) => i !== index),
    }));
  };

  const openModal = (room = null) => {
    if (room) {
      setEditingRoom(room);
      setFormData({
        roomNumber: room.roomNumber || "",
        roomType: room.roomType?._id || room.roomType || "",
        floor: room.floor || "",
        wing: room.wing || "",
        status: room.status || "available",
        housekeeping: {
          cleaningStatus: room.housekeeping?.cleaningStatus || "clean",
          cleaningNotes: room.housekeeping?.cleaningNotes || "",
        },
        maintenance: {
          maintenanceNotes: room.maintenance?.maintenanceNotes || "",
          nextMaintenanceDate: room.maintenance?.nextMaintenanceDate
            ? new Date(room.maintenance.nextMaintenanceDate)
                .toISOString()
                .split("T")[0]
            : "",
        },
        features: {
          view: room.features?.view || "",
          balcony: room.features?.balcony || false,
          connecting: room.features?.connecting || false,
        },
        accessibilityFeatures: room.accessibilityFeatures || [],
        keyCardNumbers: room.keyCardNumbers || [],
        notes: room.notes || "",
      });
    } else {
      setEditingRoom(null);
      setFormData({
        roomNumber: "",
        roomType: "",
        floor: "",
        wing: "",
        status: "available",
        housekeeping: {
          cleaningStatus: "clean",
          cleaningNotes: "",
        },
        maintenance: {
          maintenanceNotes: "",
          nextMaintenanceDate: "",
        },
        features: {
          view: "",
          balcony: false,
          connecting: false,
        },
        accessibilityFeatures: [],
        keyCardNumbers: [],
        notes: "",
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingRoom(null);
    setSubmitting(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = editingRoom ? `/api/rooms/${editingRoom._id}` : "/api/rooms";
      const method = editingRoom ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        showSuccess(
          `Room ${editingRoom ? "updated" : "created"} successfully!`
        );
        closeModal();
        reloadRooms();
      } else {
        showError(
          data.error || `Failed to ${editingRoom ? "update" : "create"} room`
        );
      }
    } catch (error) {
      showError("An error occurred while saving the room");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteRoom) return;

    try {
      const response = await fetch(`/api/rooms/${deleteRoom._id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        showSuccess("Room deleted successfully!");
        setShowDeleteModal(false);
        setDeleteRoom(null);
        reloadRooms();
      } else {
        showError(data.error || "Failed to delete room");
      }
    } catch (error) {
      showError("An error occurred while deleting the room");
    }
  };

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch =
      room.roomNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.roomType?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.wing?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || room.status === filterStatus;
    const matchesFloor =
      filterFloor === "all" || room.floor.toString() === filterFloor;

    return matchesSearch && matchesStatus && matchesFloor;
  });

  const getUniqueFloors = () => {
    const floors = [...new Set(rooms.map((room) => room.floor))].sort(
      (a, b) => a - b
    );
    return floors;
  };

  const getRoomTypeById = (id) => {
    return roomTypes.find((type) => type._id === id);
  };

  return (
    <AdminLayout>
      <div className="bg-white rounded-xl shadow-sm">
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3"></div>
            <button
              onClick={() => openModal()}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-700 to-orange-600 text-white rounded-lg hover:from-red-800 hover:to-orange-700 transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Room</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search rooms..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
                <option value="maintenance">Maintenance</option>
                <option value="cleaning">Cleaning</option>
                <option value="reserved">Reserved</option>
                <option value="outOfOrder">Out of Order</option>
              </select>
              <select
                value={filterFloor}
                onChange={(e) => setFilterFloor(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="all">All Floors</option>
                {getUniqueFloors().map((floor) => (
                  <option key={floor} value={floor}>
                    Floor {floor}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            </div>
          ) : filteredRooms.length > 0 ? (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Room
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Floor & Wing
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Features
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredRooms.map((room) => (
                      <tr key={room._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
                                <Hotel className="h-5 w-5 text-red-600" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                Room {room.roomNumber}
                              </div>
                              <div className="text-sm text-gray-500">
                                {room.keyCardNumbers?.length > 0 && (
                                  <span className="inline-flex items-center gap-1">
                                    <Key className="w-3 h-3" />
                                    {room.keyCardNumbers.length} card
                                    {room.keyCardNumbers.length > 1 ? "s" : ""}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {room.roomType?.name || "Unknown"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {room.roomType?.pricing?.basePrice && (
                              <span className="inline-flex items-center gap-1">
                                <DollarSign className="w-3 h-3" />
                                {room.roomType.pricing.basePrice}/night
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            Floor {room.floor}
                          </div>
                          <div className="text-sm text-gray-500">
                            {room.wing &&
                              `${
                                room.wing.charAt(0).toUpperCase() +
                                room.wing.slice(1)
                              } Wing`}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="space-y-1">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                STATUS_COLORS[room.status]
                              }`}
                            >
                              {room.status.charAt(0).toUpperCase() +
                                room.status.slice(1)}
                            </span>
                            {room.housekeeping?.cleaningStatus && (
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  CLEANING_STATUS_COLORS[
                                    room.housekeeping.cleaningStatus
                                  ]
                                }`}
                              >
                                {room.housekeeping.cleaningStatus
                                  .charAt(0)
                                  .toUpperCase() +
                                  room.housekeeping.cleaningStatus.slice(1)}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            {room.features?.view &&
                              VIEW_TYPES[room.features.view] && (
                                <div className="flex items-center text-xs text-gray-500">
                                  {React.createElement(
                                    VIEW_TYPES[room.features.view].icon,
                                    { className: "w-3 h-3" }
                                  )}
                                </div>
                              )}
                            {room.features?.balcony && (
                              <div className="text-xs text-gray-500">🌅</div>
                            )}
                            {room.accessibilityFeatures?.length > 0 && (
                              <Accessibility className="w-3 h-3 text-blue-500" />
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => openModal(room)}
                              className="text-blue-600 hover:text-blue-900 transition-colors"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                setDeleteRoom(room);
                                setShowDeleteModal(true);
                              }}
                              className="text-red-600 hover:text-red-900 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden space-y-4">
                {filteredRooms.map((room) => (
                  <div
                    key={room._id}
                    className="bg-white border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="bg-red-100 p-2 rounded-lg">
                          <Hotel className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            Room {room.roomNumber}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {room.roomType?.name || "Unknown"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => openModal(room)}
                          className="p-2 text-blue-600 hover:text-blue-900 transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            setDeleteRoom(room);
                            setShowDeleteModal(true);
                          }}
                          className="p-2 text-red-600 hover:text-red-900 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-gray-700 font-medium">
                          Floor & Wing
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          Floor {room.floor}
                          {room.wing &&
                            ` • ${
                              room.wing.charAt(0).toUpperCase() +
                              room.wing.slice(1)
                            }`}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-700 font-medium">
                          Price
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {room.roomType?.pricing?.basePrice
                            ? `$${room.roomType.pricing.basePrice}/night`
                            : "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            STATUS_COLORS[room.status]
                          }`}
                        >
                          {room.status.charAt(0).toUpperCase() +
                            room.status.slice(1)}
                        </span>
                        {room.housekeeping?.cleaningStatus && (
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              CLEANING_STATUS_COLORS[
                                room.housekeeping.cleaningStatus
                              ]
                            }`}
                          >
                            {room.housekeeping.cleaningStatus
                              .charAt(0)
                              .toUpperCase() +
                              room.housekeeping.cleaningStatus.slice(1)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-1">
                        {room.features?.view &&
                          VIEW_TYPES[room.features.view] && (
                            <div className="flex items-center text-xs text-gray-500">
                              {React.createElement(
                                VIEW_TYPES[room.features.view].icon,
                                { className: "w-3 h-3" }
                              )}
                            </div>
                          )}
                        {room.features?.balcony && (
                          <div className="text-xs text-gray-500">🌅</div>
                        )}
                        {room.accessibilityFeatures?.length > 0 && (
                          <Accessibility className="w-3 h-3 text-blue-500" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <Hotel className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No rooms found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || filterStatus !== "all" || filterFloor !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "Get started by adding your first room."}
              </p>
              {!searchTerm &&
                filterStatus === "all" &&
                filterFloor === "all" && (
                  <div className="mt-6">
                    <button
                      onClick={() => openModal()}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-700 to-orange-600 text-white rounded-lg hover:from-red-800 hover:to-orange-700 transition-all duration-200"
                    >
                      <Plus className="h-4 w-4" />
                      Add First Room
                    </button>
                  </div>
                )}
            </div>
          )}
        </div>

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingRoom ? "Edit Room" : "Add New Room"}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">
                      Basic Information
                    </h4>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Room Number *
                      </label>
                      <input
                        type="text"
                        name="roomNumber"
                        value={formData.roomNumber}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="e.g., 101"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Room Type *
                      </label>
                      <select
                        name="roomType"
                        value={formData.roomType}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select a room type</option>
                        {roomTypes.map((type) => (
                          <option key={type._id} value={type._id}>
                            {type.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Floor *
                        </label>
                        <input
                          type="number"
                          name="floor"
                          value={formData.floor}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder="1"
                          min="1"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Wing
                        </label>
                        <select
                          name="wing"
                          value={formData.wing}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        >
                          <option value="">Select wing</option>
                          {WING_OPTIONS.map((wing) => (
                            <option key={wing.value} value={wing.value}>
                              {wing.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      >
                        <option value="available">Available</option>
                        <option value="occupied">Occupied</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="cleaning">Cleaning</option>
                        <option value="reserved">Reserved</option>
                        <option value="outOfOrder">Out of Order</option>
                      </select>
                    </div>
                  </div>

                  {/* Features & Accessibility */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">
                      Features & Accessibility
                    </h4>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        View
                      </label>
                      <select
                        name="features.view"
                        value={formData.features.view}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      >
                        <option value="">Select view</option>
                        {Object.entries(VIEW_TYPES).map(([key, value]) => (
                          <option key={key} value={key}>
                            {value.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="features.balcony"
                          checked={formData.features.balcony}
                          onChange={handleInputChange}
                          className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Has Balcony
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="features.connecting"
                          checked={formData.features.connecting}
                          onChange={handleInputChange}
                          className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Connecting Room
                        </span>
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Accessibility Features
                      </label>
                      <div className="space-y-2">
                        {ACCESSIBILITY_FEATURES.map((feature) => (
                          <label
                            key={feature.value}
                            className="flex items-center"
                          >
                            <input
                              type="checkbox"
                              checked={formData.accessibilityFeatures.includes(
                                feature.value
                              )}
                              onChange={() =>
                                handleAccessibilityChange(feature.value)
                              }
                              className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                              {feature.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Housekeeping */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Housekeeping</h4>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cleaning Status
                      </label>
                      <select
                        name="housekeeping.cleaningStatus"
                        value={formData.housekeeping.cleaningStatus}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      >
                        <option value="clean">Clean</option>
                        <option value="dirty">Dirty</option>
                        <option value="inspected">Inspected</option>
                        <option value="outOfOrder">Out of Order</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cleaning Notes
                      </label>
                      <textarea
                        name="housekeeping.cleaningNotes"
                        value={formData.housekeeping.cleaningNotes}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Enter cleaning notes..."
                      />
                    </div>
                  </div>

                  {/* Maintenance */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Maintenance</h4>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Next Maintenance Date
                      </label>
                      <input
                        type="date"
                        name="maintenance.nextMaintenanceDate"
                        value={formData.maintenance.nextMaintenanceDate}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Maintenance Notes
                      </label>
                      <textarea
                        name="maintenance.maintenanceNotes"
                        value={formData.maintenance.maintenanceNotes}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Enter maintenance notes..."
                      />
                    </div>
                  </div>

                  {/* Key Cards */}
                  <div className="space-y-4 md:col-span-2">
                    <h4 className="font-medium text-gray-900">Key Cards</h4>

                    <div className="space-y-2">
                      {formData.keyCardNumbers.map((card, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={card}
                            onChange={(e) =>
                              handleKeyCardChange(index, e.target.value)
                            }
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            placeholder="Key card number"
                          />
                          <button
                            type="button"
                            onClick={() => removeKeyCard(index)}
                            className="p-2 text-red-600 hover:text-red-900 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addKeyCard}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:text-red-700 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Add Key Card
                      </button>
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="space-y-4 md:col-span-2">
                    <h4 className="font-medium text-gray-900">
                      Additional Notes
                    </h4>

                    <div>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        rows="4"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Enter any additional notes about this room..."
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-700 to-orange-600 text-white rounded-lg hover:from-red-800 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        {editingRoom ? "Updating..." : "Creating..."}
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        {editingRoom ? "Update Room" : "Create Room"}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-red-100 p-3 rounded-lg">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Delete Room
                    </h3>
                    <p className="text-sm text-gray-600">
                      This action cannot be undone
                    </p>
                  </div>
                </div>

                <p className="text-gray-700 mb-6">
                  Are you sure you want to delete Room {deleteRoom?.roomNumber}?
                  This will permanently remove the room and all its data.
                </p>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setDeleteRoom(null);
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete Room
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
