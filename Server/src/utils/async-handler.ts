import { RequestHandler, Request, Response, NextFunction } from "express";

export default function asyncHandler(requestHandler: RequestHandler) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      await requestHandler(req, res, next);
    } catch (err) {
      next(err);
    }
  }
}
