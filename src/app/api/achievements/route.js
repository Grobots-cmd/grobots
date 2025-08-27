import { NextResponse } from "next/server";
import Achievement from "@/models/Achievement";
import dbConnect from "@/lib/db";

// GET /api/achievements - Fetch all achievements
export async function GET(request) {
  try {
    console.log('🏆 Achievements API: GET request received');
    
    await dbConnect();
    console.log('✅ Database connected successfully');

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "100");

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
      return NextResponse.json({ achievement });
    }

    // Fetch all achievements with pagination
    console.log('📊 Fetching all achievements with visibility filter');
    const skip = (page - 1) * limit;
    
    let query = Achievement.find({ visibility: true }).sort({ dateOfEvent: -1 });

    // Only apply pagination if limit is explicitly set and less than total count
    if (limit && limit > 0) {
      const total = await Achievement.countDocuments({ visibility: true });
      if (limit < total) {
        query = query.skip(skip).limit(limit);
      }
    }

    const achievements = await query;
    const total = await Achievement.countDocuments({ visibility: true });

    console.log('✅ Achievements fetched successfully:', {
      count: achievements.length,
      total,
      page,
      limit
    });

    return NextResponse.json({
      achievements,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("❌ Error fetching achievements:", error);
    return NextResponse.json(
      { error: "Failed to fetch achievements" },
      { status: 500 }
    );
  }
}

// POST /api/achievements - Create a new achievement
export async function POST(request) {
  try {
    await dbConnect();
    const achievementData = await request.json();

    const newAchievement = new Achievement({
      ...achievementData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const savedAchievement = await newAchievement.save();
    console.log('✅ Achievement created successfully:', savedAchievement);

    return NextResponse.json({ achievement: savedAchievement }, { status: 201 });
  } catch (error) {
    console.error("❌ Error creating achievement:", error);
    return NextResponse.json(
      { error: "Failed to create achievement" },
      { status: 500 }
    );
  }
}

// PUT /api/achievements/[id] - Update an achievement
export async function PUT(request) {
  try {
    await dbConnect();
    
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const id = pathParts[pathParts.length - 1];
    
    if (!id) {
      return NextResponse.json(
        { error: "Achievement ID is required" },
        { status: 400 }
      );
    }

    const achievementData = await request.json();
    
    const updatedAchievement = await Achievement.findByIdAndUpdate(
      id,
      { 
        ...achievementData,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!updatedAchievement) {
      return NextResponse.json(
        { error: "Achievement not found" },
        { status: 404 }
      );
    }

    console.log('✅ Achievement updated successfully:', updatedAchievement);
    return NextResponse.json({ achievement: updatedAchievement });
  } catch (error) {
    console.error("❌ Error updating achievement:", error);
    return NextResponse.json(
      { error: "Failed to update achievement" },
      { status: 500 }
    );
  }
}

// DELETE /api/achievements - Delete all achievements (use with caution)
export async function DELETE() {
  try {
    await dbConnect();
    const result = await Achievement.deleteMany({});

    console.log('✅ Achievements deleted successfully:', result.deletedCount);
    return NextResponse.json({
      message: `Deleted ${result.deletedCount} achievements`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("❌ Error deleting achievements:", error);
    return NextResponse.json(
      { error: "Failed to delete achievements" },
      { status: 500 }
    );
  }
}
