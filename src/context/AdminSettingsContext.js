"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AdminSettingsContext = createContext();

export const useAdminSettings = () => {
  const context = useContext(AdminSettingsContext);
  if (!context) {
    throw new Error(
      "useAdminSettings must be used within an AdminSettingsProvider"
    );
  }
  return context;
};

export const AdminSettingsProvider = ({ children }) => {
  const [appSettings, setAppSettings] = useState({
    siteName: "Tang Mow Hotel",
    siteDescription: "Premium hospitality in the heart of Wewak",
    contactEmail: "info@tangmowhotel.com",
    contactPhone: "+675 456 7890",
    address:
      "TangMow Plaza Town Centre, Wewak, East Sepik Province, Papua New Guinea",
    facebookLink: "https://facebook.com/tangmowhotel",
    logo: "/tang-mow-logo.svg",
    favicon: "/favicon.ico",
    primaryColor: "#dc2626",
    secondaryColor: "#ea580c",
  });

  const [heroSettings, setHeroSettings] = useState({
    title: "Welcome to Tang Mow Hotel",
    subtitle: "Experience Premium Hospitality in Wewak",
    description:
      "Discover luxury and comfort at Papua New Guinea's premier hotel destination. Located in the heart of Wewak, we offer exceptional accommodations, world-class dining, and unforgettable experiences.",
    ctaText: "Book Your Stay",
    ctaSecondaryText: "Learn More",
    backgroundImages: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80",
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    ],
  });

  const [isLoading, setIsLoading] = useState(true);

  // Load settings from MongoDB on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch("/api/admin/settings");
        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            const settings = result.data;

            // Update app settings
            setAppSettings({
              siteName: settings.siteName,
              siteDescription: settings.siteDescription,
              contactEmail: settings.contactEmail,
              contactPhone: settings.contactPhone,
              address: settings.address,
              facebookLink: settings.facebookLink,
              logo: settings.logo,
              favicon: settings.favicon,
              primaryColor: settings.primaryColor,
              secondaryColor: settings.secondaryColor,
            });

            // Update hero settings
            setHeroSettings({
              title: settings.heroTitle,
              subtitle: settings.heroSubtitle,
              description: settings.heroDescription,
              ctaText: settings.heroCtaText,
              ctaSecondaryText: settings.heroCtaSecondaryText,
              backgroundImages: settings.heroBackgroundImages,
            });
          }
        }
      } catch (error) {
        console.error("Error loading admin settings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Save settings to MongoDB
  const saveAppSettings = async (newSettings) => {
    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          siteName: newSettings.siteName,
          siteDescription: newSettings.siteDescription,
          contactEmail: newSettings.contactEmail,
          contactPhone: newSettings.contactPhone,
          address: newSettings.address,
          facebookLink: newSettings.facebookLink,
          logo: newSettings.logo,
          favicon: newSettings.favicon,
          primaryColor: newSettings.primaryColor,
          secondaryColor: newSettings.secondaryColor,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setAppSettings(newSettings);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Error saving app settings:", error);
      return false;
    }
  };

  const saveHeroSettings = async (newSettings) => {
    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          heroTitle: newSettings.title,
          heroSubtitle: newSettings.subtitle,
          heroDescription: newSettings.description,
          heroCtaText: newSettings.ctaText,
          heroCtaSecondaryText: newSettings.ctaSecondaryText,
          heroBackgroundImages: newSettings.backgroundImages,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setHeroSettings(newSettings);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Error saving hero settings:", error);
      return false;
    }
  };

  const value = {
    appSettings,
    heroSettings,
    isLoading,
    saveAppSettings,
    saveHeroSettings,
  };

  return (
    <AdminSettingsContext.Provider value={value}>
      {children}
    </AdminSettingsContext.Provider>
  );
};
