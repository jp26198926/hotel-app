import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      required: true,
      unique: true,
    },
    guest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Guest information is required"],
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: [true, "Room information is required"],
    },
    checkIn: {
      type: Date,
      required: [true, "Check-in date is required"],
    },
    checkOut: {
      type: Date,
      required: [true, "Check-out date is required"],
    },
    guests: {
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
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "checkedIn",
        "checkedOut",
        "cancelled",
        "noShow",
      ],
      default: "pending",
    },
    payment: {
      amount: {
        type: Number,
        required: true,
      },
      currency: {
        type: String,
        default: "USD",
      },
      method: {
        type: String,
        enum: ["cash", "card", "transfer", "online"],
        required: true,
      },
      status: {
        type: String,
        enum: ["pending", "paid", "partial", "refunded"],
        default: "pending",
      },
      transactionId: String,
    },
    specialRequests: {
      type: String,
      maxlength: [500, "Special requests cannot exceed 500 characters"],
    },
    services: [
      {
        name: String,
        price: Number,
        quantity: Number,
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    discounts: [
      {
        type: String,
        amount: Number,
        percentage: Number,
      },
    ],
    staff: {
      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      assignedTo: {
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

// Indexes for better query performance
BookingSchema.index({ bookingId: 1 });
BookingSchema.index({ guest: 1 });
BookingSchema.index({ room: 1 });
BookingSchema.index({ checkIn: 1, checkOut: 1 });
BookingSchema.index({ status: 1 });

// Virtual for booking duration
BookingSchema.virtual("duration").get(function () {
  return Math.ceil((this.checkOut - this.checkIn) / (1000 * 60 * 60 * 24));
});

// Generate booking ID before saving
BookingSchema.pre("save", function (next) {
  if (!this.bookingId) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    this.bookingId = `BK${year}${month}${day}${random}`;
  }
  next();
});

export default mongoose.models.Booking ||
  mongoose.model("Booking", BookingSchema);
