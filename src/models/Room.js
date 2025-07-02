import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: [true, "Please provide a room number"],
      unique: true,
    },
    type: {
      type: String,
      enum: ["standard", "deluxe", "suite", "presidential"],
      required: [true, "Please specify room type"],
    },
    category: {
      type: String,
      enum: ["single", "double", "twin", "family", "executive"],
      required: [true, "Please specify room category"],
    },
    floor: {
      type: Number,
      required: [true, "Please specify floor number"],
    },
    capacity: {
      adults: {
        type: Number,
        required: true,
        min: 1,
      },
      children: {
        type: Number,
        default: 0,
      },
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
        ],
      },
    ],
    price: {
      base: {
        type: Number,
        required: [true, "Please provide base price"],
      },
      weekend: {
        type: Number,
        required: false,
      },
      holiday: {
        type: Number,
        required: false,
      },
    },
    status: {
      type: String,
      enum: ["available", "occupied", "maintenance", "cleaning", "reserved"],
      default: "available",
    },
    images: [
      {
        url: String,
        alt: String,
      },
    ],
    description: {
      type: String,
      maxlength: [500, "Description cannot be more than 500 characters"],
    },
    size: {
      type: Number, // in square feet
      required: false,
    },
    bedType: {
      type: String,
      enum: ["single", "double", "queen", "king", "twin"],
      required: true,
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

RoomSchema.index({ roomNumber: 1 });
RoomSchema.index({ type: 1, status: 1 });
RoomSchema.index({ floor: 1 });

export default mongoose.models.Room || mongoose.model("Room", RoomSchema);
