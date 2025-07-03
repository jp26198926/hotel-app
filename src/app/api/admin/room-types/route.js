import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import RoomType from "@/models/RoomType";

// GET all room types
export async function GET(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const isActive = searchParams.get("isActive");

    const filter = {};
    if (isActive !== null) {
      filter.isActive = isActive === "true";
    }

    const roomTypes = await RoomType.find(filter).sort({
      displayOrder: 1,
      name: 1,
    });

    return NextResponse.json({ success: true, data: roomTypes });
  } catch (error) {
    console.error("Error fetching room types:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch room types" },
      { status: 500 }
    );
  }
}

// POST create new room type
export async function POST(request) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const roomType = new RoomType(body);
    await roomType.save();

    return NextResponse.json(
      { success: true, data: roomType },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating room type:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create room type" },
      { status: 500 }
    );
  }
}

// PUT update room type
export async function PUT(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Room type ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const roomType = await RoomType.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!roomType) {
      return NextResponse.json(
        { success: false, error: "Room type not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: roomType });
  } catch (error) {
    console.error("Error updating room type:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update room type" },
      { status: 500 }
    );
  }
}

// DELETE room type
export async function DELETE(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Room type ID is required" },
        { status: 400 }
      );
    }

    const roomType = await RoomType.findByIdAndDelete(id);

    if (!roomType) {
      return NextResponse.json(
        { success: false, error: "Room type not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Room type deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting room type:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete room type" },
      { status: 500 }
    );
  }
}
