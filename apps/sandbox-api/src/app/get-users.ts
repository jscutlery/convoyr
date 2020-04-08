import * as assert from 'assert';
import { readFileSync } from 'fs';
import { Request, Response } from 'express';

export function getUsers(req: Request, res: Response) {
  try {
    assert(req.headers.authorization === 'Bearer ABCDE');
  } catch {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const rawUsers = readFileSync(__dirname + '/assets/users.json', 'utf8');
  const { users } = JSON.parse(rawUsers);

  res.json({ users });
}
