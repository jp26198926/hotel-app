import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: [true, "Room number is required"],
      unique: true,
    },
    roomType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RoomType",
      required: [true, "Room type is required"],
    },
    floor: {
      type: Number,
      required: [true, "Floor number is required"],
      min: [1, "Floor number must be at least 1"],
    },
    wing: {
      type: String,
      enum: ["north", "south", "east", "west", "central"],
    },
    status: {
      type: String,
      enum: [
        "available",
        "occupied",
        "maintenance",
        "cleaning",
        "reserved",
        "outOfOrder",
      ],
      default: "available",
    },
    housekeeping: {
      lastCleaned: {
        type: Date,
      },
      cleanedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      cleaningStatus: {
        type: String,
        enum: ["clean", "dirty", "inspected", "outOfOrder"],
        default: "clean",
      },
      cleaningNotes: {
        type: String,
        maxlength: [500, "Cleaning notes cannot exceed 500 characters"],
      },
    },
    maintenance: {
      lastMaintenance: {
        type: Date,
      },
      maintenanceBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      maintenanceNotes: {
        type: String,
        maxlength: [500, "Maintenance notes cannot exceed 500 characters"],
      },
      nextMaintenanceDate: {
        type: Date,
      },
    },
    features: {
      view: {
        type: String,
        enum: ["sea", "city", "garden", "pool", "mountain", "courtyard"],
      },
      balcony: {
        type: Boolean,
        default: false,
      },
      connecting: {
        type: Boolean,
        default: false,
      },
      connectingRooms: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Room",
        },
      ],
    },
    accessibilityFeatures: [
      {
        type: String,
        enum: [
          "wheelchair",
          "hearing",
          "visual",
          "mobility",
          "bathroom",
          "elevator",
        ],
      },
    ],
    currentGuest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    currentBooking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },
    keyCardNumbers: [String],
    isActive: {
      type: Boolean,
      default: true,
    },
    notes: {
      type: String,
      maxlength: [1000, "Notes cannot exceed 1000 characters"],
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

RoomSchema.index({ roomNumber: 1 });
RoomSchema.index({ roomType: 1, status: 1 });
RoomSchema.index({ floor: 1 });
RoomSchema.index({ status: 1 });
RoomSchema.index({ currentBooking: 1 });

export default mongoose.models.Room || mongoose.model("Room", RoomSchema);
