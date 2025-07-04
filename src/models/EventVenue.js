import mongoose from "mongoose";

const EventVenueSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Venue name is required"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    subtitle: {
      type: String,
      maxlength: [200, "Subtitle cannot exceed 200 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    imageUrl: {
      type: String,
      required: [true, "Image URL is required"],
    },
    capacity: {
      type: String,
      required: [true, "Capacity is required"],
      maxlength: [50, "Capacity cannot exceed 50 characters"],
    },
    features: [
      {
        type: String,
        maxlength: [200, "Feature cannot exceed 200 characters"],
      },
    ],
    buttonText: {
      type: String,
      default: "Book Event Space",
      maxlength: [50, "Button text cannot exceed 50 characters"],
    },
    buttonColor: {
      type: String,
      enum: ["red", "orange", "blue", "green", "purple", "indigo"],
      default: "red",
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    category: {
      type: String,
      enum: [
        "ballroom",
        "conference",
        "meeting",
        "banquet",
        "outdoor",
        "other",
      ],
      default: "other",
    },
    pricing: {
      halfDay: {
        type: Number,
        min: [0, "Price cannot be negative"],
      },
      fullDay: {
        type: Number,
        min: [0, "Price cannot be negative"],
      },
      hourly: {
        type: Number,
        min: [0, "Price cannot be negative"],
      },
    },
    amenities: {
      audioVisual: {
        type: Boolean,
        default: false,
      },
      wifi: {
        type: Boolean,
        default: true,
      },
      catering: {
        type: Boolean,
        default: false,
      },
      parking: {
        type: Boolean,
        default: true,
      },
      airConditioning: {
        type: Boolean,
        default: true,
      },
      projector: {
        type: Boolean,
        default: false,
      },
    },
    contactInfo: {
      email: {
        type: String,
        match: [
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
          "Please enter a valid email",
        ],
      },
      phone: {
        type: String,
        maxlength: [20, "Phone number cannot exceed 20 characters"],
      },
    },
    seoData: {
      metaTitle: {
        type: String,
        maxlength: [60, "Meta title cannot exceed 60 characters"],
      },
      metaDescription: {
        type: String,
        maxlength: [160, "Meta description cannot exceed 160 characters"],
      },
      keywords: [
        {
          type: String,
          maxlength: [50, "Keyword cannot exceed 50 characters"],
        },
      ],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
EventVenueSchema.index({ displayOrder: 1, createdAt: -1 });
EventVenueSchema.index({ isActive: 1, isFeatured: -1 });
EventVenueSchema.index({ category: 1 });

// Virtual for formatted capacity
EventVenueSchema.virtual("formattedCapacity").get(function () {
  return `Capacity: ${this.capacity}`;
});

// Virtual for pricing display
EventVenueSchema.virtual("priceRange").get(function () {
  const prices = [
    this.pricing?.hourly,
    this.pricing?.halfDay,
    this.pricing?.fullDay,
  ].filter(Boolean);
  if (prices.length === 0) return "Contact for pricing";
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return min === max ? `$${min}` : `$${min} - $${max}`;
});

// Methods
EventVenueSchema.methods.getButtonColorClass = function () {
  const colorMap = {
    red: "bg-red-700 hover:bg-red-800",
    orange: "bg-orange-500 hover:bg-orange-600",
    blue: "bg-blue-600 hover:bg-blue-700",
    green: "bg-green-600 hover:bg-green-700",
    purple: "bg-purple-600 hover:bg-purple-700",
    indigo: "bg-indigo-600 hover:bg-indigo-700",
  };
  return colorMap[this.buttonColor] || colorMap.red;
};

EventVenueSchema.methods.getFeatureIconColor = function () {
  const colorMap = {
    red: "text-red-700",
    orange: "text-orange-500",
    blue: "text-blue-600",
    green: "text-green-600",
    purple: "text-purple-600",
    indigo: "text-indigo-600",
  };
  return colorMap[this.buttonColor] || colorMap.red;
};

// Static methods
EventVenueSchema.statics.getActiveVenues = function () {
  return this.find({ isActive: true }).sort({ displayOrder: 1, createdAt: -1 });
};

EventVenueSchema.statics.getFeaturedVenues = function () {
  return this.find({ isActive: true, isFeatured: true }).sort({
    displayOrder: 1,
  });
};

const EventVenue =
  mongoose.models.EventVenue || mongoose.model("EventVenue", EventVenueSchema);

export default EventVenue;
