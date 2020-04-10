import * as assert from 'assert';
import { readFileSync } from 'fs';
import { Request, Response } from 'express';

export function getBikes(req: Request, res: Response) {
  try {
    assert(req.headers.authorization === 'Bearer ABCDE');
  } catch {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const rawBikes = readFileSync(__dirname + '/assets/bikes.json', 'utf8');
  const { bikes } = JSON.parse(rawBikes);
  const query = req.query.q;

  if (typeof query === 'string') {
    return res.json({
      bikes: bikes.filter(({ name }) =>
        name.toLowerCase().includes(query.toLowerCase())
      ),
    });
  }

  res.json({ bikes });
}
