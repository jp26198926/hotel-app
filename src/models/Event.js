import mongoose from "mongoose";

const EventSchema = new mongoose.Schema(
  {
    eventNumber: {
      type: String,
      required: [true, "Event number is required"],
      unique: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Client is required"],
    },
    eventType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EventType",
      required: [true, "Event type is required"],
    },
    eventDetails: {
      name: {
        type: String,
        required: [true, "Event name is required"],
        maxlength: [200, "Event name cannot exceed 200 characters"],
      },
      description: {
        type: String,
        maxlength: [1000, "Event description cannot exceed 1000 characters"],
      },
      theme: String,
      dressCode: String,
    },
    dateTime: {
      eventDate: {
        type: Date,
        required: [true, "Event date is required"],
      },
      startTime: {
        type: String,
        required: [true, "Start time is required"],
      },
      endTime: {
        type: String,
        required: [true, "End time is required"],
      },
      duration: {
        type: Number, // in hours
        required: [true, "Duration is required"],
      },
      setupTime: {
        type: Date,
      },
      cleanupTime: {
        type: Date,
      },
    },
    venue: {
      space: {
        type: String,
        required: [true, "Venue space is required"],
        enum: [
          "conference_room",
          "banquet_hall",
          "outdoor_terrace",
          "restaurant",
          "bar_area",
          "pool_side",
        ],
      },
      capacity: {
        type: Number,
        required: [true, "Venue capacity is required"],
      },
      layout: {
        type: String,
        enum: [
          "theater",
          "classroom",
          "boardroom",
          "banquet",
          "cocktail",
          "u_shape",
          "custom",
        ],
        default: "banquet",
      },
    },
    guests: {
      expectedCount: {
        type: Number,
        required: [true, "Expected guest count is required"],
        min: [1, "Expected guest count must be at least 1"],
      },
      confirmedCount: {
        type: Number,
        default: 0,
      },
      adults: {
        type: Number,
        required: [true, "Number of adults is required"],
      },
      children: {
        type: Number,
        default: 0,
      },
    },
    pricing: {
      basePrice: {
        type: Number,
        required: [true, "Base price is required"],
        min: [0, "Base price cannot be negative"],
      },
      guestPrice: {
        type: Number,
        default: 0,
      },
      cateringCost: {
        type: Number,
        default: 0,
      },
      decorationCost: {
        type: Number,
        default: 0,
      },
      equipmentCost: {
        type: Number,
        default: 0,
      },
      serviceFees: {
        type: Number,
        default: 0,
      },
      taxes: {
        type: Number,
        default: 0,
      },
      discounts: {
        type: Number,
        default: 0,
      },
      totalAmount: {
        type: Number,
        required: [true, "Total amount is required"],
      },
      currency: {
        type: String,
        default: "PGK",
      },
    },
    services: {
      catering: {
        required: {
          type: Boolean,
          default: false,
        },
        menu: [String],
        servingStyle: {
          type: String,
          enum: ["buffet", "plated", "family_style", "cocktail"],
        },
        specialRequirements: String,
      },
      decoration: {
        required: {
          type: Boolean,
          default: false,
        },
        theme: String,
        colorScheme: [String],
        specialRequests: String,
      },
      equipment: {
        audioVisual: {
          microphone: { type: Boolean, default: false },
          speakers: { type: Boolean, default: false },
          projector: { type: Boolean, default: false },
          screen: { type: Boolean, default: false },
          lighting: { type: Boolean, default: false },
        },
        furniture: {
          chairs: { type: Number, default: 0 },
          tables: { type: Number, default: 0 },
          stage: { type: Boolean, default: false },
          podium: { type: Boolean, default: false },
        },
        other: [String],
      },
      photography: {
        required: {
          type: Boolean,
          default: false,
        },
        photographer: String,
        hours: Number,
        cost: Number,
      },
    },
    specialRequests: {
      type: String,
      maxlength: [1000, "Special requests cannot exceed 1000 characters"],
    },
    status: {
      type: String,
      enum: [
        "inquiry",
        "quoted",
        "confirmed",
        "inProgress",
        "completed",
        "cancelled",
      ],
      default: "inquiry",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "deposit_paid", "partial", "paid", "refunded"],
      default: "pending",
    },
    communication: {
      quoteSent: {
        type: Boolean,
        default: false,
      },
      contractSigned: {
        type: Boolean,
        default: false,
      },
      reminderSent: {
        type: Boolean,
        default: false,
      },
      confirmationSent: {
        type: Boolean,
        default: false,
      },
    },
    notes: {
      client: {
        type: String,
        maxlength: [1000, "Client notes cannot exceed 1000 characters"],
      },
      internal: {
        type: String,
        maxlength: [1000, "Internal notes cannot exceed 1000 characters"],
      },
      setup: {
        type: String,
        maxlength: [500, "Setup notes cannot exceed 500 characters"],
      },
    },
    assignedStaff: [
      {
        staff: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        role: {
          type: String,
          enum: [
            "coordinator",
            "server",
            "chef",
            "decorator",
            "technician",
            "security",
          ],
        },
        shiftStart: Date,
        shiftEnd: Date,
      },
    ],
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

// Validate event date is in the future
EventSchema.pre("save", function (next) {
  if (this.dateTime.eventDate <= new Date()) {
    next(new Error("Event date must be in the future"));
  } else {
    next();
  }
});

EventSchema.index({ client: 1, status: 1 });
EventSchema.index({ "dateTime.eventDate": 1 });
EventSchema.index({ status: 1, "dateTime.eventDate": 1 });
EventSchema.index({ eventType: 1, status: 1 });

export default mongoose.models.Event || mongoose.model("Event", EventSchema);
