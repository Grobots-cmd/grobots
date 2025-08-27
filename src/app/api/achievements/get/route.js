import Achievement from "@/models/Achievement";
import dbConnect from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request) {
  console.log('🏆 Achievements API: GET request received');
  console.log('🔗 Request URL:', request.url);
  console.log('🔍 Search params:', Object.fromEntries(new URL(request.url).searchParams));
  
  try {
    console.log('🔌 Attempting database connection...');
    await dbConnect();
    console.log('✅ Database connected successfully');

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const limit = searchParams.get("limit");
    const page = searchParams.get("page");

    console.log('📋 Query parameters:', { id, limit, page });

    // If ID is provided, fetch specific achievement
    if (id) {
      console.log('🔍 Fetching achievement by ID:', id);
      const achievement = await Achievement.findById(id);

      if (!achievement) {
        console.log('❌ Achievement not found with ID:', id);
        return NextResponse.json(
          { error: "Achievement not found" },
          { status: 404 }
        );
      }

      console.log('✅ Achievement found:', achievement);
      return NextResponse.json(achievement, { status: 200 });
    }

    // Fetch all achievements with optional pagination
    console.log('📊 Fetching all achievements with visibility filter');
    let query = Achievement.find({ visibility: true }).sort({ dateOfEvent: -1 });

    if (limit) {
      const limitNum = parseInt(limit);
      const pageNum = parseInt(page) || 1;
      const skip = (pageNum - 1) * limitNum;
      console.log('📄 Pagination applied:', { limit: limitNum, page: pageNum, skip });

      query = query.skip(skip).limit(limitNum);
    }

    console.log('🚀 Executing database query...');
    const achievements = await query;
    console.log('✅ Achievements fetched successfully:', {
      count: achievements.length,
      achievements: achievements.map(a => ({
        id: a._id,
        name: a.nameOfEvent,
        date: a.dateOfEvent,
        visibility: a.visibility
      }))
    });

    // Return achievements array directly for simplicity
    return NextResponse.json(achievements, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching achievements:", {
      error: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code
    });

    if (error.name === "CastError") {
      console.log('🔄 CastError detected, returning 400');
      return NextResponse.json(
        { error: "Invalid achievement ID format" },
        { status: 400 }
      );
    }

    if (error.message.includes('MongoDB connection failed')) {
      console.log('🔌 MongoDB connection error, returning 503');
      return NextResponse.json(
        { error: "Database connection failed", details: error.message },
        { status: 503 }
      );
    }

    console.log('💥 Internal server error, returning 500');
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
