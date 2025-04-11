// Sets up the Express server, middleware, routes, and error handling.

import express from 'express';
// import { createConnection } from './config/db';
// For PostgreSQL with Prisma uncomment the following line and comment the previous one
import cors from 'cors';
import { CLIENT_URL } from './config/config';
import { baseRouter } from './routes/base.routes';

// Initialize express
export const app = express();
app.disable('x-powered-by');

// Allow cors for all connections (development)
app.use(cors());
// Allow cors for especific client url (production)
app.use(cors({ origin: CLIENT_URL }));

app.get('/ping', (req, res) => res.send('pong'));

app.use('/api/v1', baseRouter);
