import mongoose from "mongoose";

const PaymentTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Payment type name is required"],
      unique: true,
    },
    slug: {
      type: String,
      required: [true, "Payment type slug is required"],
      unique: true,
    },
    description: {
      type: String,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    category: {
      type: String,
      enum: [
        "cash",
        "card",
        "digital",
        "bank_transfer",
        "check",
        "crypto",
        "other",
      ],
      required: [true, "Payment category is required"],
    },
    method: {
      type: String,
      enum: [
        "cash",
        "credit_card",
        "debit_card",
        "bank_transfer",
        "paypal",
        "stripe",
        "mobile_money",
        "check",
        "bitcoin",
        "gift_card",
        "loyalty_points",
        "other",
      ],
      required: [true, "Payment method is required"],
    },
    processor: {
      name: String, // e.g., "Stripe", "PayPal", "Bank of PNG"
      apiEndpoint: String,
      merchantId: String,
      isThirdParty: {
        type: Boolean,
        default: false,
      },
    },
    fees: {
      hasProcessingFee: {
        type: Boolean,
        default: false,
      },
      feeType: {
        type: String,
        enum: ["fixed", "percentage", "both"],
      },
      fixedFee: {
        type: Number,
        default: 0,
      },
      percentageFee: {
        type: Number,
        default: 0,
      },
      minimumFee: {
        type: Number,
        default: 0,
      },
      maximumFee: {
        type: Number,
        default: 0,
      },
    },
    limits: {
      minimumAmount: {
        type: Number,
        default: 0,
      },
      maximumAmount: {
        type: Number,
        default: 0, // 0 means no limit
      },
      dailyLimit: {
        type: Number,
        default: 0, // 0 means no limit
      },
      monthlyLimit: {
        type: Number,
        default: 0, // 0 means no limit
      },
    },
    currencies: {
      type: [String],
      default: ["PGK"],
    },
    configuration: {
      requiresAuth: {
        type: Boolean,
        default: false,
      },
      requiresSignature: {
        type: Boolean,
        default: false,
      },
      allowsRefund: {
        type: Boolean,
        default: true,
      },
      allowsPartialRefund: {
        type: Boolean,
        default: true,
      },
      settlementTime: {
        type: String, // e.g., "instant", "1-2 business days"
      },
    },
    validation: {
      requiresCardNumber: {
        type: Boolean,
        default: false,
      },
      requiresExpiryDate: {
        type: Boolean,
        default: false,
      },
      requiresCVV: {
        type: Boolean,
        default: false,
      },
      requiresBillingAddress: {
        type: Boolean,
        default: false,
      },
    },
    availability: {
      online: {
        type: Boolean,
        default: true,
      },
      inPerson: {
        type: Boolean,
        default: true,
      },
      mobile: {
        type: Boolean,
        default: false,
      },
      recurring: {
        type: Boolean,
        default: false,
      },
    },
    icon: {
      type: String, // URL or icon class
    },
    color: {
      type: String,
      default: "#000000",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
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

PaymentTypeSchema.index({ slug: 1 });
PaymentTypeSchema.index({ category: 1, isActive: 1 });
PaymentTypeSchema.index({ isActive: 1, sortOrder: 1 });
PaymentTypeSchema.index({ method: 1 });

export default mongoose.models.PaymentType ||
  mongoose.model("PaymentType", PaymentTypeSchema);
