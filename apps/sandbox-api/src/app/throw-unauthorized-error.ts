import { Request, Response } from 'express';

export function throwUnauthorizedError(req: Request, res: Response) {
  res.status(401).json({ message: 'Unauthorized' });
}
