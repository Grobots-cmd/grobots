import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../lib/mongodb";

// POST /api/achievements/seed - Seed achievements data
export async function POST(request) {
  try {
    const { db } = await connectToDatabase();
    const { achievements } = await request.json();

    if (!achievements || !Array.isArray(achievements)) {
      return NextResponse.json(
        { error: "Invalid achievements data" },
        { status: 400 }
      );
    }

    // Add timestamps to all achievements
    const achievementsWithTimestamps = achievements.map((achievement) => ({
      ...achievement,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    // Clear existing achievements and insert new ones
    await db.collection("achievements").deleteMany({});
    const result = await db
      .collection("achievements")
      .insertMany(achievementsWithTimestamps);

    return NextResponse.json({
      message: `Successfully seeded ${result.insertedCount} achievements`,
      insertedCount: result.insertedCount,
      insertedIds: result.insertedIds,
    });
  } catch (error) {
    console.error("Error seeding achievements:", error);
    return NextResponse.json(
      { error: "Failed to seed achievements" },
      { status: 500 }
    );
  }
}
