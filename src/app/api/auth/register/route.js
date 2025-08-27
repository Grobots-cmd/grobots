import dbConnect from "@/lib/db";
import User from "@/models/User";
import OTP from "@/models/OTP";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request) {
  try {
    // Connect to database
    await dbConnect();

    // Get request body
    const {
      name,
      email,
      password,
      otp,
      step = "register",
    } = await request.json();

    // Step 1: Initial registration (send OTP)
    if (step === "send_otp") {
      // Validate required fields for OTP sending
      if (!name || !email || !password) {
        return NextResponse.json(
          { success: false, message: "Name, email, and password are required" },
          { status: 400 }
        );
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { success: false, message: "Please provide a valid email address" },
          { status: 400 }
        );
      }

      // Validate password length
      if (password.length < 6) {
        return NextResponse.json(
          {
            success: false,
            message: "Password must be at least 6 characters long",
          },
          { status: 400 }
        );
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email: email.toLowerCase() });

      if (existingUser) {
        return NextResponse.json(
          { success: false, message: "User with this email already exists" },
          { status: 409 }
        );
      }

      return NextResponse.json(
        {
          success: true,
          message: "Validation successful. Please verify your email.",
          step: "verify_otp",
        },
        { status: 200 }
      );
    }

    // Step 2: Complete registration (verify OTP and create user)
    if (step === "complete_registration") {
      // Validate all required fields
      if (!name || !email || !password || !otp) {
        return NextResponse.json(
          {
            success: false,
            message: "All fields including verification code are required",
          },
          { status: 400 }
        );
      }

      // Check if user already exists (double-check)
      const existingUser = await User.findOne({ email: email.toLowerCase() });

      if (existingUser) {
        return NextResponse.json(
          { success: false, message: "User with this email already exists" },
          { status: 409 }
        );
      }

      // Verify OTP
      const otpRecord = await OTP.findOne({
        email: email.toLowerCase(),
        type: "registration",
        isVerified: false,
      }).sort({ createdAt: -1 });

      if (
        !otpRecord ||
        otpRecord.otp !== otp.toString() ||
        new Date() > otpRecord.expiresAt
      ) {
        return NextResponse.json(
          { success: false, message: "Invalid or expired verification code" },
          { status: 400 }
        );
      }

      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create new user
      const newUser = new User({
        name: name.trim(),
        email: email.toLowerCase(),
        password: hashedPassword,
      });

      // Save user to database
      const savedUser = await newUser.save();

      // Delete the used OTP
      await OTP.deleteOne({ _id: otpRecord._id });

      // Generate JWT token
      const token = jwt.sign(
        {
          userId: savedUser._id,
          email: savedUser.email,
        },
        process.env.JWT_SECRET || "your-secret-key",
        { expiresIn: "7d" }
      );

      // Remove password from response
      const { password: _, ...userWithoutPassword } = savedUser.toObject();

      return NextResponse.json(
        {
          success: true,
          message: "Account created successfully! Welcome to GROBOTS!",
          user: userWithoutPassword,
          token: token,
        },
        { status: 201 }
      );
    }

    // Invalid step
    return NextResponse.json(
      { success: false, message: "Invalid registration step" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Registration error:", error);

    // Handle mongoose validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return NextResponse.json(
        { success: false, message: messages[0] },
        { status: 400 }
      );
    }

    // Handle duplicate key error (email already exists)
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: "User with this email already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
