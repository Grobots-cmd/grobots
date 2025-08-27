import Project from "@/models/projects";
import dbConnect from "@/lib/db";
import { uploads } from "@/lib/cloudinary";
import { NextResponse } from "next/server";

// Helper function to convert File to base64 for Cloudinary
async function fileToBase64(file) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const base64 = buffer.toString("base64");
  return `data:${file.type};base64,${base64}`;
}

export async function POST(request) {
  try {
    await dbConnect();

    const formData = await request.formData();

    // Extract basic fields
    const slug = formData.get("slug")?.toString();
    const name = formData.get("name")?.toString();
    const year = parseInt(formData.get("year")?.toString());
    const category = formData.get("category")?.toString();
    const weightClass = formData.get("weightClass")?.toString();
    const shortDescription = formData.get("shortDescription")?.toString();
    const description = formData.get("description")?.toString();

    // Extract specifications
    const specifications = {
      dimensions: {
        length:
          formData.get("specifications.dimensions.length")?.toString() || "",
        width:
          formData.get("specifications.dimensions.width")?.toString() || "",
        height:
          formData.get("specifications.dimensions.height")?.toString() || "",
        weight:
          formData.get("specifications.dimensions.weight")?.toString() || "",
      },
      materials: {
        chassis:
          formData.get("specifications.materials.chassis")?.toString() || "",
        panels:
          formData.get("specifications.materials.panels")?.toString() || "",
        wheels:
          formData.get("specifications.materials.wheels")?.toString() || "",
        sensors:
          formData.get("specifications.materials.sensors")?.toString() || "",
      },
      components: {
        computer:
          formData.get("specifications.components.computer")?.toString() || "",
        lidar:
          formData.get("specifications.components.lidar")?.toString() || "",
        cameras:
          formData.get("specifications.components.cameras")?.toString() || "",
        imu: formData.get("specifications.components.imu")?.toString() || "",
        gps: formData.get("specifications.components.gps")?.toString() || "",
      },
      performance: {
        topSpeed:
          formData.get("specifications.performance.topSpeed")?.toString() || "",
        batteryLife:
          formData.get("specifications.performance.batteryLife")?.toString() ||
          "",
        range:
          formData.get("specifications.performance.range")?.toString() || "",
        accuracy:
          formData.get("specifications.performance.accuracy")?.toString() || "",
      },
    };

    // Extract development story
    const developmentStory = {
      concept: formData.get("developmentStory.concept")?.toString() || "",
      challenges: formData.get("developmentStory.challenges")?.toString() || "",
      innovations:
        formData.get("developmentStory.innovations")?.toString() || "",
      timeline: formData.get("developmentStory.timeline")?.toString() || "",
    };

    // Extract technical details
    const technicalDetails = {
      navigationStack:
        formData.get("technicalDetails.navigationStack")?.toString() || "",
      sensorFusion:
        formData.get("technicalDetails.sensorFusion")?.toString() || "",
      aiSystem: formData.get("technicalDetails.aiSystem")?.toString() || "",
      communication:
        formData.get("technicalDetails.communication")?.toString() || "",
    };

    // Extract achievements
    const achievementsData = formData.get("achievements")?.toString();
    let achievements = [];
    if (achievementsData) {
      try {
        achievements = JSON.parse(achievementsData);
        // Ensure it's an array
        if (!Array.isArray(achievements)) {
          achievements = [achievements];
        }
      } catch (error) {
        return NextResponse.json(
          { error: "Invalid achievements format. Must be valid JSON array." },
          { status: 400 }
        );
      }
    }

    // Validate required fields
    if (
      !slug ||
      !name ||
      !year ||
      !category ||
      !weightClass ||
      !shortDescription ||
      !description
    ) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: slug, name, year, category, weightClass, shortDescription, description",
        },
        { status: 400 }
      );
    }

    // Validate year
    if (isNaN(year) || year < 2000 || year > new Date().getFullYear() + 1) {
      return NextResponse.json(
        { error: "Invalid year. Must be between 2000 and current year + 1" },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingProject = await Project.findOne({ slug: slug.toLowerCase() });
    if (existingProject) {
      return NextResponse.json(
        { error: "Project with this slug already exists" },
        { status: 409 }
      );
    }

    // Handle image uploads
    const imageFiles = formData.getAll("images");
    const uploadedImages = [];

    if (!imageFiles || imageFiles.length === 0) {
      return NextResponse.json(
        { error: "At least one image is required" },
        { status: 400 }
      );
    }

    for (const file of imageFiles) {
      if (file instanceof File && file.size > 0) {
        // Validate file type
        const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
        if (!allowedTypes.includes(file.type)) {
          return NextResponse.json(
            {
              error: `Unsupported file format: ${file.type}. Upload only JPEG/JPG or PNG`,
            },
            { status: 400 }
          );
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
          return NextResponse.json(
            { error: `File ${file.name} is too large. Maximum 5MB allowed` },
            { status: 400 }
          );
        }

        try {
          // Convert file to base64
          const base64Image = await fileToBase64(file);

          // Upload to Cloudinary
          const cloudinaryResult = await uploads(base64Image, "/projects");

          // Store the URL
          uploadedImages.push(cloudinaryResult.url);
        } catch (uploadError) {
          console.error("Error uploading file to Cloudinary:", uploadError);
          return NextResponse.json(
            { error: `Error uploading ${file.name}: ${uploadError.message}` },
            { status: 500 }
          );
        }
      }
    }

    // Set main image as the first uploaded image
    const mainImage = uploadedImages[0];

    // Create new project
    const project = new Project({
      slug: slug.toLowerCase(),
      name,
      year,
      category,
      weightClass,
      mainImage,
      images: uploadedImages,
      shortDescription,
      description,
      specifications,
      achievements,
      developmentStory,
      technicalDetails,
    });

    const savedProject = await project.save();

    return NextResponse.json(
      {
        message: "Project created successfully",
        project: savedProject,
        uploaded_images: uploadedImages.length,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating project:", error);

    if (error.name === "ValidationError") {
      return NextResponse.json(
        { error: "Validation error", details: error.message },
        { status: 400 }
      );
    }

    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Project with this slug already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
