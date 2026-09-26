import mongoose from "mongoose";
import config from "./app/config";
import app from "./app";
import { Server } from "http";

let server: Server;

async function main() {
  try {
    await mongoose.connect(config.database_url as string);

    server = app.listen(config.port, () => {
      console.log(`Example app listening on port ${config.port}`);
    });
  } catch (error) {
    console.log(error);
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
