import TeamMember from "@/models/TeamMember";
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
        { error: "Team member ID is required" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid team member ID" },
        { status: 400 }
      );
    }

    // Check if team member exists
    const existingMember = await TeamMember.findById(id);
    if (!existingMember) {
      return NextResponse.json(
        { error: "Team member not found" },
        { status: 404 }
      );
    }

    const formData = await request.formData();

    // Extract text fields
    const name = formData.get("name")?.toString();
    const rollNo = formData.get("rollNo")?.toString();
    const course = formData.get("course")?.toString();
    const branch = formData.get("branch")?.toString();
    const year = formData.get("year")
      ? parseInt(formData.get("year")?.toString())
      : undefined;
    const activity = formData.get("activity")
      ? formData.get("activity") === "true"
      : undefined;
    const Role = formData.get("Role")?.toString();
    const department = formData.get("department")?.toString();
    const yearOfLeaving = formData.get("yearOfLeaving")?.toString();
    const isMember = formData.get("isMember")
      ? formData.get("isMember") !== "false"
      : undefined;

    // Validate enum values if provided
    if (year && ![1, 2, 3, 4].includes(year)) {
      return NextResponse.json(
        { error: "Year must be 1, 2, 3, or 4" },
        { status: 400 }
      );
    }

    if (
      Role &&
      !["HOD", "Coordinator", "Assistant Coordinator"].includes(Role)
    ) {
      return NextResponse.json(
        { error: "Role must be HOD, Coordinator, or Assistant Coordinator" },
        { status: 400 }
      );
    }

    // Check if rollNo is being updated and if it already exists
    if (rollNo && rollNo !== existingMember.rollNo) {
      const duplicateRollNo = await TeamMember.findOne({
        rollNo,
        _id: { $ne: id },
      });
      if (duplicateRollNo) {
        return NextResponse.json(
          { error: "Team member with this roll number already exists" },
          { status: 409 }
        );
      }
    }

    // Handle image upload
    const imageFile = formData.get("image");
    let imageUrl = existingMember.image; // Keep existing image by default

    if (imageFile && imageFile instanceof File && imageFile.size > 0) {
      // Validate file type
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!allowedTypes.includes(imageFile.type)) {
        return NextResponse.json(
          {
            error: `Unsupported file format: ${imageFile.type}. Upload only JPEG/JPG or PNG`,
          },
          { status: 400 }
        );
      }

      // Validate file size (5MB)
      if (imageFile.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: `Image file is too large. Maximum 5MB allowed` },
          { status: 400 }
        );
      }

      try {
        // Convert file to base64
        const base64Image = await fileToBase64(imageFile);

        // Upload to Cloudinary
        const cloudinaryResult = await uploads(base64Image, "/team-members");
        imageUrl = cloudinaryResult.url;
      } catch (uploadError) {
        console.error("Error uploading image to Cloudinary:", uploadError);
        return NextResponse.json(
          { error: `Error uploading image: ${uploadError.message}` },
          { status: 500 }
        );
      }
    }

    // Update the team member
    const updatedMember = await TeamMember.findByIdAndUpdate(
      id,
      {
        ...(name && { name }),
        ...(rollNo && { rollNo }),
        ...(course && { course }),
        ...(branch && { branch }),
        image: imageUrl,
        ...(year && { year }),
        ...(activity !== undefined && { activity }),
        ...(Role && { Role }),
        ...(department && { department }),
        ...(yearOfLeaving !== undefined && {
          yearOfLeaving: yearOfLeaving ? parseInt(yearOfLeaving) : null,
        }),
        ...(isMember !== undefined && { isMember }),
      },
      {
        new: true,
        runValidators: true,
      }
    );

    return NextResponse.json(
      {
        message: "Team member updated successfully",
        teamMember: updatedMember,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating team member:", error);

    if (error.name === "ValidationError") {
      return NextResponse.json(
        { error: "Validation error", details: error.message },
        { status: 400 }
      );
    }

    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Team member with this roll number already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
