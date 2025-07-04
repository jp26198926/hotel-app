"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Settings,
  Home,
  Hotel,
  UtensilsCrossed,
  Calendar,
  Users,
  Image as ImageIcon,
  Menu,
  X,
  Bell,
  Search,
  ChevronRight,
  BarChart3,
  Shield,
  CreditCard,
  MapPin,
  Grid,
  List,
} from "lucide-react";
import { useToast } from "@/components/Toast";

export default function AdminLayout({ children, title, description }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const pathname = usePathname();
  const { ToastComponent } = useToast();

  // Tab configuration
  const tabs = [
    {
      id: "app-settings",
      label: "App Settings",
      icon: Settings,
      category: "System",
      description: "Configure application settings",
      color: "bg-red-500",
      href: "/admin/app-settings",
    },
    {
      id: "hero-section",
      label: "Hero Section",
      icon: Home,
      category: "Content",
      description: "Manage homepage hero content",
      color: "bg-orange-500",
      href: "/admin/hero-section",
    },
    {
      id: "room-types",
      label: "Room Types",
      icon: Hotel,
      category: "Hotel",
      description: "Manage room categories and types",
      color: "bg-red-600",
      href: "/admin/room-types",
    },
    {
      id: "rooms",
      label: "Rooms",
      icon: MapPin,
      category: "Hotel",
      description: "Individual room management",
      color: "bg-red-600",
      href: "/admin/rooms",
    },
    {
      id: "menu-items",
      label: "Menu Items",
      icon: UtensilsCrossed,
      category: "Restaurant",
      description: "Food and beverage menu",
      color: "bg-orange-600",
      href: "/admin/restaurant/menu",
    },
    {
      id: "orders",
      label: "Orders",
      icon: BarChart3,
      category: "Restaurant",
      description: "Order management and tracking",
      color: "bg-orange-600",
      href: "/admin/restaurant/orders",
    },
    {
      id: "events",
      label: "Events",
      icon: Calendar,
      category: "Events",
      description: "Event bookings and management",
      color: "bg-red-400",
      href: "/admin/events",
    },
    {
      id: "gallery",
      label: "Gallery",
      icon: ImageIcon,
      category: "Content",
      description: "Image gallery management",
      color: "bg-orange-500",
      href: "/admin/gallery",
    },
    {
      id: "user-roles",
      label: "User Roles",
      icon: Shield,
      category: "Security",
      description: "Role-based access control",
      color: "bg-red-700",
      href: "/admin/user-roles",
    },
    {
      id: "payments",
      label: "Payments",
      icon: CreditCard,
      category: "Finance",
      description: "Payment processing and billing",
      color: "bg-orange-400",
      href: "/admin/payments",
    },
    {
      id: "staff",
      label: "Staff",
      icon: Users,
      category: "Security",
      description: "Employee management",
      color: "bg-red-700",
      href: "/admin/staff",
    },
  ];

  // Categories for sidebar navigation
  const categories = [
    { id: "System", label: "System", color: "bg-red-500", icon: Settings },
    { id: "Content", label: "Content", color: "bg-orange-500", icon: Home },
    { id: "Hotel", label: "Hotel", color: "bg-red-600", icon: Hotel },
    {
      id: "Restaurant",
      label: "Restaurant",
      color: "bg-orange-600",
      icon: UtensilsCrossed,
    },
    { id: "Events", label: "Events", color: "bg-red-400", icon: Calendar },
    {
      id: "Finance",
      label: "Finance",
      color: "bg-orange-400",
      icon: CreditCard,
    },
    { id: "Security", label: "Security", color: "bg-red-700", icon: Shield },
  ];

  // Helper functions
  const getCurrentTab = () => tabs.find((tab) => tab.href === pathname);
  const getCurrentCategory = () =>
    categories.find((cat) => cat.id === getCurrentTab()?.category);

  const isActiveTab = (href) => {
    if (href === "/admin" && pathname === "/admin") return true;
    return pathname.startsWith(href) && href !== "/admin";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {ToastComponent}

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:z-auto lg:flex lg:flex-col
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <Link href="/admin" className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-orange-500 rounded-lg flex items-center justify-center">
                <Hotel className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="ml-3">
              <h1 className="text-sm font-semibold text-gray-900 font-poppins">
                Admin
              </h1>
              <p className="text-xs text-gray-500 font-light">
                Management Portal
              </p>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-5 px-2 space-y-1 max-h-[calc(100vh-80px)] overflow-y-auto flex-1">
          {categories.map((category) => {
            const categoryTabs = tabs.filter(
              (tab) => tab.category === category.id
            );
            if (categoryTabs.length === 0) return null;

            return (
              <div key={category.id} className="mb-6">
                <div className="flex items-center mb-3 px-3">
                  <div
                    className={`w-2 h-2 rounded-full ${category.color} mr-3`}
                  />
                  <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide font-poppins">
                    {category.label}
                  </h3>
                </div>
                <div className="space-y-1">
                  {categoryTabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <Link
                        key={tab.id}
                        href={tab.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`
                          w-full flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200
                          ${
                            isActiveTab(tab.href)
                              ? "tab-active shadow-sm"
                              : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                          }
                        `}
                      >
                        <Icon className="mr-3 h-4 w-4 flex-shrink-0" />
                        <div className="flex-1 text-left">
                          <div className="text-sm font-medium font-poppins">
                            {tab.label}
                          </div>
                          <div className="text-xs text-gray-600 mt-0.5 font-light">
                            {tab.description}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  <Menu className="h-5 w-5" />
                </button>

                {/* Breadcrumb */}
                <div className="ml-4 lg:ml-0 flex items-center space-x-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-700">
                    <Home className="h-4 w-4" />
                    <ChevronRight className="h-4 w-4" />
                    <span className="font-medium">
                      {getCurrentCategory()?.label}
                    </span>
                    <ChevronRight className="h-4 w-4" />
                    <span className="text-gray-900 font-medium">
                      {getCurrentTab()?.label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Header Actions */}
              <div className="flex items-center space-x-4">
                <div className="hidden md:flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-gray-900 bg-white w-64"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="flex items-center bg-white rounded-lg border border-gray-200 p-1">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded-md transition-colors ${
                        viewMode === "grid"
                          ? "bg-red-100 text-red-700"
                          : "text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      <Grid className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded-md transition-colors ${
                        viewMode === "list"
                          ? "bg-red-100 text-red-700"
                          : "text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>
                  <button className="p-2 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors">
                    <Bell className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 font-poppins tracking-tight">
                  {title || getCurrentTab()?.label}
                </h1>
                <p className="mt-1 text-sm text-gray-600 font-light">
                  {description || getCurrentTab()?.description}
                </p>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="space-y-6 admin-page">{children}</div>
        </div>
      </div>
    </div>
  );
}
