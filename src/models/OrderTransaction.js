import mongoose from "mongoose";

const OrderTransactionSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Customer information is required"],
    },
    orderType: {
      type: String,
      enum: ["dine-in", "takeaway", "room-service", "delivery"],
      required: true,
    },
    tableNumber: {
      type: String,
      required: function () {
        return this.orderType === "dine-in";
      },
    },
    roomNumber: {
      type: String,
      required: function () {
        return this.orderType === "room-service";
      },
    },
    deliveryAddress: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
      phone: String,
      notes: String,
    },
    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "OrderItem",
        required: true,
      },
    ],
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    tax: {
      type: Number,
      required: true,
      min: 0,
    },
    serviceCharge: {
      type: Number,
      default: 0,
      min: 0,
    },
    deliveryCharge: {
      type: Number,
      default: 0,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "partial", "paid", "refunded", "failed"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "digital-wallet", "bank-transfer", "room-charge"],
      required: function () {
        return (
          this.paymentStatus === "paid" || this.paymentStatus === "partial"
        );
      },
    },
    orderStatus: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "preparing",
        "ready",
        "delivered",
        "completed",
        "cancelled",
      ],
      default: "pending",
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
    estimatedDeliveryTime: {
      type: Date,
      required: function () {
        return (
          this.orderType === "delivery" || this.orderType === "room-service"
        );
      },
    },
    actualDeliveryTime: {
      type: Date,
    },
    specialInstructions: {
      type: String,
      maxlength: [500, "Special instructions cannot exceed 500 characters"],
    },
    staffAssigned: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    review: {
      type: String,
      maxlength: [1000, "Review cannot exceed 1000 characters"],
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

// Indexes for better query performance
OrderTransactionSchema.index({ orderId: 1 });
OrderTransactionSchema.index({ customer: 1 });
OrderTransactionSchema.index({ orderStatus: 1 });
OrderTransactionSchema.index({ orderDate: -1 });
OrderTransactionSchema.index({ paymentStatus: 1 });

// Pre-save middleware to generate orderId
OrderTransactionSchema.pre("save", async function (next) {
  if (!this.orderId) {
    const date = new Date();
    const dateString = date.toISOString().slice(0, 10).replace(/-/g, "");
    const randomNum = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    this.orderId = `ORD-${dateString}-${randomNum}`;
  }
  next();
});

// Virtual for formatted order date
OrderTransactionSchema.virtual("formattedOrderDate").get(function () {
  return this.orderDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
});

// Virtual for order duration
OrderTransactionSchema.virtual("orderDuration").get(function () {
  if (this.actualDeliveryTime) {
    const duration = this.actualDeliveryTime - this.orderDate;
    return Math.floor(duration / (1000 * 60)); // duration in minutes
  }
  return null;
});

export default mongoose.models.OrderTransaction ||
  mongoose.model("OrderTransaction", OrderTransactionSchema);
