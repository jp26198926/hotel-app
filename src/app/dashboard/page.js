"use client";

import { useState, useEffect } from "react";
import {
  Hotel,
  Calendar,
  Users,
  UtensilsCrossed,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertCircle,
  DollarSign,
} from "lucide-react";
import { Card, Button, Badge } from "@/components/ui";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalRooms: 150,
    occupiedRooms: 98,
    availableRooms: 52,
    todayCheckIns: 24,
    todayCheckOuts: 18,
    restaurantReservations: 67,
    totalRevenue: 125400,
    monthlyGrowth: 12.5,
  });

  const [recentBookings, setRecentBookings] = useState([
    {
      id: "BK2507001",
      guest: "Sarah Johnson",
      room: "205",
      checkIn: "2025-07-02",
      checkOut: "2025-07-05",
      status: "confirmed",
      amount: 450,
    },
    {
      id: "BK2507002",
      guest: "Michael Chen",
      room: "312",
      checkIn: "2025-07-02",
      checkOut: "2025-07-04",
      status: "pending",
      amount: 320,
    },
    {
      id: "BK2507003",
      guest: "Emma Davis",
      room: "108",
      checkIn: "2025-07-03",
      checkOut: "2025-07-06",
      status: "confirmed",
      amount: 380,
    },
  ]);

  const [recentReservations, setRecentReservations] = useState([
    {
      id: "RST2507001",
      guest: "Robert Wilson",
      table: "T12",
      date: "2025-07-02",
      time: "19:00",
      party: 4,
      status: "confirmed",
    },
    {
      id: "RST2507002",
      guest: "Lisa Martinez",
      table: "T08",
      date: "2025-07-02",
      time: "20:30",
      party: 2,
      status: "pending",
    },
    {
      id: "RST2507003",
      guest: "David Brown",
      table: "T15",
      date: "2025-07-03",
      time: "18:00",
      party: 6,
      status: "confirmed",
    },
  ]);

  const occupancyRate = (
    (stats.occupiedRooms / stats.totalRooms) *
    100
  ).toFixed(1);

  const statCards = [
    {
      title: "Total Revenue",
      value: formatCurrency(stats.totalRevenue),
      change: `+${stats.monthlyGrowth}%`,
      changeType: "increase",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Occupancy Rate",
      value: `${occupancyRate}%`,
      change: `${stats.occupiedRooms}/${stats.totalRooms}`,
      changeType: "neutral",
      icon: Hotel,
      color: "text-blue-600",
    },
    {
      title: "Today Check-ins",
      value: stats.todayCheckIns.toString(),
      change: "vs yesterday",
      changeType: "neutral",
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      title: "Restaurant Bookings",
      value: stats.restaurantReservations.toString(),
      change: "Today",
      changeType: "neutral",
      icon: UtensilsCrossed,
      color: "text-purple-600",
    },
  ];

  const getStatusColor = (status) => {
    const colors = {
      confirmed: "success",
      pending: "warning",
      cancelled: "danger",
      completed: "info",
    };
    return colors[status] || "default";
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back! Here&apos;s what&apos;s happening at your hotel today.
          </p>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0">
          <Button variant="outline" className="mr-3">
            Export Report
          </Button>
          <Button>Quick Check-in</Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`rounded-md bg-gray-50 p-3 ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {stat.title}
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {stat.value}
                    </div>
                    <div
                      className={`ml-2 text-sm font-medium ${
                        stat.changeType === "increase"
                          ? "text-green-600"
                          : stat.changeType === "decrease"
                          ? "text-red-600"
                          : "text-gray-500"
                      }`}
                    >
                      {stat.changeType === "increase" && (
                        <TrendingUp className="inline h-4 w-4 mr-1" />
                      )}
                      {stat.changeType === "decrease" && (
                        <TrendingDown className="inline h-4 w-4 mr-1" />
                      )}
                      {stat.change}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Recent Bookings */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              Recent Bookings
            </h3>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </div>
          <div className="space-y-4">
            {recentBookings.map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900">
                      {booking.guest}
                    </h4>
                    <Badge
                      variant={getStatusColor(booking.status)}
                      className="capitalize"
                    >
                      {booking.status}
                    </Badge>
                  </div>
                  <div className="mt-1 text-sm text-gray-500">
                    Room {booking.room} • {formatDate(booking.checkIn)} -{" "}
                    {formatDate(booking.checkOut)}
                  </div>
                  <div className="mt-1 text-sm font-medium text-gray-900">
                    {formatCurrency(booking.amount)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Restaurant Reservations */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              Restaurant Reservations
            </h3>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </div>
          <div className="space-y-4">
            {recentReservations.map((reservation) => (
              <div
                key={reservation.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900">
                      {reservation.guest}
                    </h4>
                    <Badge
                      variant={getStatusColor(reservation.status)}
                      className="capitalize"
                    >
                      {reservation.status}
                    </Badge>
                  </div>
                  <div className="mt-1 text-sm text-gray-500">
                    Table {reservation.table} • {formatDate(reservation.date)}{" "}
                    at {reservation.time}
                  </div>
                  <div className="mt-1 text-sm text-gray-600">
                    Party of {reservation.party}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
          <p className="mt-1 text-sm text-gray-500">
            Common tasks to help you manage your hotel efficiently.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Button variant="outline" className="h-20 flex-col">
            <Hotel className="h-6 w-6 mb-2" />
            <span>New Booking</span>
          </Button>
          <Button variant="outline" className="h-20 flex-col">
            <CheckCircle className="h-6 w-6 mb-2" />
            <span>Check-in Guest</span>
          </Button>
          <Button variant="outline" className="h-20 flex-col">
            <UtensilsCrossed className="h-6 w-6 mb-2" />
            <span>Table Reservation</span>
          </Button>
          <Button variant="outline" className="h-20 flex-col">
            <Users className="h-6 w-6 mb-2" />
            <span>Guest Services</span>
          </Button>
        </div>
      </Card>
    </div>
  );
}
