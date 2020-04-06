import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';

import { signIn } from './app/sign-in';
import { getBikes } from './app/get-bikes';
import { getBike } from './app/get-bike';
import { throwServerError } from './app/throw-server-error';
import { throwUnauthorizedError } from './app/throw-unauthorized-error';

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.post('/api/sign-in', signIn);
app.get('/api/bikes', getBikes);
app.get('/api/bikes/:bikeId', getBike);
app.get('/api/server-error', throwServerError);
app.get('/api/unauthorized-error', throwUnauthorizedError);

const port = process.env.port || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});

server.on('error', console.error);
