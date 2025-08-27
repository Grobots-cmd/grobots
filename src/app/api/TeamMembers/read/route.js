import TeamMember from "@/models/TeamMember";
import dbConnect from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request) {
  console.log('👥 Team Members API: GET request received');
  console.log('🔗 Request URL:', request.url);
  
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const role = searchParams.get("role");
    const department = searchParams.get("department");
    const year = searchParams.get("year");
    const isActive = searchParams.get("isActive");

    console.log('📋 Query parameters:', { id, role, department, year, isActive });

    console.log('🔌 Attempting database connection...');
    await dbConnect();
    console.log('✅ Database connected successfully');

    // If ID is provided, fetch specific team member
    if (id) {
      console.log('🔍 Fetching team member by ID:', id);
      
      const teamMember = await TeamMember.findById(id);

      if (!teamMember) {
        console.log('❌ Team member not found with ID:', id);
        return NextResponse.json(
          { error: "Team member not found" },
          { status: 404 }
        );
      }

      console.log('✅ Team member found by ID:', {
        id: teamMember._id,
        name: teamMember.name,
        role: teamMember.role,
        department: teamMember.department
      });

      return NextResponse.json(teamMember, { status: 200 });
    }

    // Build query filters
    const filters = {};
    console.log('🔍 Building database filters...');
    
    if (role) {
      filters.role = role;
      console.log('👔 Added role filter:', role);
    }
    if (department) {
      filters.department = department;
      console.log('🏢 Added department filter:', department);
    }
    if (year) {
      const yearNum = parseInt(year);
      if (!isNaN(yearNum)) {
        filters.year = yearNum;
        console.log('📅 Added year filter:', yearNum);
      } else {
        console.log('⚠️ Invalid year parameter:', year);
      }
    }
    if (isActive !== undefined) {
      const isActiveBool = isActive === 'true';
      filters.isActive = isActiveBool;
      console.log('✅ Added isActive filter:', isActiveBool);
    }

    console.log('📊 Final filters object:', filters);

    // Fetch team members with filters
    console.log('🚀 Executing database query...');
    const teamMembers = await TeamMember.find(filters).sort({ year: -1, name: 1 });

    console.log('✅ Team members fetched successfully:', {
      count: teamMembers.length,
      filters: filters,
      sampleMembers: teamMembers.slice(0, 3).map(m => ({
        id: m._id,
        name: m.name,
        role: m.role,
        department: m.department,
        year: m.year
      }))
    });

    // Return team members array directly for simplicity
    return NextResponse.json(teamMembers, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching team members:", {
      error: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code
    });

    if (error.name === "CastError") {
      console.log('🔄 CastError detected, returning 400');
      return NextResponse.json(
        { error: "Invalid team member ID format" },
        { status: 400 }
      );
    }

    console.log('💥 Internal server error, returning 500');
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
