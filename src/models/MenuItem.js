import mongoose from "mongoose";

const MenuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Menu item name is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Menu item slug is required"],
      unique: true,
    },
    description: {
      type: String,
      required: [true, "Menu item description is required"],
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    shortDescription: {
      type: String,
      maxlength: [100, "Short description cannot exceed 100 characters"],
    },
    category: {
      main: {
        type: String,
        enum: ["food", "beverage"],
        required: [true, "Main category is required"],
      },
      sub: {
        type: String,
        enum: [
          // Food categories
          "appetizer",
          "soup",
          "salad",
          "main_course",
          "side_dish",
          "dessert",
          "breakfast",
          "lunch",
          "dinner",
          // Beverage categories
          "soft_drink",
          "juice",
          "coffee",
          "tea",
          "alcoholic",
          "cocktail",
          "wine",
          "beer",
          "water",
          "smoothie",
        ],
        required: [true, "Sub category is required"],
      },
      cuisine: {
        type: String,
        enum: [
          "international",
          "local",
          "asian",
          "european",
          "american",
          "fusion",
          "vegetarian",
          "vegan",
        ],
      },
    },
    pricing: {
      basePrice: {
        type: Number,
        required: [true, "Base price is required"],
        min: [0, "Price cannot be negative"],
      },
      sizes: [
        {
          name: {
            type: String,
            required: true,
          },
          price: {
            type: Number,
            required: true,
            min: [0, "Size price cannot be negative"],
          },
          description: String,
        },
      ],
      currency: {
        type: String,
        default: "PGK",
      },
    },
    ingredients: [
      {
        name: {
          type: String,
          required: true,
        },
        isAllergen: {
          type: Boolean,
          default: false,
        },
        isOptional: {
          type: Boolean,
          default: false,
        },
      },
    ],
    allergens: [
      {
        type: String,
        enum: [
          "nuts",
          "dairy",
          "eggs",
          "soy",
          "wheat",
          "shellfish",
          "fish",
          "sesame",
          "mustard",
        ],
      },
    ],
    dietary: [
      {
        type: String,
        enum: [
          "vegetarian",
          "vegan",
          "gluten_free",
          "dairy_free",
          "nut_free",
          "halal",
          "kosher",
          "keto",
          "low_carb",
        ],
      },
    ],
    nutritional: {
      calories: Number,
      protein: Number, // in grams
      carbs: Number, // in grams
      fat: Number, // in grams
      fiber: Number, // in grams
      sugar: Number, // in grams
      sodium: Number, // in mg
    },
    preparation: {
      preparationTime: {
        type: Number, // in minutes
        required: [true, "Preparation time is required"],
      },
      cookingMethod: {
        type: String,
        enum: [
          "grilled",
          "fried",
          "baked",
          "steamed",
          "boiled",
          "raw",
          "mixed",
          "other",
        ],
      },
      spiceLevel: {
        type: String,
        enum: ["none", "mild", "medium", "hot", "extra_hot"],
        default: "none",
      },
      temperature: {
        type: String,
        enum: ["hot", "cold", "room_temperature", "frozen"],
        default: "hot",
      },
    },
    customization: {
      allowCustomization: {
        type: Boolean,
        default: false,
      },
      options: [
        {
          name: String,
          choices: [
            {
              name: String,
              additionalCost: {
                type: Number,
                default: 0,
              },
            },
          ],
          required: {
            type: Boolean,
            default: false,
          },
          multipleChoice: {
            type: Boolean,
            default: false,
          },
        },
      ],
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        alt: {
          type: String,
          required: true,
        },
        isPrimary: {
          type: Boolean,
          default: false,
        },
        caption: String,
      },
    ],
    availability: {
      isAvailable: {
        type: Boolean,
        default: true,
      },
      availableDays: [
        {
          type: String,
          enum: [
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
            "sunday",
          ],
        },
      ],
      availableHours: {
        start: String, // e.g., "06:00"
        end: String, // e.g., "22:00"
      },
      seasonal: {
        isSeasonalItem: {
          type: Boolean,
          default: false,
        },
        availableFrom: Date,
        availableTo: Date,
      },
    },
    inventory: {
      trackInventory: {
        type: Boolean,
        default: false,
      },
      currentStock: {
        type: Number,
        default: 0,
      },
      minimumStock: {
        type: Number,
        default: 0,
      },
      unit: {
        type: String,
        enum: ["piece", "serving", "kg", "liter", "bottle", "glass"],
        default: "serving",
      },
    },
    ratings: {
      averageRating: {
        type: Number,
        default: 0,
        min: [0, "Rating cannot be negative"],
        max: [5, "Rating cannot exceed 5"],
      },
      totalReviews: {
        type: Number,
        default: 0,
      },
    },
    chef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    notes: {
      internal: {
        type: String,
        maxlength: [500, "Internal notes cannot exceed 500 characters"],
      },
      serving: {
        type: String,
        maxlength: [200, "Serving notes cannot exceed 200 characters"],
      },
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

MenuItemSchema.index({ slug: 1 });
MenuItemSchema.index({ "category.main": 1, "category.sub": 1, isActive: 1 });
MenuItemSchema.index({ isActive: 1, sortOrder: 1 });
MenuItemSchema.index({ isFeatured: 1, isActive: 1 });
MenuItemSchema.index({ isPopular: 1, isActive: 1 });
MenuItemSchema.index({ "pricing.basePrice": 1 });

export default mongoose.models.MenuItem ||
  mongoose.model("MenuItem", MenuItemSchema);
