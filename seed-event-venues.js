import dotenv from "dotenv";
import mongoose from "mongoose";

// Load environment variables
dotenv.config({ path: ".env.local" });

// Set environment variable manually for testing
if (!process.env.MONGODB_URI) {
  process.env.MONGODB_URI = "mongodb://localhost:27017/hotelms";
}

// Import after setting environment variables
const { default: EventVenue } = await import("./src/models/EventVenue.js");

const seedVenues = [
  {
    name: "Grand Ballroom",
    subtitle: "Perfect for Grand Celebrations",
    description:
      "Our Grand Ballroom features crystal chandeliers, elegant décor, and state-of-the-art audio-visual equipment. Ideal for weddings, corporate events, and milestone celebrations.",
    imageUrl:
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2098&q=80",
    capacity: "300 guests",
    features: [
      "Professional event planning services",
      "Custom catering menus available",
      "Advanced lighting and sound systems",
      "Dedicated event coordinator",
    ],
    buttonText: "Book Event Space",
    buttonColor: "red",
    displayOrder: 1,
    isActive: true,
    isFeatured: true,
    category: "ballroom",
    pricing: {
      halfDay: 2500,
      fullDay: 4500,
      hourly: 350,
    },
    amenities: {
      audioVisual: true,
      wifi: true,
      catering: true,
      parking: true,
      airConditioning: true,
      projector: true,
    },
    contactInfo: {
      email: "events@hotel.com",
      phone: "+1 (555) 123-4567",
    },
    seoData: {
      metaTitle: "Grand Ballroom - Elegant Wedding & Event Venue",
      metaDescription:
        "Book our stunning Grand Ballroom for weddings, corporate events, and celebrations. Accommodates 300 guests with premium amenities.",
      keywords: [
        "wedding venue",
        "event space",
        "ballroom",
        "corporate events",
        "celebrations",
      ],
    },
  },
  {
    name: "Executive Conference Room",
    subtitle: "Modern Conference Facilities",
    description:
      "Our conference rooms are designed for productivity and comfort, featuring the latest technology and flexible layouts for meetings, seminars, and corporate retreats.",
    imageUrl:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
    capacity: "50 guests",
    features: [
      "High-speed Wi-Fi and video conferencing",
      "Flexible seating arrangements",
      "Presentation equipment included",
      "Coffee break and catering services",
    ],
    buttonText: "Reserve Conference Room",
    buttonColor: "orange",
    displayOrder: 2,
    isActive: true,
    isFeatured: false,
    category: "conference",
    pricing: {
      halfDay: 800,
      fullDay: 1500,
      hourly: 120,
    },
    amenities: {
      audioVisual: true,
      wifi: true,
      catering: true,
      parking: true,
      airConditioning: true,
      projector: true,
    },
    contactInfo: {
      email: "conferences@hotel.com",
      phone: "+1 (555) 123-4568",
    },
    seoData: {
      metaTitle: "Executive Conference Room - Professional Meeting Space",
      metaDescription:
        "Modern conference room for 50 guests with video conferencing, presentation equipment, and flexible layouts for business meetings.",
      keywords: [
        "conference room",
        "meeting space",
        "business meetings",
        "corporate retreats",
        "seminars",
      ],
    },
  },
];

async function seedEventVenues() {
  try {
    console.log("Connecting to database...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    console.log("Clearing existing venues...");
    await EventVenue.deleteMany({});

    console.log("Seeding event venues...");
    const createdVenues = await EventVenue.insertMany(seedVenues);

    console.log(`✅ Successfully seeded ${createdVenues.length} event venues:`);
    createdVenues.forEach((venue, index) => {
      console.log(`  ${index + 1}. ${venue.name} (${venue.category})`);
    });

    await mongoose.disconnect();
    console.log("✅ Disconnected from MongoDB");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding event venues:", error);
    process.exit(1);
  }
}

// Run the seed function
seedEventVenues();
