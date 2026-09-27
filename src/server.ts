import mongoose from "mongoose";
import config from "./app/config";
import app from "./app";
import { Server } from "http";

let server: Server;

async function main() {
  try {
    console.log("DATABASE_URL exists:", !!config.database_url);
    console.log("NODE_ENV:", config.NODE_ENV);

    await mongoose.connect(config.database_url as string);

    console.log("MongoDB connected successfully");

    server = app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error);
  }
}

main();

process.on("unhandledRejection", () => {
  console.log(`Unhandled rejection detected. Closing server...`);
  if (server) {
    server.close(() => {
      process.exit(1);
    })
  }
  process.exit(1);
});

process.on("uncaughtException", () => {
  console.log(`Uncaught exception detected. Closing server...`);
  process.exit(1);
});
