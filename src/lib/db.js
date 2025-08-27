import mongoose from 'mongoose';

// Silence server logs in production
if (process.env.NODE_ENV === 'production') {
  const noop = () => {};
  try {
    console.log = noop; console.debug = noop; console.info = noop; console.warn = noop; console.error = noop;
  } catch (_) {}
}

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://grobotsclub:uDzgEKVv3Be8Qt5k@main-website.7elkaai.mongodb.net/?retryWrites=true&w=majority&appName=Main-Website";

if (process.env.NODE_ENV !== 'production') {
  console.log('🔧 Database Configuration:', {
    hasMongoDBUri: !!process.env.MONGODB_URI,
    mongoDBUri: process.env.MONGODB_URI ? '***SET***' : '***USING DEFAULT***',
    nodeEnv: process.env.NODE_ENV,
    currentWorkingDir: process.cwd()
  });
}

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined');
  throw new Error('Please define the MONGODB_URI environment variable');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
  if (process.env.NODE_ENV !== 'production') console.log('🆕 Created new mongoose cache instance');
} else {
  if (process.env.NODE_ENV !== 'production') console.log('♻️ Using existing mongoose cache instance');
}

async function dbConnect() {
  if (process.env.NODE_ENV !== 'production') console.log('🔌 dbConnect() called');
  
  if (cached.conn) {
    if (process.env.NODE_ENV !== 'production') console.log('✅ Using cached database connection');
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4 // Use IPv4, skip trying IPv6
    };

    if (process.env.NODE_ENV !== 'production') {
      console.log('🚀 Attempting to connect to MongoDB...', {
        uri: MONGODB_URI.substring(0, 50) + '...',
        options: opts
      });
    }
    
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      if (process.env.NODE_ENV !== 'production') {
        console.log('✅ MongoDB connected successfully');
        console.log('📊 Connection details:', {
          host: mongoose.connection.host,
          port: mongoose.connection.port,
          name: mongoose.connection.name,
          readyState: mongoose.connection.readyState
        });
      }
      return mongoose;
    }).catch((error) => {
      if (process.env.NODE_ENV !== 'production') {
        console.error('❌ MongoDB connection promise failed:', {
          error: error.message,
          code: error.code,
          name: error.name
        });
      }
      throw error;
    });
  }

  try {
    if (process.env.NODE_ENV !== 'production') console.log('⏳ Waiting for database connection promise...');
    cached.conn = await cached.promise;
    if (process.env.NODE_ENV !== 'production') console.log('✅ Database connection established and cached');
    return cached.conn;
  } catch (e) {
    cached.promise = null;
    if (process.env.NODE_ENV !== 'production') {
      console.error('❌ MongoDB connection failed:', {
        message: e.message,
        code: e.code,
        name: e.name,
        stack: e.stack
      });
    }
    
    // Provide specific error messages
    if (e.message.includes('IP') || e.message.includes('whitelist')) {
      const errorMsg = `MongoDB connection failed: Your IP address (${process.env.CURRENT_IP || 'unknown'}) is not whitelisted. Please add it to your MongoDB Atlas Network Access list.`;
      console.error('🌐 IP Whitelist Error:', errorMsg);
      throw new Error(errorMsg);
    } else if (e.message.includes('authentication')) {
      const errorMsg = 'MongoDB connection failed: Invalid credentials. Please check your username and password.';
      console.error('🔐 Authentication Error:', errorMsg);
      throw new Error(errorMsg);
    } else if (e.message.includes('network')) {
      const errorMsg = 'MongoDB connection failed: Network error. Please check your internet connection.';
      console.error('🌐 Network Error:', errorMsg);
      throw new Error(errorMsg);
    } else if (e.message.includes('ENOTFOUND')) {
      const errorMsg = 'MongoDB connection failed: Could not resolve hostname. Please check your connection string.';
      console.error('🔍 DNS Resolution Error:', errorMsg);
      throw new Error(errorMsg);
    } else if (e.message.includes('ECONNREFUSED')) {
      const errorMsg = 'MongoDB connection failed: Connection refused. Please check if MongoDB is running and accessible.';
      console.error('🚫 Connection Refused Error:', errorMsg);
      throw new Error(errorMsg);
    } else {
      const errorMsg = `MongoDB connection failed: ${e.message}`;
      console.error('💥 Unknown Connection Error:', errorMsg);
      throw new Error(errorMsg);
    }
  }
}

export default dbConnect;
