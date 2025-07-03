import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import MenuItem from "@/models/MenuItem";

// GET all menu items
export async function GET(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const isActive = searchParams.get("isActive");
    const isAvailable = searchParams.get("isAvailable");

    const filter = {};
    if (category) filter.category = category;
    if (isActive !== null) filter.isActive = isActive === "true";
    if (isAvailable !== null) filter.isAvailable = isAvailable === "true";

    const menuItems = await MenuItem.find(filter).sort({
      category: 1,
      displayOrder: 1,
      name: 1,
    });

    return NextResponse.json({ success: true, data: menuItems });
  } catch (error) {
    console.error("Error fetching menu items:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch menu items" },
      { status: 500 }
    );
  }
}

// POST create new menu item
export async function POST(request) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const menuItem = new MenuItem(body);
    await menuItem.save();

    return NextResponse.json(
      { success: true, data: menuItem },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating menu item:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create menu item" },
      { status: 500 }
    );
  }
}

// PUT update menu item
export async function PUT(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Menu item ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const menuItem = await MenuItem.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!menuItem) {
      return NextResponse.json(
        { success: false, error: "Menu item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: menuItem });
  } catch (error) {
    console.error("Error updating menu item:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update menu item" },
      { status: 500 }
    );
  }
}

// DELETE menu item
export async function DELETE(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Menu item ID is required" },
        { status: 400 }
      );
    }

    const menuItem = await MenuItem.findByIdAndDelete(id);

    if (!menuItem) {
      return NextResponse.json(
        { success: false, error: "Menu item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Menu item deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting menu item:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete menu item" },
      { status: 500 }
    );
  }
}
