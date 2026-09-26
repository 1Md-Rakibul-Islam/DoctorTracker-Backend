import express, { ErrorRequestHandler, Request, Response } from "express";
import cors from "cors";
import globalErrorhandler from "./app/middlwares/globalErrorhandler";
import notFound from "./app/middlwares/notFound";
import router from "./app/routes";

const app = express();

// parsers
app.use(express.json());
app.use(cors());

// application routes
app.use("/api/v1/", router);

app.get("/", (req: Request, res: Response) => {
  const a = {
    name: "uttara university - server running",
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
