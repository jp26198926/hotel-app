import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import EventVenue from "@/models/EventVenue";

export async function GET() {
  try {
    await connectToDatabase();

    // Fetch active venues, sorted by display order
    const venues = await EventVenue.find({ isActive: true })
      .sort({ displayOrder: 1, createdAt: -1 })
      .select("-createdAt -updatedAt -__v")
      .lean();

    return NextResponse.json({
      success: true,
      data: venues,
    });
  } catch (error) {
    console.error("Error fetching event venues:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch event venues" },
      { status: 500 }
    );
  }
}
