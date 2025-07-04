import mongoose from "mongoose";

const AppSettingSchema = new mongoose.Schema(
  {
    settingsType: {
      type: String,
      default: "main",
      unique: true,
    },
    // Basic Site Information
    siteName: {
      type: String,
      required: [true, "Site name is required"],
      default: "Tang Mow Hotel",
    },
    siteDescription: {
      type: String,
      default: "Premium hotel accommodations in Wewak, East Sepik Province",
    },
    tagline: {
      type: String,
      default: "Experience Premium Hospitality",
    },
    // Contact Information
    contactInfo: {
      email: {
        type: String,
        required: [true, "Contact email is required"],
        default: "info@tangmowhotel.com",
      },
      phone: {
        type: String,
        required: [true, "Contact phone is required"],
        default: "+675 456 7890",
      },
      mobile: {
        type: String,
        default: "+675 456 7890",
      },
      fax: String,
      address: {
        type: String,
        required: [true, "Address is required"],
        default:
          "TangMow Plaza Town Centre, Wewak, East Sepik Province, Papua New Guinea",
      },
    },
    // Branding
    branding: {
      logo: {
        type: String,
        default: "/tang-mow-logo.svg",
      },
      favicon: {
        type: String,
        default: "/favicon.ico",
      },
      primaryColor: {
        type: String,
        default: "#D4A574", // Warm golden/amber from hotel interior
      },
      secondaryColor: {
        type: String,
        default: "#8B4513", // Rich brown/chocolate from hotel design
      },
    },

    // Hero Section Settings
    heroSettings: {
      title: {
        type: String,
        default: "Welcome to Tang Mow Hotel",
      },
      subtitle: {
        type: String,
        default: "Experience Premium Hospitality in Wewak",
      },
      description: {
        type: String,
        default:
          "Discover luxury and comfort at Papua New Guinea's premier hotel destination. Located in the heart of Wewak, we offer exceptional accommodations, world-class dining, and unforgettable experiences.",
      },
      primaryCTA: {
        type: String,
        default: "Book Your Stay",
      },
      secondaryCTA: {
        type: String,
        default: "Learn More",
      },
      backgroundImages: {
        type: [String],
        default: [
          "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80",
          "https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
          "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        ],
      },
    },
    // Social Media
    socialMedia: {
      facebook: {
        type: String,
        default: "https://facebook.com/tangmowhotel",
      },
      instagram: String,
      twitter: String,
      linkedin: String,
      youtube: String,
    },
    // Business Hours
    businessHours: {
      reception: {
        open: {
          type: String,
          default: "24/7",
        },
        close: {
          type: String,
          default: "24/7",
        },
      },
      restaurant: {
        open: {
          type: String,
          default: "06:00",
        },
        close: {
          type: String,
          default: "22:00",
        },
      },
      bar: {
        open: {
          type: String,
          default: "17:00",
        },
        close: {
          type: String,
          default: "01:00",
        },
      },
    },
    // Hotel Policies
    policies: {
      checkIn: {
        type: String,
        default: "2:00 PM",
      },
      checkOut: {
        type: String,
        default: "11:00 AM",
      },
      cancellation: {
        type: String,
        default: "Free cancellation up to 24 hours before check-in",
      },
      petPolicy: {
        type: String,
        default: "Pets are not allowed",
      },
      smokingPolicy: {
        type: String,
        default: "Non-smoking property",
      },
      childPolicy: {
        type: String,
        default: "Children under 12 stay free with parents",
      },
    },
    // Currency and Tax Settings
    currency: {
      code: {
        type: String,
        default: "PGK",
      },
      symbol: {
        type: String,
        default: "K",
      },
      name: {
        type: String,
        default: "Papua New Guinea Kina",
      },
    },
    taxSettings: {
      taxRate: {
        type: Number,
        default: 10,
      },
      taxName: {
        type: String,
        default: "GST",
      },
      includeTax: {
        type: Boolean,
        default: true,
      },
    },
    // Email Settings
    emailSettings: {
      smtpHost: String,
      smtpPort: Number,
      smtpUser: String,
      smtpPassword: String,
      fromEmail: String,
      fromName: String,
    },
    // SEO Settings
    seoSettings: {
      metaTitle: String,
      metaDescription: String,
      keywords: [String],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.AppSetting ||
  mongoose.model("AppSetting", AppSettingSchema);
