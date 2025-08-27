import { MongoClient } from "mongodb";

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://grobotsclub:uDzgEKVv3Be8Qt5k@main-website.7elkaai.mongodb.net/?retryWrites=true&w=majority&appName=Main-Website";
const DB_NAME = process.env.DB_NAME || "grobots-main";

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

let cached = global.mongo;

if (!cached) {
  cached = global.mongo = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };
    
    cached.promise = MongoClient.connect(MONGODB_URI, opts).then((client) => {
      const connection = {
        client,
        db: client.db(DB_NAME),
      };
      return connection;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
}
