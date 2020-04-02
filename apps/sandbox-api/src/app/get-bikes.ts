import { readFileSync } from 'fs';
import { Request, Response } from 'express';

export function getBikes(req: Request, res: Response) {
  const rawBikes = readFileSync(__dirname + '/assets/bikes.json', 'utf8');
  const { bikes } = JSON.parse(rawBikes);

  if (req.query.q) {
    return res.json({
      bikes: bikes.filter(({ name }) =>
        name.toLowerCase().includes(req.query.q.toLowerCase())
      )
    });
  }

  res.json({ bikes });
}
