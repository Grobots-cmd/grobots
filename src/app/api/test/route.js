import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET() {
  console.log('🧪 Test API: GET request received');
  
  try {
    // Test Mongoose connection
    console.log('🔌 Testing Mongoose connection...');
    let mongooseStatus = 'unknown';
    try {
      await dbConnect();
      mongooseStatus = 'connected';
      console.log('✅ Mongoose connection successful');
    } catch (error) {
      mongooseStatus = `failed: ${error.message}`;
      console.error('❌ Mongoose connection failed:', error.message);
    }

    // Test Native MongoDB connection
    console.log('🔌 Testing Native MongoDB connection...');
    let nativeMongoStatus = 'unknown';
    try {
      const { db } = await connectToDatabase();
      nativeMongoStatus = 'connected';
      console.log('✅ Native MongoDB connection successful');
      
      // Test basic database operations
      const collections = await db.listCollections().toArray();
      console.log('📚 Available collections:', collections.map(c => c.name));
      
    } catch (error) {
      nativeMongoStatus = `failed: ${error.message}`;
      console.error('❌ Native MongoDB connection failed:', error.message);
    }

    // Test environment variables
    const envVars = {
      hasMongoDBUri: !!process.env.MONGODB_URI,
      nodeEnv: process.env.NODE_ENV,
      currentWorkingDir: process.cwd()
    };

    console.log('🔧 Environment variables:', envVars);

    const testResults = {
      timestamp: new Date().toISOString(),
      mongoose: mongooseStatus,
      nativeMongo: nativeMongoStatus,
      environment: envVars,
      status: 'test_completed'
    };

    console.log('✅ Test completed successfully:', testResults);

    return NextResponse.json(testResults, { status: 200 });
  } catch (error) {
    console.error("❌ Test API error:", {
      error: error.message,
      stack: error.stack,
      name: error.name
    });

    return NextResponse.json(
      { 
        error: "Test failed", 
        details: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
