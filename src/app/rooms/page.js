"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Users,
  Wifi,
  Tv,
  AirVent,
  Coffee,
} from "lucide-react";
import { Card, Button, Input, Select, Badge, Modal } from "@/components/ui";
import { getRoomStatusColor, formatCurrency } from "@/lib/utils";

export default function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Mock data - in a real app, this would be fetched from the API
  useEffect(() => {
    const mockRooms = [
      {
        _id: "1",
        roomNumber: "101",
        type: "standard",
        category: "single",
        floor: 1,
        capacity: { adults: 2, children: 1 },
        amenities: ["wifi", "tv", "ac"],
        price: { base: 120 },
        status: "available",
        bedType: "queen",
        size: 250,
        description: "Comfortable single room with modern amenities",
      },
      {
        _id: "2",
        roomNumber: "205",
        type: "deluxe",
        category: "double",
        floor: 2,
        capacity: { adults: 4, children: 2 },
        amenities: ["wifi", "tv", "ac", "minibar", "balcony"],
        price: { base: 180 },
        status: "occupied",
        bedType: "king",
        size: 350,
        description: "Spacious deluxe room with city view",
      },
      {
        _id: "3",
        roomNumber: "312",
        type: "suite",
        category: "family",
        floor: 3,
        capacity: { adults: 6, children: 3 },
        amenities: ["wifi", "tv", "ac", "minibar", "balcony", "kitchenette"],
        price: { base: 280 },
        status: "maintenance",
        bedType: "king",
        size: 500,
        description: "Luxury family suite with separate living area",
      },
      {
        _id: "4",
        roomNumber: "108",
        type: "standard",
        category: "twin",
        floor: 1,
        capacity: { adults: 2, children: 0 },
        amenities: ["wifi", "tv", "ac"],
        price: { base: 110 },
        status: "cleaning",
        bedType: "twin",
        size: 220,
        description: "Twin bed room perfect for business travelers",
      },
    ];

    setTimeout(() => {
      setRooms(mockRooms);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch =
      room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || room.status === statusFilter;
    const matchesType = !typeFilter || room.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const getAmenityIcon = (amenity) => {
    const icons = {
      wifi: Wifi,
      tv: Tv,
      ac: AirVent,
      minibar: Coffee,
    };
    return icons[amenity] || null;
  };

  const handleViewRoom = (room) => {
    setSelectedRoom(room);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Room Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your hotel rooms, availability, and pricing.
          </p>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Room
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search rooms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
            <option value="maintenance">Maintenance</option>
            <option value="cleaning">Cleaning</option>
          </Select>
          <Select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="standard">Standard</option>
            <option value="deluxe">Deluxe</option>
            <option value="suite">Suite</option>
            <option value="presidential">Presidential</option>
          </Select>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </Button>
        </div>
      </Card>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredRooms.map((room) => (
          <Card key={room._id} className="hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Room {room.roomNumber}
                </h3>
                <p className="text-sm text-gray-500 capitalize">
                  {room.type} • Floor {room.floor}
                </p>
              </div>
              <Badge
                variant={
                  getRoomStatusColor(room.status).includes("green")
                    ? "success"
                    : getRoomStatusColor(room.status).includes("red")
                    ? "danger"
                    : getRoomStatusColor(room.status).includes("yellow")
                    ? "warning"
                    : "default"
                }
                className="capitalize"
              >
                {room.status}
              </Badge>
            </div>

            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <Users className="h-4 w-4 mr-2" />
                <span>
                  Up to {room.capacity.adults} adults, {room.capacity.children}{" "}
                  children
                </span>
              </div>

              <div className="flex items-center text-sm text-gray-600">
                <span className="font-medium">{room.size} sq ft</span>
                <span className="mx-2">•</span>
                <span className="capitalize">{room.bedType} bed</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {room.amenities.slice(0, 4).map((amenity) => {
                  const IconComponent = getAmenityIcon(amenity);
                  return (
                    <div
                      key={amenity}
                      className="flex items-center text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded"
                    >
                      {IconComponent && (
                        <IconComponent className="h-3 w-3 mr-1" />
                      )}
                      <span className="capitalize">{amenity}</span>
                    </div>
                  );
                })}
                {room.amenities.length > 4 && (
                  <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    +{room.amenities.length - 4} more
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div>
                  <span className="text-lg font-semibold text-gray-900">
                    {formatCurrency(room.price.base)}
                  </span>
                  <span className="text-sm text-gray-500">/night</span>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewRoom(room)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Room Details Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={selectedRoom ? `Room ${selectedRoom.roomNumber} Details` : ""}
        size="lg"
      >
        {selectedRoom && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Room Information
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Type:</span>
                    <span className="capitalize">{selectedRoom.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Category:</span>
                    <span className="capitalize">{selectedRoom.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Floor:</span>
                    <span>{selectedRoom.floor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Size:</span>
                    <span>{selectedRoom.size} sq ft</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Bed Type:</span>
                    <span className="capitalize">{selectedRoom.bedType}</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Capacity & Pricing
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Adults:</span>
                    <span>{selectedRoom.capacity.adults}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Children:</span>
                    <span>{selectedRoom.capacity.children}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Base Price:</span>
                    <span className="font-medium">
                      {formatCurrency(selectedRoom.price.base)}/night
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status:</span>
                    <Badge
                      variant={
                        getRoomStatusColor(selectedRoom.status).includes(
                          "green"
                        )
                          ? "success"
                          : getRoomStatusColor(selectedRoom.status).includes(
                              "red"
                            )
                          ? "danger"
                          : getRoomStatusColor(selectedRoom.status).includes(
                              "yellow"
                            )
                          ? "warning"
                          : "default"
                      }
                      className="capitalize"
                    >
                      {selectedRoom.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Description</h4>
              <p className="text-sm text-gray-600">
                {selectedRoom.description}
              </p>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Amenities</h4>
              <div className="flex flex-wrap gap-2">
                {selectedRoom.amenities.map((amenity) => {
                  const IconComponent = getAmenityIcon(amenity);
                  return (
                    <div
                      key={amenity}
                      className="flex items-center text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-lg"
                    >
                      {IconComponent && (
                        <IconComponent className="h-4 w-4 mr-2" />
                      )}
                      <span className="capitalize">{amenity}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Close
              </Button>
              <Button>Edit Room</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
