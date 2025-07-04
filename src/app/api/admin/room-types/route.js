import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import RoomType from "@/models/RoomType";

// GET - Fetch all room types
export async function GET(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 50;
    const search = searchParams.get("search") || "";
    const isActive = searchParams.get("isActive");

    const skip = (page - 1) * limit;

    // Build query
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    if (isActive !== null && isActive !== undefined && isActive !== "") {
      query.isActive = isActive === "true";
    }

    const roomTypes = await RoomType.find(query)
      .sort({ sortOrder: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await RoomType.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: roomTypes,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    console.error("Error fetching room types:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch room types",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// POST - Create new room type
export async function POST(request) {
  try {
    await connectToDatabase();

    const body = await request.json();

    // Generate slug from name if not provided
    if (!body.slug && body.name) {
      body.slug = body.name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
    }

    const roomType = new RoomType(body);
    await roomType.save();

    return NextResponse.json(
      {
        success: true,
        data: roomType,
        message: "Room type created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating room type:", error);

    if (error.name === "ValidationError") {
      const validationErrors = {};
      for (const field in error.errors) {
        validationErrors[field] = error.errors[field].message;
      }
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          validationErrors,
        },
        { status: 400 }
      );
    }

    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return NextResponse.json(
        {
          success: false,
          error: `${field} already exists`,
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create room type",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// PUT update room type
export async function PUT(request) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Room type ID is required" },
        { status: 400 }
      );
    }

    // Generate slug from name if name is being updated
    if (updateData.name && !updateData.slug) {
      updateData.slug = updateData.name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
    }

    const roomType = await RoomType.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!roomType) {
      return NextResponse.json(
        { success: false, error: "Room type not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: roomType,
      message: "Room type updated successfully",
    });
  } catch (error) {
    console.error("Error updating room type:", error);

    if (error.name === "ValidationError") {
      const validationErrors = {};
      for (const field in error.errors) {
        validationErrors[field] = error.errors[field].message;
      }
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          validationErrors,
        },
        { status: 400 }
      );
    }

    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return NextResponse.json(
        {
          success: false,
          error: `${field} already exists`,
        },
        { status: 409 }
      );
    }

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
