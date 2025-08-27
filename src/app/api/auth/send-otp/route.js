import dbConnect from '@/lib/db';
import OTP from '@/models/OTP';
import { generateOTP, sendOTPEmail } from '@/lib/emailService';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    await dbConnect();
    
    const { email, type = 'registration', name = '' } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid email address' },
        { status: 400 }
      );
    }
    
    // Delete any existing OTPs for this email and type
    await OTP.deleteMany({ email: email.toLowerCase(), type });
    
    // Generate new OTP
    const otp = generateOTP();
    
    // Save OTP to database
    const newOTP = new OTP({
      email: email.toLowerCase(),
      otp,
      type,
    });
    
    await newOTP.save();
    
    // Send OTP email
    const emailResult = await sendOTPEmail(email, otp, type, name);
    
    if (!emailResult.success) {
      // If email fails, delete the OTP
      await OTP.deleteOne({ _id: newOTP._id });
      return NextResponse.json(
        { success: false, message: 'Failed to send verification email. Please try again.' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      {
        success: true,
        message: 'Verification code sent to your email',
        expiresIn: 600 // 10 minutes in seconds
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
