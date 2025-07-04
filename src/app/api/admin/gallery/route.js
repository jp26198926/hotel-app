import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Gallery from "@/models/Gallery";

// GET all gallery items
export async function GET(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const isPublic = searchParams.get("isPublic");
    const isFeatured = searchParams.get("isFeatured");
    const isActive = searchParams.get("isActive");

    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (isPublic !== null) filter.isPublic = isPublic === "true";
    if (isFeatured !== null) filter.isFeatured = isFeatured === "true";
    if (isActive !== null) filter.isActive = isActive === "true";

    const galleryItems = await Gallery.find(filter)
      .populate("uploadedBy", "name email")
      .populate("approvedBy", "name email")
      .sort({ displayOrder: 1, createdAt: -1 });

    return NextResponse.json({ success: true, items: galleryItems });
  } catch (error) {
    console.error("Error fetching gallery items:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch gallery items" },
      { status: 500 }
    );
  }
}

// POST create new gallery item
export async function POST(request) {
  try {
    await connectToDatabase();

    const body = await request.json();

    // Remove uploadedBy field if not provided (for now, since we don't have auth)
    if (!body.uploadedBy) {
      delete body.uploadedBy;
    }

    const galleryItem = new Gallery(body);
    await galleryItem.save({ validateBeforeSave: false });

    return NextResponse.json(
      { success: true, item: galleryItem },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating gallery item:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to create gallery item",
      },
      { status: 500 }
    );
  }
}

// PUT update gallery item
export async function PUT(request) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Gallery item ID is required" },
        { status: 400 }
      );
    }

    const galleryItem = await Gallery.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!galleryItem) {
      return NextResponse.json(
        { success: false, error: "Gallery item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, item: galleryItem });
  } catch (error) {
    console.error("Error updating gallery item:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update gallery item" },
      { status: 500 }
    );
  }
}

// DELETE gallery item
export async function DELETE(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Gallery item ID is required" },
        { status: 400 }
      );
    }

    const galleryItem = await Gallery.findByIdAndDelete(id);

    if (!galleryItem) {
      return NextResponse.json(
        { success: false, error: "Gallery item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Gallery item deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting gallery item:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete gallery item" },
      { status: 500 }
    );
  }
}
