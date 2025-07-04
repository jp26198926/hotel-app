"use client";

import { useState, useEffect } from "react";
import {
  Settings,
  Save,
  Upload,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Edit,
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
  Star,
  Filter,
  Download,
  RefreshCw,
  MoreVertical,
  Grid,
  List,
} from "lucide-react";
import { Button } from "@/components/ui";
import { useToast } from "@/components/Toast";
import { useAdminSettings } from "@/context/AdminSettingsContext";
import Image from "next/image";

export default function AdminPage() {
  const { showError, showSuccess, ToastComponent } = useToast();
  const { appSettings, heroSettings, saveAppSettings, saveHeroSettings } =
    useAdminSettings();
  const [activeTab, setActiveTab] = useState("app-settings");
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");

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

  // Remove background image
  const removeBackgroundImage = (index) => {
    setLocalHeroSettings((prev) => ({
      ...prev,
      backgroundImages: prev.backgroundImages.filter((_, i) => i !== index),
    }));
  };

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
                            onClick={() => {
                              /* TODO: Implement logo upload */
                            }}
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
                            onClick={() => {
                              /* TODO: Implement favicon upload */
                            }}
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

                      <div className="grid grid-cols-2 gap-4">
                        {localHeroSettings.backgroundImages?.map(
                          (image, index) => (
                            <div key={index} className="relative group">
                              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                                <Image
                                  src={image}
                                  alt={`Background ${index + 1}`}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <button
                                onClick={() => removeBackgroundImage(index)}
                                className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          )
                        )}
                      </div>

                      <Button
                        onClick={() => {
                          /* TODO: Implement image upload */
                        }}
                        variant="outline"
                        className="w-full upload-button"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Background Image
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
    </div>
  );
}
