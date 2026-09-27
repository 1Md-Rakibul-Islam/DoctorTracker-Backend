import app from "../src/app";
import { connectDB } from "../src/db";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function handler(req: any, res: any) {
    await connectDB();
    return app(req, res);
}