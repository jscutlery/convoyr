import * as express from 'express';
import { readFileSync } from 'fs';

const app = express();

app.get('/api/bikes', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const rawBikes = readFileSync(__dirname + '/assets/bikes.json', 'utf8');

  // @todo query

  res.json(JSON.parse(rawBikes));
});

app.get('/api/bikes/:bikeId', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const rawBikes = readFileSync(__dirname + '/assets/bikes.json', 'utf8');
  const { bikes } = JSON.parse(rawBikes);
  const bike = bikes.find(_bike => _bike.id === req.params.bikeId);
  res.json(bike);
});

app.get('/api/error', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.sendStatus(500);
});

const port = process.env.port || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});

server.on('error', console.error);
