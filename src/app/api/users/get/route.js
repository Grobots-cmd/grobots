import User from "@/models/User";
import dbConnect from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const limit = searchParams.get("limit");
    const page = searchParams.get("page");
    const status = searchParams.get("status");
    const role = searchParams.get("role");

    // If ID is provided, fetch specific user
    if (id) {
      const user = await User.findById(id).select('-password');

      if (!user) {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          message: "User retrieved successfully",
          user,
        },
        { status: 200 }
      );
    }

    // Build query with filters
    let query = {};
    
    if (status && status !== 'All') {
      if (status === 'Active') {
        query.isActive = true;
      } else if (status === 'Suspended') {
        query.isActive = false;
      }
    }

    if (role && role !== 'All') {
      query.role = role.toLowerCase();
    }

    // Fetch users with optional pagination and filters
    let userQuery = User.find(query).select('-password').sort({ createdAt: -1 });

    if (limit) {
      const limitNum = parseInt(limit);
      const pageNum = parseInt(page) || 1;
      const skip = (pageNum - 1) * limitNum;

      userQuery = userQuery.skip(skip).limit(limitNum);
    }

    const users = await userQuery;
    const total = await User.countDocuments(query);

    // Transform users to match admin dashboard format
    const transformedUsers = users.map(user => ({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone || 'N/A',
      institution: user.institution || 'N/A',
      year: user.year || 'N/A',
      registrationDate: user.joinedDate,
      status: user.isActive ? 'Active' : 'Suspended',
      role: user.role === 'admin' ? 'Admin' : 'Participant',
      eventsRegistered: user.eventsRegistered || 0,
      avatar: `https://api.dicebear.com/7.x/personas/svg?seed=${user.name}&backgroundColor=f8f9fa&size=150`
    }));

    return NextResponse.json(
      {
        message: "Users retrieved successfully",
        users: transformedUsers,
        total,
        ...(limit && {
          pagination: {
            page: parseInt(page) || 1,
            limit: parseInt(limit),
            totalPages: Math.ceil(total / parseInt(limit)),
          },
        }),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching users:", error);

    if (error.name === "CastError") {
      return NextResponse.json(
        { error: "Invalid user ID format" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
