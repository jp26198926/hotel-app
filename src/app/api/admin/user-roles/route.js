import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import UserRole from "@/models/UserRole";

// GET all user roles
export async function GET(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const isActive = searchParams.get("isActive");
    const isSystem = searchParams.get("isSystem");

    const filter = {};
    if (isActive !== null) filter.isActive = isActive === "true";
    if (isSystem !== null) filter.isSystem = isSystem === "true";

    const userRoles = await UserRole.find(filter)
      .populate("createdBy", "name email")
      .populate("lastModifiedBy", "name email")
      .sort({ level: -1, name: 1 });

    return NextResponse.json({ success: true, data: userRoles });
  } catch (error) {
    console.error("Error fetching user roles:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch user roles" },
      { status: 500 }
    );
  }
}

// POST create new user role
export async function POST(request) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const userRole = new UserRole(body);
    await userRole.save();

    return NextResponse.json(
      { success: true, data: userRole },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user role:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create user role" },
      { status: 500 }
    );
  }
}

// PUT update user role
export async function PUT(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "User role ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const userRole = await UserRole.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!userRole) {
      return NextResponse.json(
        { success: false, error: "User role not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: userRole });
  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update user role" },
      { status: 500 }
    );
  }
}

// DELETE user role
export async function DELETE(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "User role ID is required" },
        { status: 400 }
      );
    }

    // Check if role is system role
    const userRole = await UserRole.findById(id);
    if (userRole && userRole.isSystem) {
      return NextResponse.json(
        { success: false, error: "System roles cannot be deleted" },
        { status: 400 }
      );
    }

    const deletedRole = await UserRole.findByIdAndDelete(id);

    if (!deletedRole) {
      return NextResponse.json(
        { success: false, error: "User role not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "User role deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user role:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete user role" },
      { status: 500 }
    );
  }
}
