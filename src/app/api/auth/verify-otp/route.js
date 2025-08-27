import dbConnect from '@/lib/db';
import OTP from '@/models/OTP';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    await dbConnect();
    
    const { email, otp, type = 'registration' } = await request.json();
    
    if (!email || !otp) {
      return NextResponse.json(
        { success: false, message: 'Email and OTP are required' },
        { status: 400 }
      );
    }
    
    // Find the OTP record
    const otpRecord = await OTP.findOne({
      email: email.toLowerCase(),
      type,
      isVerified: false,
    }).sort({ createdAt: -1 });
    
    if (!otpRecord) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired verification code' },
        { status: 400 }
      );
    }
    
    // Check if OTP has expired
    if (new Date() > otpRecord.expiresAt) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return NextResponse.json(
        { success: false, message: 'Verification code has expired. Please request a new one.' },
        { status: 400 }
      );
    }
    
    // Check attempt limit
    if (otpRecord.attempts >= 3) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return NextResponse.json(
        { success: false, message: 'Too many failed attempts. Please request a new verification code.' },
        { status: 400 }
      );
    }
    
    // Verify OTP
    if (otpRecord.otp !== otp.toString()) {
      // Increment attempt count
      otpRecord.attempts += 1;
      await otpRecord.save();
      
      const remainingAttempts = 3 - otpRecord.attempts;
      return NextResponse.json(
        { 
          success: false, 
          message: `Invalid verification code. ${remainingAttempts} attempt${remainingAttempts !== 1 ? 's' : ''} remaining.` 
        },
        { status: 400 }
      );
    }
    
    // Mark OTP as verified
    otpRecord.isVerified = true;
    await otpRecord.save();
    
    // Delete the OTP record after successful verification (optional, for security)
    await OTP.deleteOne({ _id: otpRecord._id });
    
    return NextResponse.json(
      {
        success: true,
        message: 'Email verified successfully'
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
