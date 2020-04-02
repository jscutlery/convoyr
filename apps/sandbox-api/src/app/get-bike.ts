import { readFileSync } from 'fs';
import { Request, Response } from 'express';

export function getBike(req: Request, res: Response) {
  const rawBikes = readFileSync(__dirname + '/assets/bikes.json', 'utf8');
  const { bikes } = JSON.parse(rawBikes);
  const bike = bikes.find(_bike => _bike.id === req.params.bikeId);

  if (bike == null) {
    return res.sendStatus(404);
  }

  res.json(bike);
}
