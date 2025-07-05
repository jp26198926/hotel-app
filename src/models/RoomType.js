import mongoose from "mongoose";

const RoomTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Room type name is required"],
      unique: true,
    },
    slug: {
      type: String,
      required: [true, "Room type slug is required"],
      unique: true,
    },
    description: {
      type: String,
      required: [true, "Room type description is required"],
      maxlength: [1000, "Description cannot be more than 1000 characters"],
    },
    shortDescription: {
      type: String,
      maxlength: [200, "Short description cannot be more than 200 characters"],
    },
    pricing: {
      basePrice: {
        type: Number,
        required: [true, "Base price is required"],
        min: [0, "Price cannot be negative"],
      },
      weekendPrice: {
        type: Number,
        min: [0, "Weekend price cannot be negative"],
      },
      holidayPrice: {
        type: Number,
        min: [0, "Holiday price cannot be negative"],
      },
      currency: {
        type: String,
        default: "PGK",
      },
    },
    capacity: {
      adults: {
        type: Number,
        required: [true, "Adult capacity is required"],
        min: [1, "Adult capacity must be at least 1"],
      },
      children: {
        type: Number,
        default: 0,
        min: [0, "Children capacity cannot be negative"],
      },
      maxGuests: {
        type: Number,
        required: [true, "Maximum guests is required"],
        min: [1, "Maximum guests must be at least 1"],
      },
    },
    bedConfiguration: {
      bedType: {
        type: String,
        enum: ["single", "double", "queen", "king", "twin"],
        required: [true, "Bed type is required"],
      },
      bedCount: {
        type: Number,
        required: [true, "Bed count is required"],
        min: [1, "Bed count must be at least 1"],
      },
      sofa: {
        type: Boolean,
        default: false,
      },
    },
    roomSize: {
      type: Number, // in square feet
      required: [true, "Room size is required"],
      min: [1, "Room size must be positive"],
    },
    amenities: [
      {
        type: String,
        enum: [
          "wifi",
          "tv",
          "ac",
          "minibar",
          "balcony",
          "seaView",
          "cityView",
          "kitchenette",
          "jacuzzi",
          "fireplace",
          "breakfast",
          "gymAccess",
          "parking",
          "roomService",
          "laundry",
          "safe",
          "hairdryer",
          "bathrobes",
          "slippers",
          "toiletries",
          "workDesk",
          "ironingBoard",
          "coffeemaker",
          "telephone",
        ],
      },
    ],
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
    inclusions: [String], // What's included in the room rate
    features: [String], // Special features or highlights
    policies: {
      smoking: {
        type: String,
        enum: ["allowed", "notAllowed", "designated"],
        default: "notAllowed",
      },
      pets: {
        type: String,
        enum: ["allowed", "notAllowed", "withFee"],
        default: "notAllowed",
      },
      extraBed: {
        available: {
          type: Boolean,
          default: false,
        },
        cost: {
          type: Number,
          default: 0,
        },
      },
    },
    availability: {
      totalRooms: {
        type: Number,
        required: [true, "Total rooms count is required"],
        min: [0, "Total rooms cannot be negative"],
      },
      maintenanceRooms: {
        type: Number,
        default: 0,
        min: [0, "Maintenance rooms cannot be negative"],
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

RoomTypeSchema.index({ isActive: 1, sortOrder: 1 });
RoomTypeSchema.index({ "pricing.basePrice": 1 });

export default mongoose.models.RoomType ||
  mongoose.model("RoomType", RoomTypeSchema);
