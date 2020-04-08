import * as assert from 'assert';
import { Request, Response } from 'express';

export function createToken(req: Request, res: Response) {
  const { login, password } = req.body;

  try {
    assert(typeof login === 'string');
    assert(typeof password === 'string');
  } catch (error) {
    return res.status(403).json({ message: error });
  }

  if (login !== 'demo' || password !== 'demo') {
    return res.status(403).json({ message: 'Invalid login or password' });
  }

  res.json({ token: 'ABCDE' });
}
