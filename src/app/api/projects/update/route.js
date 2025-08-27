import Project from "@/models/projects";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { uploads } from "@/lib/cloudinary";
import mongoose from "mongoose";

// Helper function to convert File to base64 for Cloudinary
async function fileToBase64(file) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const base64 = buffer.toString("base64");
  return `data:${file.type};base64,${base64}`;
}

export async function PUT(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid project ID" },
        { status: 400 }
      );
    }

    // Check if project exists
    const existingProject = await Project.findById(id);
    if (!existingProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const formData = await request.formData();

    // Extract basic fields
    const slug = formData.get("slug")?.toString();
    const name = formData.get("name")?.toString();
    const year = formData.get("year")
      ? parseInt(formData.get("year")?.toString())
      : undefined;
    const category = formData.get("category")?.toString();
    const weightClass = formData.get("weightClass")?.toString();
    const shortDescription = formData.get("shortDescription")?.toString();
    const description = formData.get("description")?.toString();

    // Validate year if provided
    if (
      year &&
      (isNaN(year) || year < 2000 || year > new Date().getFullYear() + 1)
    ) {
      return NextResponse.json(
        { error: "Invalid year. Must be between 2000 and current year + 1" },
        { status: 400 }
      );
    }

    // Check if slug is being updated and if it already exists
    if (slug && slug.toLowerCase() !== existingProject.slug) {
      const duplicateSlug = await Project.findOne({
        slug: slug.toLowerCase(),
        _id: { $ne: id },
      });
      if (duplicateSlug) {
        return NextResponse.json(
          { error: "Project with this slug already exists" },
          { status: 409 }
        );
      }
    }

    // Extract specifications if provided
    let specifications = existingProject.specifications;
    if (
      formData.has("specifications.dimensions.length") ||
      formData.has("specifications.materials.chassis") ||
      formData.has("specifications.components.computer") ||
      formData.has("specifications.performance.topSpeed")
    ) {
      specifications = {
        dimensions: {
          length:
            formData.get("specifications.dimensions.length")?.toString() ||
            existingProject.specifications?.dimensions?.length ||
            "",
          width:
            formData.get("specifications.dimensions.width")?.toString() ||
            existingProject.specifications?.dimensions?.width ||
            "",
          height:
            formData.get("specifications.dimensions.height")?.toString() ||
            existingProject.specifications?.dimensions?.height ||
            "",
          weight:
            formData.get("specifications.dimensions.weight")?.toString() ||
            existingProject.specifications?.dimensions?.weight ||
            "",
        },
        materials: {
          chassis:
            formData.get("specifications.materials.chassis")?.toString() ||
            existingProject.specifications?.materials?.chassis ||
            "",
          panels:
            formData.get("specifications.materials.panels")?.toString() ||
            existingProject.specifications?.materials?.panels ||
            "",
          wheels:
            formData.get("specifications.materials.wheels")?.toString() ||
            existingProject.specifications?.materials?.wheels ||
            "",
          sensors:
            formData.get("specifications.materials.sensors")?.toString() ||
            existingProject.specifications?.materials?.sensors ||
            "",
        },
        components: {
          computer:
            formData.get("specifications.components.computer")?.toString() ||
            existingProject.specifications?.components?.computer ||
            "",
          lidar:
            formData.get("specifications.components.lidar")?.toString() ||
            existingProject.specifications?.components?.lidar ||
            "",
          cameras:
            formData.get("specifications.components.cameras")?.toString() ||
            existingProject.specifications?.components?.cameras ||
            "",
          imu:
            formData.get("specifications.components.imu")?.toString() ||
            existingProject.specifications?.components?.imu ||
            "",
          gps:
            formData.get("specifications.components.gps")?.toString() ||
            existingProject.specifications?.components?.gps ||
            "",
        },
        performance: {
          topSpeed:
            formData.get("specifications.performance.topSpeed")?.toString() ||
            existingProject.specifications?.performance?.topSpeed ||
            "",
          batteryLife:
            formData
              .get("specifications.performance.batteryLife")
              ?.toString() ||
            existingProject.specifications?.performance?.batteryLife ||
            "",
          range:
            formData.get("specifications.performance.range")?.toString() ||
            existingProject.specifications?.performance?.range ||
            "",
          accuracy:
            formData.get("specifications.performance.accuracy")?.toString() ||
            existingProject.specifications?.performance?.accuracy ||
            "",
        },
      };
    }

    // Extract development story if provided
    let developmentStory = existingProject.developmentStory;
    if (formData.has("developmentStory.concept")) {
      developmentStory = {
        concept:
          formData.get("developmentStory.concept")?.toString() ||
          existingProject.developmentStory?.concept ||
          "",
        challenges:
          formData.get("developmentStory.challenges")?.toString() ||
          existingProject.developmentStory?.challenges ||
          "",
        innovations:
          formData.get("developmentStory.innovations")?.toString() ||
          existingProject.developmentStory?.innovations ||
          "",
        timeline:
          formData.get("developmentStory.timeline")?.toString() ||
          existingProject.developmentStory?.timeline ||
          "",
      };
    }

    // Extract technical details if provided
    let technicalDetails = existingProject.technicalDetails;
    if (formData.has("technicalDetails.navigationStack")) {
      technicalDetails = {
        navigationStack:
          formData.get("technicalDetails.navigationStack")?.toString() ||
          existingProject.technicalDetails?.navigationStack ||
          "",
        sensorFusion:
          formData.get("technicalDetails.sensorFusion")?.toString() ||
          existingProject.technicalDetails?.sensorFusion ||
          "",
        aiSystem:
          formData.get("technicalDetails.aiSystem")?.toString() ||
          existingProject.technicalDetails?.aiSystem ||
          "",
        communication:
          formData.get("technicalDetails.communication")?.toString() ||
          existingProject.technicalDetails?.communication ||
          "",
      };
    }

    // Extract achievements if provided
    let achievements = existingProject.achievements;
    const achievementsData = formData.get("achievements")?.toString();
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

    // Handle image uploads
    const imageFiles = formData.getAll("images");
    let uploadedImages = existingProject.images; // Keep existing images by default
    let mainImage = existingProject.mainImage;

    if (
      imageFiles &&
      imageFiles.length > 0 &&
      imageFiles[0] instanceof File &&
      imageFiles[0].size > 0
    ) {
      const newUploadedImages = [];

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
            newUploadedImages.push(cloudinaryResult.url);
          } catch (uploadError) {
            console.error("Error uploading file to Cloudinary:", uploadError);
            return NextResponse.json(
              { error: `Error uploading ${file.name}: ${uploadError.message}` },
              { status: 500 }
            );
          }
        }
      }

      if (newUploadedImages.length > 0) {
        uploadedImages = newUploadedImages;
        mainImage = newUploadedImages[0]; // Set first new image as main image
      }
    }

    // Update the project
    const updatedProject = await Project.findByIdAndUpdate(
      id,
      {
        ...(slug && { slug: slug.toLowerCase() }),
        ...(name && { name }),
        ...(year && { year }),
        ...(category && { category }),
        ...(weightClass && { weightClass }),
        mainImage,
        images: uploadedImages,
        ...(shortDescription && { shortDescription }),
        ...(description && { description }),
        specifications,
        achievements,
        developmentStory,
        technicalDetails,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    return NextResponse.json(
      {
        message: "Project updated successfully",
        project: updatedProject,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating project:", error);

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
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
