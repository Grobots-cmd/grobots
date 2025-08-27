
import Achievement from "@/models/Achievement";
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

    // Extract text fields
    const nameOfEvent = formData.get("nameOfEvent")?.toString();
    const location = formData.get("location")?.toString();
    const dateOfEvent = formData.get("dateOfEvent")?.toString();
    const winningPosition = formData.get("winningPosition")?.toString();
    const prizeWon = formData.get("prizeWon")?.toString() || "";
    const shortDescription = formData.get("shortDescription")?.toString();
    const longDescription = formData.get("longDescription")?.toString();

    // Validate required fields
    if (
      !nameOfEvent ||
      !location ||
      !dateOfEvent ||
      !winningPosition ||
      !shortDescription ||
      !longDescription
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate description lengths
    if (shortDescription.length > 150) {
      return NextResponse.json(
        { error: "Short description must be 150 characters or less" },
        { status: 400 }
      );
    }

    if (longDescription.length > 2000) {
      return NextResponse.json(
        { error: "Long description must be 2000 characters or less" },
        { status: 400 }
      );
    }

    // Handle file uploads
    const files = formData.getAll("images");
    const uploadedImages = [];

    for (const file of files) {
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
          // Convert file to buffer
          const base64Image = await fileToBase64(file);

          // Upload to Cloudinary
          const cloudinaryResult = await uploads(base64Image, "/Achievements");

          // Store only the URL string
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

    // Create new achievement
    const achievement = new Achievement({
      nameOfEvent,
      location,
      dateOfEvent: new Date(dateOfEvent),
      images: uploadedImages,
      winningPosition,
      prizeWon,
      shortDescription,
      longDescription,
    });

    const savedAchievement = await achievement.save();

    return NextResponse.json(
      {
        message: "Achievement created successfully",
        achievement: savedAchievement,
        uploaded_images: uploadedImages.length,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating achievement:", error);

    if (error.name === "ValidationError") {
      return NextResponse.json(
        { error: "Validation error", details: error.message },
        { status: 400 }
      );
    }

    if (error.code === 11000) {
      return NextResponse.json({ error: "Duplicate entry" }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

