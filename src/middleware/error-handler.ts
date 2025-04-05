import { Request, Response, NextFunction } from "express";

export interface AppError extends Error {
  status?: number;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  console.error(err.stack || err.message || "Error stack not available");
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal Server Error." });
};
