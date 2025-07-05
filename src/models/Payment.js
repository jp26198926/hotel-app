import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    paymentNumber: {
      type: String,
      required: [true, "Payment number is required"],
      unique: true,
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true, // Allows null values while maintaining uniqueness
    },
    externalTransactionId: {
      type: String, // Transaction ID from payment processor
    },
    relatedTo: {
      type: {
        type: String,
        enum: ["booking", "event", "restaurant_order", "service", "other"],
        required: [true, "Payment relation type is required"],
      },
      id: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Related document ID is required"],
        refPath: "relatedTo.type",
      },
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Customer is required"],
    },
    paymentType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PaymentType",
      required: [true, "Payment type is required"],
    },
    amount: {
      subtotal: {
        type: Number,
        required: [true, "Subtotal is required"],
        min: [0, "Subtotal cannot be negative"],
      },
      taxes: {
        type: Number,
        default: 0,
        min: [0, "Taxes cannot be negative"],
      },
      fees: {
        type: Number,
        default: 0,
        min: [0, "Fees cannot be negative"],
      },
      discounts: {
        type: Number,
        default: 0,
        min: [0, "Discounts cannot be negative"],
      },
      total: {
        type: Number,
        required: [true, "Total amount is required"],
        min: [0, "Total amount cannot be negative"],
      },
      currency: {
        type: String,
        required: [true, "Currency is required"],
        default: "PGK",
      },
    },
    paymentDetails: {
      cardType: {
        type: String,
        enum: ["visa", "mastercard", "amex", "discover", "other"],
      },
      cardLast4: String,
      cardExpiry: String,
      bankName: String,
      accountNumber: String, // Last 4 digits only
      checkNumber: String,
      mobileMoneyProvider: String,
      mobileMoneyNumber: String,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "processing",
        "completed",
        "failed",
        "cancelled",
        "refunded",
        "partially_refunded",
      ],
      default: "pending",
    },
    paymentDate: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
    },
    processedDate: {
      type: Date,
    },
    refunds: [
      {
        refundId: String,
        amount: {
          type: Number,
          required: true,
          min: [0, "Refund amount cannot be negative"],
        },
        reason: {
          type: String,
          required: true,
        },
        processedDate: {
          type: Date,
          default: Date.now,
        },
        processedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        externalRefundId: String,
        status: {
          type: String,
          enum: ["pending", "completed", "failed"],
          default: "pending",
        },
      },
    ],
    gateway: {
      provider: String, // e.g., "stripe", "paypal"
      response: {
        type: mongoose.Schema.Types.Mixed, // Store gateway response
      },
      webhookData: {
        type: mongoose.Schema.Types.Mixed, // Store webhook data
      },
    },
    receipt: {
      receiptNumber: String,
      receiptUrl: String,
      emailSent: {
        type: Boolean,
        default: false,
      },
      printedCopies: {
        type: Number,
        default: 0,
      },
    },
    reconciliation: {
      isReconciled: {
        type: Boolean,
        default: false,
      },
      reconciledDate: Date,
      reconciledBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      bankStatementRef: String,
    },
    notes: {
      customer: {
        type: String,
        maxlength: [500, "Customer notes cannot exceed 500 characters"],
      },
      internal: {
        type: String,
        maxlength: [1000, "Internal notes cannot exceed 1000 characters"],
      },
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed, // Flexible field for additional data
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

// Calculate total amount before saving
PaymentSchema.pre("save", function (next) {
  this.amount.total =
    this.amount.subtotal +
    this.amount.taxes +
    this.amount.fees -
    this.amount.discounts;
  next();
});

PaymentSchema.index({ customer: 1, status: 1 });
PaymentSchema.index({ "relatedTo.type": 1, "relatedTo.id": 1 });
PaymentSchema.index({ status: 1, paymentDate: -1 });
PaymentSchema.index({ paymentDate: -1 });
PaymentSchema.index({ "amount.currency": 1, paymentDate: -1 });

export default mongoose.models.Payment ||
  mongoose.model("Payment", PaymentSchema);
