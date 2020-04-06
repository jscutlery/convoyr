import { Request, Response } from 'express';
import * as assert from 'assert';

export function signIn(req: Request, res: Response) {
  const { login, password } = req.body;

  try {
    assert.strict(typeof login === 'string');
    assert.strict(typeof password === 'string');
  } catch (error) {
    return res.status(401).json({ message: error });
  }

  if (login !== 'demo' || password !== 'demo') {
    return res.status(401).json({ message: 'Invalid login or password' });
  }

  res.json({ token: 'ABCDE' });
}
