import { z } from "zod";

// User schemas
export const userRegistrationSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(60, "Name cannot exceed 60 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z
    .enum(["admin", "manager", "receptionist", "staff", "guest"])
    .default("guest"),
  phone: z.string().optional(),
  address: z
    .object({
      street: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      zipCode: z.string().optional(),
      country: z.string().optional(),
    })
    .optional(),
});

export const userLoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

// Room schemas
export const roomSchema = z.object({
  roomNumber: z.string().min(1, "Room number is required"),
  type: z.enum(["standard", "deluxe", "suite", "presidential"]),
  category: z.enum(["single", "double", "twin", "family", "executive"]),
  floor: z.number().min(1, "Floor must be at least 1"),
  capacity: z.object({
    adults: z.number().min(1, "At least 1 adult capacity required"),
    children: z.number().min(0).default(0),
  }),
  amenities: z
    .array(
      z.enum([
        "wifi",
        "tv",
        "ac",
        "minibar",
        "balcony",
        "seaView",
        "cityView",
        "kitchenette",
        "jacuzzi",
        "fireplace",
      ])
    )
    .default([]),
  price: z.object({
    base: z.number().min(0, "Price must be positive"),
    weekend: z.number().optional(),
    holiday: z.number().optional(),
  }),
  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),
  size: z.number().optional(),
  bedType: z.enum(["single", "double", "queen", "king", "twin"]),
});

// Booking schemas
export const bookingSchema = z
  .object({
    guest: z.string().min(1, "Guest is required"),
    room: z.string().min(1, "Room is required"),
    checkIn: z.string().transform((str) => new Date(str)),
    checkOut: z.string().transform((str) => new Date(str)),
    guests: z.object({
      adults: z.number().min(1, "At least 1 adult required"),
      children: z.number().min(0).default(0),
    }),
    payment: z.object({
      method: z.enum(["cash", "card", "transfer", "online"]),
      amount: z.number().min(0, "Amount must be positive"),
    }),
    specialRequests: z
      .string()
      .max(500, "Special requests cannot exceed 500 characters")
      .optional(),
  })
  .refine((data) => data.checkOut > data.checkIn, {
    message: "Check-out date must be after check-in date",
    path: ["checkOut"],
  });

// Restaurant schemas
export const restaurantTableSchema = z.object({
  tableNumber: z.string().min(1, "Table number is required"),
  capacity: z
    .number()
    .min(1, "Capacity must be at least 1")
    .max(12, "Capacity cannot exceed 12"),
  location: z.enum(["indoor", "outdoor", "private", "bar", "terrace"]),
  features: z
    .array(
      z.enum([
        "window",
        "fireplace",
        "ocean-view",
        "garden-view",
        "wheelchair-accessible",
        "booth",
        "high-top",
      ])
    )
    .default([]),
});

export const menuItemSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  description: z
    .string()
    .max(300, "Description cannot exceed 300 characters")
    .optional(),
  category: z.enum([
    "appetizer",
    "main",
    "dessert",
    "beverage",
    "wine",
    "cocktail",
    "breakfast",
    "lunch",
    "dinner",
  ]),
  price: z.number().min(0, "Price must be positive"),
  ingredients: z.array(z.string()).default([]),
  allergens: z
    .array(
      z.enum(["nuts", "dairy", "gluten", "eggs", "shellfish", "soy", "fish"])
    )
    .default([]),
  dietary: z
    .array(
      z.enum([
        "vegetarian",
        "vegan",
        "gluten-free",
        "keto",
        "paleo",
        "halal",
        "kosher",
      ])
    )
    .default([]),
  preparationTime: z
    .number()
    .min(1, "Preparation time must be at least 1 minute")
    .default(15),
});

export const restaurantReservationSchema = z.object({
  guest: z.object({
    name: z.string().min(2, "Guest name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().min(10, "Please enter a valid phone number"),
  }),
  table: z.string().min(1, "Table is required"),
  date: z.string().transform((str) => new Date(str)),
  time: z
    .string()
    .regex(
      /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      "Please enter a valid time in HH:MM format"
    ),
  partySize: z.number().min(1, "Party size must be at least 1"),
  duration: z
    .number()
    .min(30, "Duration must be at least 30 minutes")
    .default(120),
  specialRequests: z
    .string()
    .max(500, "Special requests cannot exceed 500 characters")
    .optional(),
  occasion: z
    .enum([
      "birthday",
      "anniversary",
      "business",
      "date",
      "family",
      "celebration",
      "other",
    ])
    .optional(),
});
