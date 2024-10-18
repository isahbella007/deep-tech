/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from "express";
import { config } from "../../config";
import { AppError } from "./AppError";
import { ErrorType } from "./errorTypes";

class ResponseFormatter {
  static success<T>(res: Response, data: T, message: string, statusCode: number = 200): void {
    res.status(statusCode).json({
      status: "success",
      message,
      data,
    });
  }

  static error(res: Response, error: AppError): void {
    const statusCode = error.statusCode && !isNaN(error.statusCode) ? error.statusCode : 500;
    const response: any = {
      status: 'error',
      type: error.type || ErrorType.UNKNOWN,
      message: error.message || 'An unexpected error occurred',
    };

    if (config.env === 'development') {
      response.stack = error.stack;
    }

    if (error.type === ErrorType.VALIDATION) {
      response.errors = error.errors;
    }

    res.status(statusCode).json(response);
  }
}

export { ResponseFormatter };