import { Request, Response } from 'express';

export function throwServerError(req: Request, res: Response) {
  res.sendStatus(500);
}
