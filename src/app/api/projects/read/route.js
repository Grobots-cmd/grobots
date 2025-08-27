import Project from "@/models/projects";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import mongoose from "mongoose";

export async function GET(request) {
  console.log('🚀 Projects API: GET request received');
  console.log('🔗 Request URL:', request.url);
  
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const slug = searchParams.get("slug");
    const category = searchParams.get("category");
    const year = searchParams.get("year");
    const weightClass = searchParams.get("weightClass");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;

    console.log('📋 Query parameters:', { id, slug, category, year, weightClass, search, page, limit });

    console.log('🔌 Attempting database connection...');
    await dbConnect();
    console.log('✅ Database connected successfully');

    // If ID is provided, fetch specific project
    if (id) {
      console.log('🔍 Fetching project by ID:', id);
      
      if (!mongoose.Types.ObjectId.isValid(id)) {
        console.log('❌ Invalid ObjectId format:', id);
        return NextResponse.json(
          { error: "Invalid project ID" },
          { status: 400 }
        );
      }

      const project = await Project.findById(id);
      if (!project) {
        console.log('❌ Project not found with ID:', id);
        return NextResponse.json(
          { error: "Project not found" },
          { status: 404 }
        );
      }

      console.log('✅ Project found by ID:', {
        id: project._id,
        name: project.name,
        category: project.category
      });

      return NextResponse.json(
        {
          success: true,
          project,
        },
        { status: 200 }
      );
    }

    // If slug is provided, fetch project by slug
    if (slug) {
      console.log('🔍 Fetching project by slug:', slug);
      
      const project = await Project.findOne({ slug: slug.toLowerCase() });
      if (!project) {
        console.log('❌ Project not found with slug:', slug);
        return NextResponse.json(
          { error: "Project not found" },
          { status: 404 }
        );
      }

      console.log('✅ Project found by slug:', {
        id: project._id,
        name: project.name,
        slug: project.slug
      });

      return NextResponse.json(
        {
          success: true,
          project,
        },
        { status: 200 }
      );
    }

    // Build filter object for multiple records
    const filter = {};
    console.log('🔍 Building database filter...');

    if (category) {
      filter.category = new RegExp(category, "i");
      console.log('📂 Added category filter:', category);
    }

    if (year) {
      const yearNum = parseInt(year);
      if (!isNaN(yearNum)) {
        filter.year = yearNum;
        console.log('📅 Added year filter:', yearNum);
      } else {
        console.log('⚠️ Invalid year parameter:', year);
      }
    }

    if (weightClass) {
      filter.weightClass = new RegExp(weightClass, "i");
      console.log('⚖️ Added weight class filter:', weightClass);
    }

    // Add search functionality
    if (search) {
      filter.$or = [
        { name: new RegExp(search, "i") },
        { slug: new RegExp(search, "i") },
        { category: new RegExp(search, "i") },
        { weightClass: new RegExp(search, "i") },
        { shortDescription: new RegExp(search, "i") },
        { description: new RegExp(search, "i") },
      ];
      console.log('🔍 Added search filter:', search);
    }

    console.log('📊 Final filter object:', filter);

    // Calculate pagination
    const skip = (page - 1) * limit;
    console.log('📄 Pagination:', { page, limit, skip });

    // Fetch projects with filters and pagination
    console.log('🚀 Executing database query...');
    const projects = await Project.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const totalCount = await Project.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / limit);

    console.log('✅ Projects fetched successfully:', {
      count: projects.length,
      total: totalCount,
      pages: totalPages,
      currentPage: page
    });

    // Get statistics
    console.log('📊 Fetching project statistics...');
    const stats = {
      totalProjects: await Project.countDocuments(),
      categories: await Project.distinct("category"),
      weightClasses: await Project.distinct("weightClass"),
      years: await Project.distinct("year"),
    };

    console.log('📊 Project statistics:', {
      totalProjects: stats.totalProjects,
      categoriesCount: stats.categories.length,
      weightClassesCount: stats.weightClasses.length,
      yearsCount: stats.years.length
    });

    return NextResponse.json(
      {
        success: true,
        message: "Projects retrieved successfully",
        data: {
          projects,
          pagination: {
            page,
            limit,
            total: totalCount,
            pages: totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1,
          },
          stats,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error fetching projects:", {
      error: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code
    });

    return NextResponse.json(
      { success: false, error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
