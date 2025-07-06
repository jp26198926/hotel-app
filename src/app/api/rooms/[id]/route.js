import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Room from "@/models/Room";

export async function GET(request, { params }) {
  try {
    await connectToDatabase();

    const { id } = params;
    const room = await Room.findById(id).populate("roomType");

    if (!room || !room.isActive) {
      return NextResponse.json(
        { success: false, error: "Room not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: room,
    });
  } catch (error) {
    console.error("Error fetching room:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch room" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await connectToDatabase();

    const { id } = params;
    const body = await request.json();

    // Clean up empty string values for optional enum fields
    if (body.wing === "") {
      delete body.wing;
    }
    if (body.features?.view === "") {
      body.features.view = undefined;
    }

    // Check if room number already exists (excluding current room)
    if (body.roomNumber) {
      const existingRoom = await Room.findOne({
        roomNumber: body.roomNumber,
        isActive: true,
        _id: { $ne: id },
      });

      if (existingRoom) {
        return NextResponse.json(
          { success: false, error: "Room number already exists" },
          { status: 400 }
        );
      }
    }

    const room = await Room.findByIdAndUpdate(
      id,
      { ...body, modifiedBy: body.modifiedBy },
      { new: true, runValidators: true }
    ).populate("roomType");

    if (!room) {
      return NextResponse.json(
        { success: false, error: "Room not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: room,
    });
  } catch (error) {
    console.error("Error updating room:", error);

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
      { success: false, error: "Failed to update room" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectToDatabase();

    const { id } = params;

    // Soft delete by setting isActive to false
    const room = await Room.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!room) {
      return NextResponse.json(
        { success: false, error: "Room not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Room deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting room:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete room" },
      { status: 500 }
    );
  }
}
