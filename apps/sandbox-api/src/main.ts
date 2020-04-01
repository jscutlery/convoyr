import * as express from 'express';
import { readFileSync } from 'fs';
import * as cors from 'cors';

const app = express();

app.use(cors());

app.get('/api/bikes', (req, res) => {
  const rawBikes = readFileSync(__dirname + '/assets/bikes.json', 'utf8');

  res.json(JSON.parse(rawBikes));
});

app.get('/api/bikes/:bikeId', (req, res) => {
  const rawBikes = readFileSync(__dirname + '/assets/bikes.json', 'utf8');
  const { bikes } = JSON.parse(rawBikes);
  const bike = bikes.find(_bike => _bike.id === req.params.bikeId);
  res.json(bike);
});

app.get('/api/error', (req, res) => {
  res.sendStatus(500);
});

const port = process.env.port || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});

server.on('error', console.error);
