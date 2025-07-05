import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Booking from "@/models/Booking";
import Room from "@/models/Room";
import { guestBookingSchema } from "@/lib/validations";

export async function POST(request) {
  try {
    await connectToDatabase();

    const body = await request.json();

    // Validate the booking data
    const validatedData = guestBookingSchema.parse(body);

    const {
      guestName,
      guestEmail,
      guestPhone,
      checkInDate,
      checkOutDate,
      numberOfGuests,
      roomType,
      specialRequests,
      additionalGuests = [],
    } = validatedData;

    // Check room availability
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    // For now, use mock room data since we don't have rooms set up in the database yet
    // TODO: Replace with actual room availability checking once rooms are set up
    const roomTypes = {
      standard: { name: "Standard Room", price: 199, maxGuests: 2 },
      deluxe: { name: "Deluxe Room", price: 299, maxGuests: 3 },
      suite: { name: "Executive Suite", price: 499, maxGuests: 4 },
      presidential: { name: "Presidential Suite", price: 899, maxGuests: 6 },
    };

    const selectedRoom = roomTypes[roomType];
    if (!selectedRoom) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid room type selected",
          code: "INVALID_ROOM_TYPE",
        },
        { status: 400 }
      );
    }

    // Calculate booking details
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const subtotal = nights * selectedRoom.price;
    const taxes = subtotal * 0.12; // 12% tax
    const total = subtotal + taxes;

    // 50% deposit required (this can be made configurable by admin later)
    const depositPercentage = 0.5; // 50%
    const depositAmount = total * depositPercentage;
    const remainingAmount = total - depositAmount;

    // Generate booking reference
    const bookingReference =
      "BK" + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();

    // For now, create a mock booking without database room dependency
    // TODO: Replace with actual database booking once rooms are set up
    const mockBooking = {
      bookingId: bookingReference,
      guest: null, // For guest bookings, we'll store guest info directly
      checkIn: checkIn,
      checkOut: checkOut,
      guests: {
        adults: numberOfGuests,
        children: 0,
      },
      status: "pending",
      paymentStatus: "pending",
      totalAmount: total,
      paidAmount: 0,
      specialRequests: specialRequests || "",

      // Guest information (since we don't have user registration for guests)
      guestInfo: {
        name: guestName,
        email: guestEmail,
        phone: guestPhone,
        additionalGuests: additionalGuests || [],
      },

      // Room information
      roomInfo: {
        type: roomType,
        name: selectedRoom.name,
        price: selectedRoom.price,
      },

      // Pricing breakdown
      pricing: {
        baseRate: selectedRoom.price,
        nights,
        subtotal,
        taxes,
        totalAmount: total,
        depositRequired: depositAmount,
        remainingAmount: remainingAmount,
        depositPercentage: depositPercentage * 100, // Convert to percentage
      },
    };

    // For now, we'll just return the mock booking data
    // TODO: Save to database once room models are properly set up
    // await newBooking.save();

    return NextResponse.json(
      {
        success: true,
        data: {
          booking: mockBooking,
          bookingReference: bookingReference,
          paymentRequired: depositAmount, // Only require deposit for now
          message: `Booking created successfully. Please pay ${
            depositPercentage * 100
          }% deposit (${depositAmount.toFixed(
            2
          )}) to confirm your reservation.`,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating booking:", error);

    if (error.name === "ZodError") {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid booking data",
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to create booking" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const bookingReference = searchParams.get("reference");
    const email = searchParams.get("email");

    if (bookingReference) {
      // Get specific booking by reference
      const booking = await Booking.findOne({
        bookingId: bookingReference,
      }).populate("room", "roomNumber type amenities");

      if (!booking) {
        return NextResponse.json(
          { success: false, error: "Booking not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: booking,
      });
    }

    if (email) {
      // Get bookings by guest email
      const bookings = await Booking.find({
        "guestInfo.email": email,
      })
        .populate("room", "roomNumber type amenities")
        .sort({ createdAt: -1 })
        .limit(10);

      return NextResponse.json({
        success: true,
        data: bookings,
      });
    }

    return NextResponse.json(
      { success: false, error: "Missing required parameters" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error fetching booking:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch booking" },
      { status: 500 }
    );
  }
}
