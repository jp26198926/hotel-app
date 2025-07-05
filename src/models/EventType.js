import mongoose from "mongoose";

const EventTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Event type name is required"],
      unique: true,
    },
    slug: {
      type: String,
      required: [true, "Event type slug is required"],
      unique: true,
    },
    description: {
      type: String,
      required: [true, "Event type description is required"],
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    shortDescription: {
      type: String,
      maxlength: [200, "Short description cannot exceed 200 characters"],
    },
    category: {
      type: String,
      enum: [
        "wedding",
        "corporate",
        "social",
        "conference",
        "meeting",
        "party",
        "celebration",
        "other",
      ],
      required: [true, "Event category is required"],
    },
    pricing: {
      basePrice: {
        type: Number,
        required: [true, "Base price is required"],
        min: [0, "Base price cannot be negative"],
      },
      pricePerGuest: {
        type: Number,
        default: 0,
        min: [0, "Price per guest cannot be negative"],
      },
      minimumGuests: {
        type: Number,
        default: 1,
        min: [1, "Minimum guests must be at least 1"],
      },
      maximumGuests: {
        type: Number,
        required: [true, "Maximum guests is required"],
        min: [1, "Maximum guests must be at least 1"],
      },
      currency: {
        type: String,
        default: "PGK",
      },
    },
    duration: {
      defaultHours: {
        type: Number,
        required: [true, "Default duration is required"],
        min: [1, "Duration must be at least 1 hour"],
      },
      minimumHours: {
        type: Number,
        default: 1,
        min: [1, "Minimum hours must be at least 1"],
      },
      maximumHours: {
        type: Number,
        default: 12,
        min: [1, "Maximum hours must be at least 1"],
      },
    },
    inclusions: [String], // What's included in the package
    equipment: [
      {
        item: {
          type: String,
          required: true,
        },
        included: {
          type: Boolean,
          default: false,
        },
        additionalCost: {
          type: Number,
          default: 0,
        },
      },
    ],
    catering: {
      available: {
        type: Boolean,
        default: true,
      },
      menuOptions: [String],
      pricePerPerson: {
        type: Number,
        default: 0,
      },
    },
    decoration: {
      available: {
        type: Boolean,
        default: false,
      },
      options: [String],
      baseCost: {
        type: Number,
        default: 0,
      },
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        alt: {
          type: String,
          required: true,
        },
        isPrimary: {
          type: Boolean,
          default: false,
        },
        caption: String,
      },
    ],
    policies: {
      cancellation: {
        type: String,
        default: "Free cancellation up to 48 hours before event",
      },
      deposit: {
        required: {
          type: Boolean,
          default: true,
        },
        percentage: {
          type: Number,
          default: 50,
        },
      },
      setupTime: {
        type: Number,
        default: 2, // hours before event
      },
      cleanupTime: {
        type: Number,
        default: 1, // hours after event
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    modifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

EventTypeSchema.index({ category: 1, isActive: 1 });
EventTypeSchema.index({ isActive: 1, sortOrder: 1 });

export default mongoose.models.EventType ||
  mongoose.model("EventType", EventTypeSchema);
