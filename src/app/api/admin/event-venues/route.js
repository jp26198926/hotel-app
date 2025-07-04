import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import EventVenue from "@/models/EventVenue";

// GET all event venues
export async function GET(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const isActive = searchParams.get("isActive");
    const isFeatured = searchParams.get("isFeatured");

    const filter = {};
    if (category) filter.category = category;
    if (isActive !== null) filter.isActive = isActive === "true";
    if (isFeatured !== null) filter.isFeatured = isFeatured === "true";

    const venues = await EventVenue.find(filter).sort({
      displayOrder: 1,
      createdAt: -1,
    });

    return NextResponse.json({ success: true, venues });
  } catch (error) {
    console.error("Error fetching event venues:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch event venues" },
      { status: 500 }
    );
  }
}

// POST create new event venue
export async function POST(request) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const venue = new EventVenue(body);
    await venue.save();

    return NextResponse.json({ success: true, venue }, { status: 201 });
  } catch (error) {
    console.error("Error creating event venue:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to create event venue",
      },
      { status: 500 }
    );
  }
}

// PUT update event venue
export async function PUT(request) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Venue ID is required" },
        { status: 400 }
      );
    }

    const venue = await EventVenue.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!venue) {
      return NextResponse.json(
        { success: false, error: "Event venue not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, venue });
  } catch (error) {
    console.error("Error updating event venue:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to update event venue",
      },
      { status: 500 }
    );
  }
}

// DELETE event venue
export async function DELETE(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Venue ID is required" },
        { status: 400 }
      );
    }

    const venue = await EventVenue.findByIdAndDelete(id);

    if (!venue) {
      return NextResponse.json(
        { success: false, error: "Event venue not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Event venue deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting event venue:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete event venue" },
      { status: 500 }
    );
  }
}
