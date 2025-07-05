import mongoose from "mongoose";

const RestaurantTableSchema = new mongoose.Schema(
  {
    tableNumber: {
      type: String,
      required: [true, "Please provide a table number"],
      unique: true,
    },
    capacity: {
      type: Number,
      required: [true, "Please specify table capacity"],
      min: 1,
      max: 12,
    },
    location: {
      type: String,
      enum: ["indoor", "outdoor", "private", "bar", "terrace"],
      required: [true, "Please specify table location"],
    },
    status: {
      type: String,
      enum: ["available", "occupied", "reserved", "maintenance"],
      default: "available",
    },
    features: [
      {
        type: String,
        enum: [
          "window",
          "fireplace",
          "ocean-view",
          "garden-view",
          "wheelchair-accessible",
          "booth",
          "high-top",
        ],
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const MenuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide item name"],
    },
    description: {
      type: String,
      maxlength: [300, "Description cannot exceed 300 characters"],
    },
    category: {
      type: String,
      enum: [
        "appetizer",
        "main",
        "dessert",
        "beverage",
        "wine",
        "cocktail",
        "breakfast",
        "lunch",
        "dinner",
      ],
      required: [true, "Please specify item category"],
    },
    price: {
      type: Number,
      required: [true, "Please provide item price"],
      min: 0,
    },
    image: {
      url: String,
      alt: String,
    },
    ingredients: [String],
    allergens: [
      {
        type: String,
        enum: ["nuts", "dairy", "gluten", "eggs", "shellfish", "soy", "fish"],
      },
    ],
    dietary: [
      {
        type: String,
        enum: [
          "vegetarian",
          "vegan",
          "gluten-free",
          "keto",
          "paleo",
          "halal",
          "kosher",
        ],
      },
    ],
    isAvailable: {
      type: Boolean,
      default: true,
    },
    preparationTime: {
      type: Number, // in minutes
      default: 15,
    },
  },
  {
    timestamps: true,
  }
);

const RestaurantReservationSchema = new mongoose.Schema(
  {
    reservationId: {
      type: String,
      required: true,
      unique: true,
    },
    guest: {
      name: {
        type: String,
        required: [true, "Guest name is required"],
      },
      email: {
        type: String,
        required: [true, "Guest email is required"],
      },
      phone: {
        type: String,
        required: [true, "Guest phone is required"],
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
    table: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RestaurantTable",
      required: [true, "Table is required"],
    },
    date: {
      type: Date,
      required: [true, "Reservation date is required"],
    },
    time: {
      type: String,
      required: [true, "Reservation time is required"],
    },
    partySize: {
      type: Number,
      required: [true, "Party size is required"],
      min: 1,
    },
    duration: {
      type: Number, // in minutes
      default: 120,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "seated",
        "completed",
        "cancelled",
        "noShow",
      ],
      default: "pending",
    },
    specialRequests: {
      type: String,
      maxlength: [500, "Special requests cannot exceed 500 characters"],
    },
    occasion: {
      type: String,
      enum: [
        "birthday",
        "anniversary",
        "business",
        "date",
        "family",
        "celebration",
        "other",
      ],
    },
    preOrder: [
      {
        item: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "MenuItem",
        },
        quantity: Number,
        notes: String,
      },
    ],
    staff: {
      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      assignedWaiter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
    notes: [
      {
        text: String,
        createdBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes
RestaurantTableSchema.index({ capacity: 1, status: 1 });

MenuItemSchema.index({ category: 1, isAvailable: 1 });
MenuItemSchema.index({ name: "text", description: "text" });

RestaurantReservationSchema.index({ date: 1, time: 1 });
RestaurantReservationSchema.index({ "guest.email": 1 });
RestaurantReservationSchema.index({ status: 1 });

// Generate reservation ID
RestaurantReservationSchema.pre("save", function (next) {
  if (!this.reservationId) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    this.reservationId = `RST${year}${month}${day}${random}`;
  }
  next();
});

export const RestaurantTable =
  mongoose.models.RestaurantTable ||
  mongoose.model("RestaurantTable", RestaurantTableSchema);
export const MenuItem =
  mongoose.models.MenuItem || mongoose.model("MenuItem", MenuItemSchema);
export const RestaurantReservation =
  mongoose.models.RestaurantReservation ||
  mongoose.model("RestaurantReservation", RestaurantReservationSchema);
