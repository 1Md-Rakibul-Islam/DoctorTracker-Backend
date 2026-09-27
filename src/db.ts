import mongoose from "mongoose";
import config from "./app/config";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const g = global as any;
const cached = g.mongooseCache || { conn: null, promise: null };
g.mongooseCache = cached;

export async function connectDB() {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        cached.promise = mongoose.connect(config.database_url as string, {
            bufferCommands: false,
            serverSelectionTimeoutMS: 5000,
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (err) {
        cached.promise = null;
        throw err;
    }
    return cached.conn;
}