import * as express from 'express';
import { readFileSync } from 'fs';
import * as cors from 'cors';

const app = express();

app.use(cors());

app.get('/api/bikes', (req, res) => {
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
});

app.get('/api/bikes/:bikeId', (req, res) => {
  const rawBikes = readFileSync(__dirname + '/assets/bikes.json', 'utf8');
  const { bikes } = JSON.parse(rawBikes);
  const bike = bikes.find(_bike => _bike.id === req.params.bikeId);

  if (bike == null) {
    return res.sendStatus(404);
  }

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
