import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../lib/mongodb";

// GET /api/achievements/[id] - Get specific achievement
export async function GET(request, { params }) {
  console.log('🔍 Achievements API [id]: GET request received');
  console.log('🆔 Achievement ID:', params.id);
  
  try {
    const { db } = await connectToDatabase();
    console.log('✅ Database connected successfully');

    // Convert string ID to ObjectId
    let objectId;
    try {
      const { ObjectId } = await import('mongodb');
      objectId = new ObjectId(params.id);
    } catch (error) {
      console.log('❌ Invalid ObjectId format:', params.id);
      return NextResponse.json(
        { error: "Invalid achievement ID format" },
        { status: 400 }
      );
    }

    const achievement = await db.collection("achievements").findOne({ _id: objectId });
    
    if (!achievement) {
      console.log('❌ Achievement not found with ID:', params.id);
      return NextResponse.json(
        { error: "Achievement not found" },
        { status: 404 }
      );
    }

    console.log('✅ Achievement found:', {
      id: achievement._id,
      name: achievement.nameOfEvent,
      date: achievement.dateOfEvent
    });
    
    return NextResponse.json({ achievement });
  } catch (error) {
    console.error("❌ Error fetching achievement:", {
      error: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code
    });
    
    return NextResponse.json(
      { error: "Failed to fetch achievement", details: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/achievements/[id] - Update achievement
export async function PUT(request, { params }) {
  console.log('✏️ Achievements API [id]: PUT request received');
  console.log('🆔 Achievement ID:', params.id);
  
  try {
    const { db } = await connectToDatabase();
    console.log('✅ Database connected successfully');
    
    const achievementData = await request.json();
    console.log('📝 Updated achievement data:', {
      nameOfEvent: achievementData.nameOfEvent,
      location: achievementData.location,
      dateOfEvent: achievementData.dateOfEvent
    });

    // Convert string ID to ObjectId
    let objectId;
    try {
      const { ObjectId } = await import('mongodb');
      objectId = new ObjectId(params.id);
    } catch (error) {
      console.log('❌ Invalid ObjectId format:', params.id);
      return NextResponse.json(
        { error: "Invalid achievement ID format" },
        { status: 400 }
      );
    }

    const result = await db
      .collection("achievements")
      .updateOne(
        { _id: objectId },
        { 
          $set: {
            ...achievementData,
            updatedAt: new Date()
          }
        }
      );

    if (result.matchedCount === 0) {
      console.log('❌ Achievement not found for update:', params.id);
      return NextResponse.json(
        { error: "Achievement not found" },
        { status: 404 }
      );
    }

    console.log('✅ Achievement updated successfully:', {
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount
    });

    const updatedAchievement = await db
      .collection("achievements")
      .findOne({ _id: objectId });

    return NextResponse.json({ achievement: updatedAchievement });
  } catch (error) {
    console.error("❌ Error updating achievement:", {
      error: error.message,
      stack: error.stack,
      name: error.name
    });
    
    return NextResponse.json(
      { error: "Failed to update achievement", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/achievements/[id] - Delete achievement
export async function DELETE(request, { params }) {
  console.log('🗑️ Achievements API [id]: DELETE request received');
  console.log('🆔 Achievement ID:', params.id);
  
  try {
    const { db } = await connectToDatabase();
    console.log('✅ Database connected successfully');

    // Convert string ID to ObjectId
    let objectId;
    try {
      const { ObjectId } = await import('mongodb');
      objectId = new ObjectId(params.id);
    } catch (error) {
      console.log('❌ Invalid ObjectId format:', params.id);
      return NextResponse.json(
        { error: "Invalid achievement ID format" },
        { status: 400 }
      );
    }

    const result = await db.collection("achievements").deleteOne({ _id: objectId });

    if (result.deletedCount === 0) {
      console.log('❌ Achievement not found for deletion:', params.id);
      return NextResponse.json(
        { error: "Achievement not found" },
        { status: 404 }
      );
    }

    console.log('✅ Achievement deleted successfully:', {
      deletedCount: result.deletedCount,
      acknowledged: result.acknowledged
    });

    return NextResponse.json({
      message: "Achievement deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("❌ Error deleting achievement:", {
      error: error.message,
      stack: error.stack,
      name: error.name
    });
    
    return NextResponse.json(
      { error: "Failed to delete achievement", details: error.message },
      { status: 500 }
    );
  }
}
