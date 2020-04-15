import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';

import { getBikes } from './app/get-bikes';
import { getBike } from './app/get-bike';
import { throwServerError } from './app/throw-server-error';
import { createToken } from './app/token';

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/api/bikes', getBikes);
app.get('/api/bikes/:bikeId', getBike);
app.get('/api/server-error', throwServerError);
app.post('/api/tokens', createToken);

const port = process.env.port || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});

server.on('error', console.error);
