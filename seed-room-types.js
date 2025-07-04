import dotenv from "dotenv";
import mongoose from "mongoose";

// Load environment variables
dotenv.config({ path: ".env.local" });

// Set environment variable manually for testing
if (!process.env.MONGODB_URI) {
  process.env.MONGODB_URI = "mongodb://localhost:27017/hotelms";
}

// Import after setting environment variables
const { default: RoomType } = await import("./src/models/RoomType.js");

const seedRoomTypes = [
  {
    name: "Standard Room",
    slug: "standard-room",
    description:
      "Comfortable room with modern amenities and complimentary breakfast. Perfect for couples or business travelers seeking quality accommodation with essential amenities.",
    shortDescription:
      "Comfortable room with modern amenities and complimentary breakfast",
    pricing: {
      basePrice: 510,
      weekendPrice: 560,
      holidayPrice: 620,
      currency: "PGK",
    },
    capacity: {
      adults: 2,
      children: 0,
      maxGuests: 2,
    },
    bedConfiguration: {
      bedType: "queen",
      bedCount: 1,
      sofa: false,
    },
    roomSize: 320,
    amenities: [
      "wifi",
      "tv",
      "ac",
      "minibar",
      "breakfast",
      "gymAccess",
      "safe",
      "hairdryer",
      "toiletries",
      "workDesk",
      "coffeemaker",
      "telephone",
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        alt: "Standard Hotel Room",
        isPrimary: true,
        caption: "Comfortable standard room with modern amenities",
      },
    ],
    inclusions: [
      "Complimentary breakfast",
      "Free fitness room access",
      "Complimentary Wi-Fi",
      "Daily housekeeping",
      "Basic toiletries",
    ],
    features: [
      "Modern amenities",
      "Comfortable bedding",
      "Climate control",
      "Work area",
      "City views",
    ],
    policies: {
      smoking: "notAllowed",
      pets: "notAllowed",
      extraBed: {
        available: true,
        cost: 150,
      },
    },
    availability: {
      totalRooms: 15,
      maintenanceRooms: 1,
    },
    isActive: true,
    sortOrder: 1,
  },
  {
    name: "Standard Room B",
    slug: "standard-room-b",
    description:
      "Enhanced standard room with premium amenities and complimentary breakfast. Upgraded version of our standard room with additional comfort features.",
    shortDescription:
      "Enhanced standard room with premium amenities and complimentary breakfast",
    pricing: {
      basePrice: 530,
      weekendPrice: 580,
      holidayPrice: 650,
      currency: "PGK",
    },
    capacity: {
      adults: 2,
      children: 0,
      maxGuests: 2,
    },
    bedConfiguration: {
      bedType: "queen",
      bedCount: 1,
      sofa: false,
    },
    roomSize: 350,
    amenities: [
      "wifi",
      "tv",
      "ac",
      "minibar",
      "breakfast",
      "gymAccess",
      "safe",
      "hairdryer",
      "toiletries",
      "workDesk",
      "coffeemaker",
      "telephone",
      "bathrobes",
      "slippers",
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        alt: "Standard Room B",
        isPrimary: true,
        caption: "Enhanced standard room with premium amenities",
      },
    ],
    inclusions: [
      "Complimentary breakfast",
      "Free fitness room access",
      "Complimentary Wi-Fi",
      "Daily housekeeping",
      "Premium toiletries",
      "Bathrobes and slippers",
    ],
    features: [
      "Premium amenities",
      "Enhanced comfort",
      "Climate control",
      "Work area",
      "City views",
      "Upgraded furnishings",
    ],
    policies: {
      smoking: "notAllowed",
      pets: "notAllowed",
      extraBed: {
        available: true,
        cost: 150,
      },
    },
    availability: {
      totalRooms: 12,
      maintenanceRooms: 0,
    },
    isActive: true,
    sortOrder: 2,
  },
  {
    name: "Superior Twin Bed Room",
    slug: "superior-twin-bed-room",
    description:
      "Spacious twin bed room ideal for families or groups. Features two comfortable twin beds with ample space for relaxation and modern amenities.",
    shortDescription: "Spacious twin bed room ideal for families or groups",
    pricing: {
      basePrice: 695,
      weekendPrice: 760,
      holidayPrice: 850,
      currency: "PGK",
    },
    capacity: {
      adults: 4,
      children: 0,
      maxGuests: 4,
    },
    bedConfiguration: {
      bedType: "twin",
      bedCount: 2,
      sofa: false,
    },
    roomSize: 450,
    amenities: [
      "wifi",
      "tv",
      "ac",
      "minibar",
      "breakfast",
      "gymAccess",
      "safe",
      "hairdryer",
      "toiletries",
      "workDesk",
      "coffeemaker",
      "telephone",
      "bathrobes",
      "slippers",
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
        alt: "Superior Twin Bed Room",
        isPrimary: true,
        caption: "Spacious twin bed room for families or groups",
      },
    ],
    inclusions: [
      "Complimentary breakfast",
      "Free fitness room access",
      "Complimentary Wi-Fi",
      "Daily housekeeping",
      "Premium toiletries",
      "Bathrobes and slippers",
    ],
    features: [
      "Twin beds",
      "Spacious layout",
      "Family-friendly",
      "Climate control",
      "Work area",
      "City views",
    ],
    policies: {
      smoking: "notAllowed",
      pets: "notAllowed",
      extraBed: {
        available: true,
        cost: 150,
      },
    },
    availability: {
      totalRooms: 10,
      maintenanceRooms: 0,
    },
    isActive: true,
    sortOrder: 3,
  },
  {
    name: "Family Deluxe Room",
    slug: "family-deluxe-room",
    description:
      "Luxurious family suite with separate living area. Perfect for families seeking premium accommodations with extra space and comfort.",
    shortDescription: "Luxurious family suite with separate living area",
    pricing: {
      basePrice: 999,
      weekendPrice: 1100,
      holidayPrice: 1250,
      currency: "PGK",
    },
    capacity: {
      adults: 4,
      children: 0,
      maxGuests: 4,
    },
    bedConfiguration: {
      bedType: "king",
      bedCount: 1,
      sofa: true,
    },
    roomSize: 650,
    amenities: [
      "wifi",
      "tv",
      "ac",
      "minibar",
      "breakfast",
      "gymAccess",
      "safe",
      "hairdryer",
      "toiletries",
      "workDesk",
      "coffeemaker",
      "telephone",
      "bathrobes",
      "slippers",
      "balcony",
      "kitchenette",
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        alt: "Family Deluxe Room",
        isPrimary: true,
        caption: "Luxurious family suite with separate living area",
      },
    ],
    inclusions: [
      "Complimentary breakfast",
      "Free fitness room access",
      "Complimentary Wi-Fi",
      "Daily housekeeping",
      "Premium toiletries",
      "Bathrobes and slippers",
      "Welcome fruit basket",
    ],
    features: [
      "Separate living area",
      "Family-friendly layout",
      "Premium amenities",
      "Climate control",
      "Work area",
      "City views",
      "Luxury furnishings",
    ],
    policies: {
      smoking: "notAllowed",
      pets: "notAllowed",
      extraBed: {
        available: true,
        cost: 150,
      },
    },
    availability: {
      totalRooms: 6,
      maintenanceRooms: 0,
    },
    isActive: true,
    sortOrder: 4,
  },
];

async function seedRoomTypesData() {
  try {
    console.log("Connecting to database...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    console.log("Clearing existing room types...");
    await RoomType.deleteMany({});

    console.log("Seeding room types...");
    const createdRoomTypes = await RoomType.insertMany(seedRoomTypes);

    console.log(
      `✅ Successfully seeded ${createdRoomTypes.length} room types:`
    );
    createdRoomTypes.forEach((roomType, index) => {
      console.log(
        `  ${index + 1}. ${roomType.name} - ${roomType.pricing.currency} ${
          roomType.pricing.basePrice
        }`
      );
    });

    await mongoose.disconnect();
    console.log("✅ Disconnected from MongoDB");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding room types:", error);
    process.exit(1);
  }
}

// Run the seed function
seedRoomTypesData();
