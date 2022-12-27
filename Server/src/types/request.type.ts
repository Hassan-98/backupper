import { Request, Response, NextFunction } from 'express';

type ExtendedRequest = Request & {
  ipAddress?: string | string[] | undefined;
}

export type RequestHandler = (req: ExtendedRequest, res: Response, next: NextFunction) => void;