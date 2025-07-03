import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema(
  {
    orderTransaction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrderTransaction",
      required: [true, "Order transaction reference is required"],
    },
    menuItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MenuItem",
      required: [true, "Menu item reference is required"],
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity must be at least 1"],
    },
    unitPrice: {
      type: Number,
      required: true,
      min: [0, "Unit price cannot be negative"],
    },
    totalPrice: {
      type: Number,
      required: true,
      min: [0, "Total price cannot be negative"],
    },
    customizations: [
      {
        name: {
          type: String,
          required: true,
        },
        value: {
          type: String,
          required: true,
        },
        additionalCost: {
          type: Number,
          default: 0,
          min: 0,
        },
      },
    ],
    specialInstructions: {
      type: String,
      maxlength: [300, "Special instructions cannot exceed 300 characters"],
    },
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "preparing",
        "ready",
        "served",
        "cancelled",
      ],
      default: "pending",
    },
    preparationTime: {
      type: Number, // in minutes
      min: 0,
    },
    actualPreparationTime: {
      type: Number, // in minutes
      min: 0,
    },
    preparedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    servedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    preparedAt: {
      type: Date,
    },
    servedAt: {
      type: Date,
    },
    notes: {
      type: String,
      maxlength: [500, "Notes cannot exceed 500 characters"],
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
OrderItemSchema.index({ orderTransaction: 1 });
OrderItemSchema.index({ menuItem: 1 });
OrderItemSchema.index({ status: 1 });
OrderItemSchema.index({ createdAt: -1 });

// Pre-save middleware to calculate total price
OrderItemSchema.pre("save", function (next) {
  // Calculate total customization cost
  const customizationCost = this.customizations.reduce(
    (total, customization) => {
      return total + (customization.additionalCost || 0);
    },
    0
  );

  // Calculate total price including customizations
  this.totalPrice = (this.unitPrice + customizationCost) * this.quantity;
  next();
});

// Virtual for formatted preparation time
OrderItemSchema.virtual("formattedPreparationTime").get(function () {
  if (this.preparationTime) {
    const hours = Math.floor(this.preparationTime / 60);
    const minutes = this.preparationTime % 60;
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }
  return null;
});

// Virtual for preparation efficiency
OrderItemSchema.virtual("preparationEfficiency").get(function () {
  if (this.preparationTime && this.actualPreparationTime) {
    const efficiency =
      (this.preparationTime / this.actualPreparationTime) * 100;
    return Math.round(efficiency);
  }
  return null;
});

// Virtual for customization summary
OrderItemSchema.virtual("customizationSummary").get(function () {
  if (this.customizations && this.customizations.length > 0) {
    return this.customizations.map((c) => `${c.name}: ${c.value}`).join(", ");
  }
  return null;
});

// Method to check if item is customized
OrderItemSchema.methods.isCustomized = function () {
  return this.customizations && this.customizations.length > 0;
};

// Method to get total customization cost
OrderItemSchema.methods.getTotalCustomizationCost = function () {
  return this.customizations.reduce((total, customization) => {
    return total + (customization.additionalCost || 0);
  }, 0);
};

export default mongoose.models.OrderItem ||
  mongoose.model("OrderItem", OrderItemSchema);
