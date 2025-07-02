import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Room from "@/models/Room";
import User from "@/models/User";

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const status = searchParams.get("status");
    const skip = (page - 1) * limit;

    let query = {};
    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate("guest", "name email phone")
      .populate("room", "roomNumber type")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Booking.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: bookings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();

    // Validate room availability
    const room = await Room.findById(body.room);
    if (!room) {
      return NextResponse.json(
        { success: false, error: "Room not found" },
        { status: 404 }
      );
    }

    if (room.status !== "available") {
      return NextResponse.json(
        { success: false, error: "Room is not available" },
        { status: 400 }
      );
    }

    // Check for overlapping bookings
    const checkIn = new Date(body.checkIn);
    const checkOut = new Date(body.checkOut);

    const overlappingBooking = await Booking.findOne({
      room: body.room,
      status: { $in: ["confirmed", "checkedIn"] },
      $or: [
        {
          checkIn: { $lte: checkIn },
          checkOut: { $gt: checkIn },
        },
        {
          checkIn: { $lt: checkOut },
          checkOut: { $gte: checkOut },
        },
        {
          checkIn: { $gte: checkIn },
          checkOut: { $lte: checkOut },
        },
      ],
    });

    if (overlappingBooking) {
      return NextResponse.json(
        {
          success: false,
          error: "Room is already booked for the selected dates",
        },
        { status: 400 }
      );
    }

    // Calculate total amount
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const baseAmount = room.price.base * nights;
    const totalAmount = body.totalAmount || baseAmount;

    const booking = await Booking.create({
      ...body,
      totalAmount,
      payment: {
        ...body.payment,
        amount: totalAmount,
      },
    });

    // Update room status
    await Room.findByIdAndUpdate(body.room, { status: "reserved" });

    const populatedBooking = await Booking.findById(booking._id)
      .populate("guest", "name email phone")
      .populate("room", "roomNumber type");

    return NextResponse.json(
      {
        success: true,
        data: populatedBooking,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating booking:", error);

    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: validationErrors,
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
