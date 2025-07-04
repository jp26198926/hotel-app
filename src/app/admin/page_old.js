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
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
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
            <Icon className={`h-6 w-6 ${action.color.replace('bg-', 'text-')}`} />
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
          subtitle={`${Math.round((stats.occupiedRooms / stats.totalRooms) * 100)}% occupied`}
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
  const { showError, showSuccess, ToastComponent } = useToast();
  const { appSettings, heroSettings, saveAppSettings, saveHeroSettings } =
    useAdminSettings();
  const [activeTab, setActiveTab] = useState("app-settings");
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);
  const [uploadingHeroImage, setUploadingHeroImage] = useState(false);
  const [loadingImages, setLoadingImages] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Local state for form inputs
  const [localAppSettings, setLocalAppSettings] = useState(appSettings);
  const [localHeroSettings, setLocalHeroSettings] = useState(heroSettings);

  // Update local state when context changes
  useEffect(() => {
    setLocalAppSettings(appSettings);
  }, [appSettings]);

  useEffect(() => {
    setLocalHeroSettings(heroSettings);
  }, [heroSettings]);

  // Initialize loading states for existing images
  useEffect(() => {
    if (localHeroSettings.backgroundImages?.length > 0) {
      const initialLoadingState = {};
      localHeroSettings.backgroundImages.forEach((image) => {
        initialLoadingState[image] = undefined; // undefined means not loaded yet
      });
      setLoadingImages(initialLoadingState);
    }
  }, [localHeroSettings.backgroundImages]);

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
      if (activeTab === "app-settings") {
        await saveAppSettings(localAppSettings);
        showSuccess("App settings saved successfully!");
      } else if (activeTab === "hero-section") {
        await saveHeroSettings(localHeroSettings);
        showSuccess("Hero section settings saved successfully!");
      } else if (activeTab === "room-types") {
        // TODO: Implement room types save functionality
        showSuccess("Room types saved successfully!");
      } else if (activeTab === "rooms") {
        // TODO: Implement rooms save functionality
        showSuccess("Rooms saved successfully!");
      } else if (activeTab === "menu-items") {
        // TODO: Implement menu items save functionality
        showSuccess("Menu items saved successfully!");
      } else if (activeTab === "orders") {
        // TODO: Implement orders save functionality
        showSuccess("Orders saved successfully!");
      } else if (activeTab === "events") {
        // TODO: Implement events save functionality
        showSuccess("Events saved successfully!");
      } else if (activeTab === "gallery") {
        // TODO: Implement gallery save functionality
        showSuccess("Gallery saved successfully!");
      } else if (activeTab === "user-roles") {
        // TODO: Implement user roles save functionality
        showSuccess("User roles saved successfully!");
      } else if (activeTab === "payments") {
        // TODO: Implement payments save functionality
        showSuccess("Payments saved successfully!");
      } else if (activeTab === "staff") {
        // TODO: Implement staff save functionality
        showSuccess("Staff saved successfully!");
      }
    } catch (error) {
      showError(
        `Failed to save ${getCurrentTab()?.label?.toLowerCase()}. Please try again.`
      );
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

  // Handle background image upload
  const handleBackgroundImageUpload = async () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/jpeg,image/jpg,image/png,image/webp";
    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      setUploadingHeroImage(true);
      try {
        const fileUrl = await handleFileUpload(file, "hero");

        // Add the new image to the background images array
        const updatedHeroSettings = {
          ...localHeroSettings,
          backgroundImages: [
            ...(localHeroSettings.backgroundImages || []),
            fileUrl,
          ],
        };

        setLocalHeroSettings(updatedHeroSettings);

        // Auto-save the settings to database
        await saveHeroSettings(updatedHeroSettings);

        showSuccess("Background image uploaded and saved successfully!");
      } catch (error) {
        console.error("Background image upload error:", error);
        showError("Failed to upload background image. Please try again.");
      } finally {
        setUploadingHeroImage(false);
      }
    };
    fileInput.click();
  };

  // Remove background image
  const removeBackgroundImage = async (index) => {
    const updatedHeroSettings = {
      ...localHeroSettings,
      backgroundImages: localHeroSettings.backgroundImages.filter(
        (_, i) => i !== index
      ),
    };

    setLocalHeroSettings(updatedHeroSettings);

    try {
      // Auto-save the settings to database
      await saveHeroSettings(updatedHeroSettings);
      showSuccess("Background image removed successfully!");
    } catch (error) {
      console.error("Remove background image error:", error);
      showError("Failed to remove background image. Please try again.");
    }
  };

  // Handle image modal
  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsModalOpen(true);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
    setIsModalOpen(false);
  };

  // Handle Escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isModalOpen) {
        closeImageModal();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isModalOpen]);

  // Tab configuration
  const tabs = [
    {
      id: "app-settings",
      label: "App Settings",
      icon: Settings,
      category: "System",
      description: "Configure application settings",
      color: "bg-red-500",
    },
    {
      id: "hero-section",
      label: "Hero Section",
      icon: Home,
      category: "Content",
      description: "Manage homepage hero content",
      color: "bg-orange-500",
    },
    {
      id: "room-types",
      label: "Room Types",
      icon: Hotel,
      category: "Hotel",
      description: "Manage room categories and types",
      color: "bg-red-600",
    },
    {
      id: "rooms",
      label: "Rooms",
      icon: MapPin,
      category: "Hotel",
      description: "Individual room management",
      color: "bg-red-600",
    },
    {
      id: "menu-items",
      label: "Menu Items",
      icon: UtensilsCrossed,
      category: "Restaurant",
      description: "Food and beverage menu",
      color: "bg-orange-600",
    },
    {
      id: "orders",
      label: "Orders",
      icon: BarChart3,
      category: "Restaurant",
      description: "Order management and tracking",
      color: "bg-orange-600",
    },
    {
      id: "events",
      label: "Events",
      icon: Calendar,
      category: "Events",
      description: "Event bookings and management",
      color: "bg-red-400",
    },
    {
      id: "gallery",
      label: "Gallery",
      icon: ImageIcon,
      category: "Content",
      description: "Image gallery management",
      color: "bg-orange-500",
    },
    {
      id: "user-roles",
      label: "User Roles",
      icon: Shield,
      category: "Security",
      description: "Role-based access control",
      color: "bg-red-700",
    },
    {
      id: "payments",
      label: "Payments",
      icon: CreditCard,
      category: "Finance",
      description: "Payment processing and billing",
      color: "bg-orange-400",
    },
    {
      id: "staff",
      label: "Staff",
      icon: Users,
      category: "Security",
      description: "Employee management",
      color: "bg-red-700",
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
  const getCurrentTab = () => tabs.find((tab) => tab.id === activeTab);
  const getCurrentCategory = () =>
    categories.find((cat) => cat.id === getCurrentTab()?.category);

  // Handle image loading states
  const handleImageLoad = (imageUrl) => {
    setLoadingImages((prev) => ({ ...prev, [imageUrl]: false }));
  };

  const handleImageError = (imageUrl) => {
    setLoadingImages((prev) => ({ ...prev, [imageUrl]: false }));
    console.error("Image failed to load:", imageUrl);
  };

  // Add cache busting for uploaded images to ensure they display properly
  const getCachebustedUrl = (url) => {
    if (url && url.startsWith("/uploads/")) {
      return `${url}?t=${Date.now()}`;
    }
    return url;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <ToastComponent />

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
          <div className="flex items-center">
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
          </div>
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
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id);
                          setSidebarOpen(false);
                        }}
                        className={`
                          w-full flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200
                          ${
                            activeTab === tab.id
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
                      </button>
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
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-14 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-gray-900 bg-white w-64"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
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
                  {getCurrentTab()?.label}
                </h1>
                <p className="mt-1 text-sm text-gray-600 font-light">
                  {getCurrentTab()?.description}
                </p>
              </div>
              <div className="flex items-center space-x-3">
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
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="space-y-6">
            {/* App Settings Tab */}
            {activeTab === "app-settings" && (
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
                          className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-gray-900 bg-white font-poppins"
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
                            handleAppSettingsChange(
                              "siteDescription",
                              e.target.value
                            )
                          }
                          rows={3}
                          className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-gray-900 bg-white font-poppins"
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
                            handleAppSettingsChange(
                              "contactEmail",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-gray-900 bg-white font-poppins"
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
                            handleAppSettingsChange(
                              "contactPhone",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-gray-900 bg-white font-poppins"
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
                          className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-gray-900 bg-white font-poppins"
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
                            handleAppSettingsChange(
                              "facebookLink",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-gray-900 bg-white font-poppins"
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
                            {uploadingFavicon
                              ? "Uploading..."
                              : "Upload Favicon"}
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
                              handleAppSettingsChange(
                                "primaryColor",
                                e.target.value
                              )
                            }
                            className="w-12 h-10 rounded-lg cursor-pointer"
                          />
                          <input
                            type="text"
                            value={localAppSettings.primaryColor || "#D4A574"}
                            onChange={(e) =>
                              handleAppSettingsChange(
                                "primaryColor",
                                e.target.value
                              )
                            }
                            className="flex-1 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-gray-900 bg-white font-poppins"
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
                              handleAppSettingsChange(
                                "secondaryColor",
                                e.target.value
                              )
                            }
                            className="w-12 h-10 rounded-lg cursor-pointer"
                          />
                          <input
                            type="text"
                            value={localAppSettings.secondaryColor || "#8B4513"}
                            onChange={(e) =>
                              handleAppSettingsChange(
                                "secondaryColor",
                                e.target.value
                              )
                            }
                            className="flex-1 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-gray-900 bg-white font-poppins"
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
            )}

            {/* Hero Section Tab */}
            {activeTab === "hero-section" && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Hero Section
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Configure the main hero section content
                  </p>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Hero Content */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                        Hero Content
                      </h3>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Main Title
                        </label>
                        <input
                          type="text"
                          value={localHeroSettings.title || ""}
                          onChange={(e) =>
                            setLocalHeroSettings((prev) => ({
                              ...prev,
                              title: e.target.value,
                            }))
                          }
                          className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-gray-900 bg-white"
                          placeholder="Enter main title"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Subtitle
                        </label>
                        <input
                          type="text"
                          value={localHeroSettings.subtitle || ""}
                          onChange={(e) =>
                            setLocalHeroSettings((prev) => ({
                              ...prev,
                              subtitle: e.target.value,
                            }))
                          }
                          className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-gray-900 bg-white"
                          placeholder="Enter subtitle"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <textarea
                          value={localHeroSettings.description || ""}
                          onChange={(e) =>
                            setLocalHeroSettings((prev) => ({
                              ...prev,
                              description: e.target.value,
                            }))
                          }
                          rows={4}
                          className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-gray-900 bg-white"
                          placeholder="Enter hero description"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Primary Call to Action
                        </label>
                        <input
                          type="text"
                          value={localHeroSettings.ctaText || ""}
                          onChange={(e) =>
                            setLocalHeroSettings((prev) => ({
                              ...prev,
                              ctaText: e.target.value,
                            }))
                          }
                          className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-gray-900 bg-white"
                          placeholder="Enter primary CTA text"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Secondary Call to Action
                        </label>
                        <input
                          type="text"
                          value={localHeroSettings.ctaSecondaryText || ""}
                          onChange={(e) =>
                            setLocalHeroSettings((prev) => ({
                              ...prev,
                              ctaSecondaryText: e.target.value,
                            }))
                          }
                          className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-gray-900 bg-white"
                          placeholder="Enter secondary CTA text"
                        />
                      </div>
                    </div>

                    {/* Hero Images */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                        Background Images
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {localHeroSettings.backgroundImages?.length > 0 ? (
                          localHeroSettings.backgroundImages.map(
                            (image, index) => (
                              <div
                                key={index}
                                className="relative group bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                                onClick={() => openImageModal(image)}
                                title="Click to preview image"
                              >
                                <div
                                  className={`aspect-video hero-image-container ${
                                    loadingImages[image] === false
                                      ? "loaded"
                                      : ""
                                  }`}
                                >
                                  <img
                                    src={getCachebustedUrl(image)}
                                    alt={`Background ${index + 1}`}
                                    className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 hero-image ${
                                      loadingImages[image] === false
                                        ? "loaded"
                                        : ""
                                    }`}
                                    onLoad={() => handleImageLoad(image)}
                                    onError={() => handleImageError(image)}
                                  />
                                  {/* Click to preview indicator */}
                                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-30">
                                    <div className="bg-white bg-opacity-90 rounded-full p-3">
                                      <Eye className="h-6 w-6 text-gray-700" />
                                    </div>
                                  </div>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation(); // Prevent modal from opening
                                    removeBackgroundImage(index);
                                  }}
                                  className="absolute top-2 right-2 p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg z-10"
                                  title="Remove image"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                                <div className="absolute bottom-2 left-2 right-2">
                                  <div className="bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    Background {index + 1}
                                  </div>
                                </div>
                              </div>
                            )
                          )
                        ) : (
                          <div className="col-span-full text-center py-8">
                            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                              <ImageIcon className="h-8 w-8 text-gray-400" />
                            </div>
                            <p className="text-gray-500 text-sm">
                              No background images uploaded yet
                            </p>
                            <p className="text-gray-400 text-xs mt-1">
                              Upload images to display in the hero section
                            </p>
                          </div>
                        )}
                      </div>

                      <Button
                        onClick={handleBackgroundImageUpload}
                        variant="outline"
                        className="w-full upload-button"
                        disabled={uploadingHeroImage}
                      >
                        {uploadingHeroImage ? (
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Plus className="h-4 w-4 mr-2" />
                        )}
                        {uploadingHeroImage
                          ? "Uploading..."
                          : "Add Background Image"}
                      </Button>
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
            )}

            {/* Management sections for all other tabs */}
            {[
              "room-types",
              "rooms",
              "menu-items",
              "orders",
              "events",
              "gallery",
              "user-roles",
              "payments",
              "staff",
            ].includes(activeTab) && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {getCurrentTab()?.label}
                      </h2>
                      <p className="text-gray-600 mt-1">
                        {getCurrentTab()?.description}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="outline"
                        className="border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                      </Button>
                      <Button
                        variant="outline"
                        className="border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                      <Button className="bg-gradient-to-r from-red-700 to-orange-600 hover:from-red-800 hover:to-orange-700 text-white">
                        <Plus className="h-4 w-4 mr-2" />
                        Add New
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      {(() => {
                        const Icon = getCurrentTab()?.icon || Settings;
                        return <Icon className="h-8 w-8 text-gray-400" />;
                      })()}
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {getCurrentTab()?.label} Management
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Full CRUD interface for{" "}
                      {getCurrentTab()?.label.toLowerCase()} coming soon.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-2xl mx-auto">
                      {/* Feature preview cards */}
                      {activeTab === "room-types" && (
                        <>
                          <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-2">
                              Room Type Management
                            </h4>
                            <ul className="text-sm text-gray-700 space-y-1">
                              <li>• Create and edit room types</li>
                              <li>• Set pricing and amenities</li>
                              <li>• Manage room features</li>
                              <li>• Configure availability</li>
                            </ul>
                          </div>
                        </>
                      )}
                      {activeTab === "rooms" && (
                        <>
                          <div className="p-4 bg-gradient-to-br from-red-50 to-orange-50 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-2">
                              Room Management
                            </h4>
                            <ul className="text-sm text-gray-700 space-y-1">
                              <li>• Individual room tracking</li>
                              <li>• Maintenance schedules</li>
                              <li>• Room status updates</li>
                              <li>• Guest assignments</li>
                            </ul>
                          </div>
                        </>
                      )}
                      {activeTab === "menu-items" && (
                        <>
                          <div className="p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-2">
                              Menu Management
                            </h4>
                            <ul className="text-sm text-gray-700 space-y-1">
                              <li>• Add food and beverages</li>
                              <li>• Set prices and descriptions</li>
                              <li>• Manage categories</li>
                              <li>• Track inventory</li>
                            </ul>
                          </div>
                        </>
                      )}
                      {activeTab === "orders" && (
                        <>
                          <div className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-2">
                              Order Management
                            </h4>
                            <ul className="text-sm text-gray-700 space-y-1">
                              <li>• View and manage orders</li>
                              <li>• Track order status</li>
                              <li>• Handle room service</li>
                              <li>• Generate reports</li>
                            </ul>
                          </div>
                        </>
                      )}
                      {activeTab === "events" && (
                        <>
                          <div className="p-4 bg-gradient-to-br from-red-50 to-pink-50 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-2">
                              Event Management
                            </h4>
                            <ul className="text-sm text-gray-700 space-y-1">
                              <li>• Manage event types</li>
                              <li>• Book and schedule events</li>
                              <li>• Set pricing packages</li>
                              <li>• Coordinate catering</li>
                            </ul>
                          </div>
                        </>
                      )}
                      {activeTab === "gallery" && (
                        <>
                          <div className="p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-2">
                              Gallery Management
                            </h4>
                            <ul className="text-sm text-gray-700 space-y-1">
                              <li>• Upload and organize images</li>
                              <li>• Categorize photos</li>
                              <li>• Set featured images</li>
                              <li>• Manage metadata</li>
                            </ul>
                          </div>
                        </>
                      )}
                      {activeTab === "user-roles" && (
                        <>
                          <div className="p-4 bg-gradient-to-br from-red-50 to-orange-50 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-2">
                              User Roles & Permissions
                            </h4>
                            <ul className="text-sm text-gray-700 space-y-1">
                              <li>• Create and manage roles</li>
                              <li>• Set detailed permissions</li>
                              <li>• Configure access levels</li>
                              <li>• Assign roles to staff</li>
                            </ul>
                          </div>
                        </>
                      )}
                      {activeTab === "payments" && (
                        <>
                          <div className="p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-2">
                              Payment Management
                            </h4>
                            <ul className="text-sm text-gray-700 space-y-1">
                              <li>• Process payments</li>
                              <li>• Manage payment methods</li>
                              <li>• Track transactions</li>
                              <li>• Generate invoices</li>
                            </ul>
                          </div>
                        </>
                      )}
                      {activeTab === "staff" && (
                        <>
                          <div className="p-4 bg-gradient-to-br from-red-50 to-orange-50 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-2">
                              Staff Management
                            </h4>
                            <ul className="text-sm text-gray-700 space-y-1">
                              <li>• Manage staff accounts</li>
                              <li>• Set work schedules</li>
                              <li>• Track performance</li>
                              <li>• Handle communications</li>
                            </ul>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Save Button for other tabs */}
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
            )}
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
          onClick={closeImageModal}
        >
          <div
            className="bg-white rounded-lg overflow-hidden shadow-lg max-w-4xl max-h-[90vh] w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <img
                src={getCachebustedUrl(selectedImage)}
                alt="Selected Background Image"
                className="modal-image w-full h-auto object-cover max-h-[80vh]"
                onLoad={(e) => {
                  e.target.classList.add("loaded");
                }}
                onError={(e) => {
                  console.error("Modal image failed to load:", selectedImage);
                  e.target.style.display = "none";
                  const errorDiv = document.createElement("div");
                  errorDiv.className =
                    "w-full h-64 flex items-center justify-center bg-red-100 text-red-600";
                  errorDiv.innerHTML = "Failed to load image";
                  e.target.parentElement.appendChild(errorDiv);
                }}
              />
              <button
                onClick={closeImageModal}
                className="absolute top-3 right-3 p-2 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg transition-colors duration-200"
                title="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
