import express, { ErrorRequestHandler, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import globalErrorhandler from "./app/middlwares/globalErrorhandler";
import notFound from "./app/middlwares/notFound";
import router from "./app/routes";

const app = express();

// parsers
app.use(express.json());
app.use(cookieParser());
// app.use(cors({ origin: "http://localhost:3000", credentials: true }));

const allowedOrigins = [
  "http://localhost:3000",
  "https://doctor-tracker-backend-sandy.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// application routes
app.use("/api/v1/", router);

app.get("/", (req: Request, res: Response) => {
  const a = {
    name: "Doctor Tracker - server running",
    version: "1.0.0",
  };
  res.status(200).json({
    status: 200,
    data: a,
    message: "success",
  });
});

// global error handler
app.use(globalErrorhandler as unknown as ErrorRequestHandler);

// handle not found route
app.use(notFound as unknown as ErrorRequestHandler);

export default app;
