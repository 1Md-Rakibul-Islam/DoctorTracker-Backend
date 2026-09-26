/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { ErrorRequestHandler } from "express";
import { TErrorSources } from "../interface/error";
import config from "../config";
import { ZodError, ZodIssue } from "zod";
import handleZodError from "../errors/handleZodError";
import handleValidationError from "../errors/handleValidationError";
import handleCastError from "../errors/handleCastError";
import handleDuplicateError from "../errors/handleDuplicateError";
import AppError from "../errors/AppError";

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {

  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong!";
  let errorSourses: TErrorSources = [
    {
      path: "",
      message: "Something went wrong!",
    },
  ];


  if (err instanceof ZodError) {

    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSourses = simplifiedError?.errorSourses;

  } else if (err?.name === "ValidationError") {

    const simplifiedError = handleValidationError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSourses = simplifiedError?.errorSources;

  } else if (err?.name === "CastError") {

    const simplifiedError = handleCastError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSourses = simplifiedError?.errorSources;

  } else if (err?.code === 11000) {

    const simplifiedError = handleDuplicateError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSourses = simplifiedError?.errorSources;

  } else if (err instanceof AppError) {

    statusCode = err.statusCode;
    message = err.message;
    errorSourses = [
      {
        path: "",
        message: err.message,
      }
    ];

  } else if (err instanceof Error) {

    message = err.message;
    errorSourses = [
      {
        path: "",
        message: err.message,
      }
    ];

  };

  return res.status(statusCode).json({
    success: false,
    message,
    errorSourses,
    err,
    stack: config.NODE_ENV === "development" ? err.stack : null,
  });
};

export default globalErrorHandler;
