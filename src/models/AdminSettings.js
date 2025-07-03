import mongoose from "mongoose";

const AdminSettingsSchema = new mongoose.Schema(
  {
    // App Settings
    siteName: {
      type: String,
      default: "Tang Mow Hotel",
    },
    siteDescription: {
      type: String,
      default: "Premium hospitality in the heart of Wewak",
    },
    contactEmail: {
      type: String,
      default: "info@tangmowhotel.com",
    },
    contactPhone: {
      type: String,
      default: "+675 456 7890",
    },
    address: {
      type: String,
      default:
        "TangMow Plaza Town Centre, Wewak, East Sepik Province, Papua New Guinea",
    },
    logo: {
      type: String,
      default: "/tang-mow-logo.svg",
    },
    favicon: {
      type: String,
      default: "/favicon.ico",
    },

    // Hero Settings
    heroTitle: {
      type: String,
      default: "Welcome to Tang Mow Hotel",
    },
    heroSubtitle: {
      type: String,
      default: "Experience Premium Hospitality in Wewak",
    },
    heroDescription: {
      type: String,
      default:
        "Discover luxury and comfort at Papua New Guinea's premier hotel destination. Located in the heart of Wewak, we offer exceptional accommodations, world-class dining, and unforgettable experiences.",
    },
    heroCtaText: {
      type: String,
      default: "Book Your Stay",
    },
    heroCtaSecondaryText: {
      type: String,
      default: "Learn More",
    },
    heroBackgroundImages: {
      type: [String],
      default: [
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80",
        "https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      ],
    },

    // Settings type - we'll use a single document approach
    settingsType: {
      type: String,
      default: "main",
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.AdminSettings ||
  mongoose.model("AdminSettings", AdminSettingsSchema);
