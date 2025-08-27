import { NextResponse } from "next/server";
import User from "@/models/User";
import Achievement from "@/models/Achievement";
import dbConnect from "@/lib/db";

export async function GET(request) {
  try {
    await dbConnect();

    // Get user statistics
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const adminUsers = await User.countDocuments({ role: 'admin' });
    
    // Get users from this month
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);
    const newUsersThisMonth = await User.countDocuments({
      joinedDate: { $gte: thisMonth }
    });

    // Get achievement statistics
    const totalAchievements = await Achievement.countDocuments();

    // Get event statistics from events data
    const totalEvents = eventsData.events.length;
    const activeEvents = eventsData.events.filter(event => 
      new Date(event.date) >= new Date()
    ).length;
    const totalRegistrations = eventsData.events.reduce((sum, event) => 
      sum + event.registered, 0
    );

    // Calculate system health (mock data for now)
    const systemHealth = 'Good';
    const pendingApprovals = Math.floor(Math.random() * 10); // Mock data
    const communityMessages = Math.floor(Math.random() * 100); // Mock data

    // Recent activity (mock data for now)
    const recentActivity = [
      { 
        type: 'user', 
        message: 'New user registration: Rahul Sharma', 
        time: '2 minutes ago', 
        icon: 'UserPlus' 
      },
      { 
        type: 'event', 
        message: 'Event "RoboWar 2024" registrations opened', 
        time: '1 hour ago', 
        icon: 'Calendar' 
      },
      { 
        type: 'community', 
        message: '5 new messages in General channel', 
        time: '3 hours ago', 
        icon: 'MessageCircle' 
      },
      { 
        type: 'system', 
        message: 'Database backup completed successfully', 
        time: '6 hours ago', 
        icon: 'CheckCircle' 
      }
    ];

    const stats = {
      totalUsers,
      totalEvents,
      activeEvents,
      totalRegistrations,
      newUsersThisMonth,
      communityMessages,
      pendingApprovals,
      systemHealth,
      totalAchievements,
      activeUsers,
      adminUsers,
      recentActivity
    };

    return NextResponse.json(
      {
        message: "Admin stats retrieved successfully",
        stats,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching admin stats:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}



