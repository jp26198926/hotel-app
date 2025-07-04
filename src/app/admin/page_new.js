"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Settings,
  Home,
  Hotel,
  UtensilsCrossed,
  Calendar,
  Users,
  Image as ImageIcon,
  BarChart3,
  Shield,
  CreditCard,
  MapPin,
  TrendingUp,
  Activity,
  DollarSign,
  Star,
  ArrowRight,
  Clock,
  CheckCircle,
  AlertCircle,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui";
import { useToast } from "@/components/Toast";
import AdminLayout from "@/components/admin/AdminLayout";

export default function AdminDashboard() {
  const { showError, showSuccess } = useToast();
  const [stats, setStats] = useState({
    totalRooms: 24,
    occupiedRooms: 18,
    totalBookings: 156,
    totalRevenue: 45280,
    pendingOrders: 8,
    activeEvents: 3,
    galleryImages: 42,
    staffMembers: 12,
  });

  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      type: "booking",
      title: "New booking received",
      description: "Room 205 - John Doe",
      time: "2 minutes ago",
      icon: Hotel,
      color: "text-blue-600",
    },
    {
      id: 2,
      type: "order",
      title: "Restaurant order",
      description: "Table 8 - $45.50",
      time: "15 minutes ago",
      icon: UtensilsCrossed,
      color: "text-green-600",
    },
    {
      id: 3,
      type: "event",
      title: "Event inquiry",
      description: "Wedding reception - 50 guests",
      time: "1 hour ago",
      icon: Calendar,
      color: "text-purple-600",
    },
    {
      id: 4,
      type: "staff",
      title: "Staff check-in",
      description: "Sarah Johnson started shift",
      time: "2 hours ago",
      icon: UserCheck,
      color: "text-indigo-600",
    },
  ]);

  const quickActions = [
    {
      id: "app-settings",
      label: "App Settings",
      icon: Settings,
      description: "Configure application settings",
      color: "bg-red-500",
      href: "/admin/app-settings",
    },
    {
      id: "hero-section",
      label: "Hero Section",
      icon: Home,
      description: "Update homepage hero content",
      color: "bg-orange-500",
      href: "/admin/hero-section",
    },
    {
      id: "gallery",
      label: "Gallery",
      icon: ImageIcon,
      description: "Manage hotel images",
      color: "bg-orange-500",
      href: "/admin/gallery",
    },
    {
      id: "rooms",
      label: "Rooms",
      icon: Hotel,
      description: "Manage room inventory",
      color: "bg-red-600",
      href: "/admin/rooms",
    },
    {
      id: "restaurant",
      label: "Restaurant",
      icon: UtensilsCrossed,
      description: "Food & beverage management",
      color: "bg-orange-600",
      href: "/admin/restaurant",
    },
    {
      id: "events",
      label: "Events",
      icon: Calendar,
      description: "Event bookings",
      color: "bg-red-400",
      href: "/admin/events",
    },
  ];

  const StatCard = ({ title, value, subtitle, icon: Icon, color, trend }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center">
          <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
          <span className="text-sm text-green-600 font-medium">{trend}</span>
        </div>
      )}
    </div>
  );

  const QuickActionCard = ({ action }) => {
    const Icon = action.icon;
    return (
      <Link
        href={action.href}
        className="group bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all hover:border-gray-300"
      >
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-lg ${action.color} bg-opacity-10`}>
            <Icon
              className={`h-6 w-6 ${action.color.replace("bg-", "text-")}`}
            />
          </div>
          <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {action.label}
        </h3>
        <p className="text-sm text-gray-600">{action.description}</p>
      </Link>
    );
  };

  return (
    <AdminLayout title="Dashboard" description="Hotel management overview">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Room Occupancy"
          value={`${stats.occupiedRooms}/${stats.totalRooms}`}
          subtitle={`${Math.round(
            (stats.occupiedRooms / stats.totalRooms) * 100
          )}% occupied`}
          icon={Hotel}
          color="text-blue-600"
          trend="+12% from last week"
        />
        <StatCard
          title="Total Bookings"
          value={stats.totalBookings}
          subtitle="This month"
          icon={Calendar}
          color="text-green-600"
          trend="+8% from last month"
        />
        <StatCard
          title="Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          subtitle="Monthly total"
          icon={DollarSign}
          color="text-purple-600"
          trend="+15% from last month"
        />
        <StatCard
          title="Staff Active"
          value={stats.staffMembers}
          subtitle="On duty today"
          icon={Users}
          color="text-indigo-600"
        />
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
          <Button variant="outline" className="text-sm">
            View All
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action) => (
            <QuickActionCard key={action.id} action={action} />
          ))}
        </div>
      </div>

      {/* Recent Activity & Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Activity
              </h3>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivity.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full bg-gray-100`}>
                      <Icon className={`h-4 w-4 ${activity.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {activity.description}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              System Status
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium text-gray-900">
                    Database Connection
                  </span>
                </div>
                <span className="text-sm text-green-600">Healthy</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium text-gray-900">
                    Payment Gateway
                  </span>
                </div>
                <span className="text-sm text-green-600">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                  <span className="text-sm font-medium text-gray-900">
                    Email Service
                  </span>
                </div>
                <span className="text-sm text-yellow-600">
                  {stats.pendingOrders} pending
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium text-gray-900">
                    Backup System
                  </span>
                </div>
                <span className="text-sm text-green-600">Up to date</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
