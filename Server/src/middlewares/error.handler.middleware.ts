import { Request, Response } from 'express';
//= Error Generator
import createError from 'http-errors';

export class HttpException extends Error {
  public status: number;
  public message: string;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.message = message;
  }
}

export const HttpError = (status: number, message: string) => createError(status, message);

function errorHandlerMiddleware(error: HttpException, req: Request, res: Response): Response {
  const status: number = error.status || 500;
  const message: string = error.message || 'Something went wrong';

  console.error('\n\x1b[31m%s\x1b[0m\n', message);
  console.error(error.stack);

  return res.status(status).json({ success: false, data: null, message });
}

export default errorHandlerMiddleware;