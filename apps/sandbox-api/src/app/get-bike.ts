import * as assert from 'assert';
import { readFileSync } from 'fs';
import { Request, Response } from 'express';

export function getBike(req: Request, res: Response) {
  try {
    assert(req.headers.authorization === 'Bearer ABCDE');
  } catch {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const rawBikes = readFileSync(__dirname + '/assets/bikes.json', 'utf8');
  const { bikes } = JSON.parse(rawBikes);
  const bike = bikes.find((_bike) => _bike.id === req.params.bikeId);

  if (bike == null) {
    return res.sendStatus(404);
  }

  res.json(bike);
}
