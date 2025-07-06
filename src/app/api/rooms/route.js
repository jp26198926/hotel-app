import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Room from "@/models/Room";

export async function GET() {
  try {
    await connectToDatabase();

    const rooms = await Room.find({ isActive: true })
      .populate("roomType")
      .sort({ roomNumber: 1 });

    return NextResponse.json({
      success: true,
      data: rooms,
      total: rooms.length,
    });
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch rooms" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();

    const body = await request.json();

    // Clean up empty string values for optional enum fields
    if (body.wing === "") {
      delete body.wing;
    }
    if (body.features?.view === "") {
      body.features.view = undefined;
    }

    // Check if room number already exists
    const existingRoom = await Room.findOne({
      roomNumber: body.roomNumber,
      isActive: true,
    });

    if (existingRoom) {
      return NextResponse.json(
        { success: false, error: "Room number already exists" },
        { status: 400 }
      );
    }

    const room = await Room.create(body);
    const populatedRoom = await Room.findById(room._id).populate("roomType");

    return NextResponse.json(
      {
        success: true,
        data: populatedRoom,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating room:", error);

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
      { success: false, error: "Failed to create room" },
      { status: 500 }
    );
  }
}
