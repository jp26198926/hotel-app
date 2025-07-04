import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import RoomType from "@/models/RoomType";

// GET - Fetch active room types for public display
export async function GET() {
  try {
    await connectToDatabase();

    // Only fetch active room types for public display
    const roomTypes = await RoomType.find({
      isActive: true,
    })
      .sort({ sortOrder: 1, createdAt: -1 })
      .select("-createdAt -updatedAt -__v"); // Exclude unnecessary fields

    return NextResponse.json({
      success: true,
      data: roomTypes,
    });
  } catch (error) {
    console.error("Error fetching room types:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch room types",
      },
      { status: 500 }
    );
  }
}
