import mongoose from "mongoose";

const GallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Gallery item title is required"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    imageUrl: {
      type: String,
      required: [true, "Image URL is required"],
    },
    thumbnailUrl: {
      type: String,
      required: [true, "Thumbnail URL is required"],
    },
    altText: {
      type: String,
      required: [true, "Alt text is required for accessibility"],
      maxlength: [200, "Alt text cannot exceed 200 characters"],
    },
    category: {
      type: String,
      enum: [
        "hotel-exterior",
        "hotel-interior",
        "rooms",
        "suites",
        "restaurant",
        "bar",
        "spa",
        "gym",
        "pool",
        "conference",
        "events",
        "wedding",
        "garden",
        "amenities",
        "lobby",
        "views",
        "other",
      ],
      required: [true, "Category is required"],
    },
    tags: [
      {
        type: String,
        maxlength: [50, "Tag cannot exceed 50 characters"],
      },
    ],
    location: {
      type: String,
      maxlength: [100, "Location cannot exceed 100 characters"],
    },
    photographer: {
      type: String,
      maxlength: [100, "Photographer name cannot exceed 100 characters"],
    },
    dateTaken: {
      type: Date,
    },
    dimensions: {
      width: {
        type: Number,
        min: [1, "Width must be at least 1 pixel"],
      },
      height: {
        type: Number,
        min: [1, "Height must be at least 1 pixel"],
      },
    },
    fileSize: {
      type: Number, // in bytes
      min: [0, "File size cannot be negative"],
    },
    mimeType: {
      type: String,
      enum: ["image/jpeg", "image/png", "image/webp", "image/gif"],
      required: [true, "MIME type is required"],
    },
    isHero: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    viewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Uploader information is required"],
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    approvedAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "archived"],
      default: "pending",
    },
    rejectionReason: {
      type: String,
      maxlength: [300, "Rejection reason cannot exceed 300 characters"],
    },
    metadata: {
      camera: String,
      lens: String,
      settings: String,
      iso: Number,
      aperture: String,
      shutterSpeed: String,
      focalLength: String,
    },
    socialMedia: {
      allowInstagram: {
        type: Boolean,
        default: true,
      },
      allowFacebook: {
        type: Boolean,
        default: true,
      },
      allowTwitter: {
        type: Boolean,
        default: true,
      },
      allowWebsite: {
        type: Boolean,
        default: true,
      },
    },
    seoData: {
      slug: {
        type: String,
        unique: true,
        sparse: true,
      },
      metaTitle: {
        type: String,
        maxlength: [60, "Meta title cannot exceed 60 characters"],
      },
      metaDescription: {
        type: String,
        maxlength: [160, "Meta description cannot exceed 160 characters"],
      },
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
GallerySchema.index({ category: 1 });
GallerySchema.index({ status: 1 });
GallerySchema.index({ isPublic: 1 });
GallerySchema.index({ isFeatured: 1 });
GallerySchema.index({ isHero: 1 });
GallerySchema.index({ displayOrder: 1 });
GallerySchema.index({ tags: 1 });
GallerySchema.index({ createdAt: -1 });
GallerySchema.index({ "seoData.slug": 1 });

// Pre-save middleware to generate slug
GallerySchema.pre("save", function (next) {
  if (!this.seoData.slug && this.title) {
    this.seoData.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }
  next();
});

// Virtual for formatted file size
GallerySchema.virtual("formattedFileSize").get(function () {
  if (this.fileSize) {
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(this.fileSize) / Math.log(1024));
    return (
      Math.round((this.fileSize / Math.pow(1024, i)) * 100) / 100 +
      " " +
      sizes[i]
    );
  }
  return null;
});

// Virtual for aspect ratio
GallerySchema.virtual("aspectRatio").get(function () {
  if (this.dimensions && this.dimensions.width && this.dimensions.height) {
    return (this.dimensions.width / this.dimensions.height).toFixed(2);
  }
  return null;
});

// Virtual for image orientation
GallerySchema.virtual("orientation").get(function () {
  if (this.dimensions && this.dimensions.width && this.dimensions.height) {
    if (this.dimensions.width > this.dimensions.height) {
      return "landscape";
    } else if (this.dimensions.width < this.dimensions.height) {
      return "portrait";
    } else {
      return "square";
    }
  }
  return null;
});

// Method to increment view count
GallerySchema.methods.incrementViewCount = function () {
  this.viewCount += 1;
  return this.save();
};

// Method to check if image is high resolution
GallerySchema.methods.isHighResolution = function () {
  if (this.dimensions && this.dimensions.width && this.dimensions.height) {
    const totalPixels = this.dimensions.width * this.dimensions.height;
    return totalPixels >= 1920 * 1080; // 1080p or higher
  }
  return false;
};

// Method to get image info summary
GallerySchema.methods.getImageInfo = function () {
  return {
    title: this.title,
    dimensions: `${this.dimensions?.width || 0} × ${
      this.dimensions?.height || 0
    }`,
    fileSize: this.formattedFileSize,
    mimeType: this.mimeType,
    aspectRatio: this.aspectRatio,
    orientation: this.orientation,
    isHighRes: this.isHighResolution(),
  };
};

// Static method to get featured images
GallerySchema.statics.getFeaturedImages = function (limit = 10) {
  return this.find({
    isFeatured: true,
    isPublic: true,
    status: "approved",
    isActive: true,
  })
    .sort({ displayOrder: 1, createdAt: -1 })
    .limit(limit);
};

// Static method to get images by category
GallerySchema.statics.getByCategory = function (category, limit = 20) {
  return this.find({
    category: category,
    isPublic: true,
    status: "approved",
    isActive: true,
  })
    .sort({ displayOrder: 1, createdAt: -1 })
    .limit(limit);
};

export default mongoose.models.Gallery ||
  mongoose.model("Gallery", GallerySchema);
