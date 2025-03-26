// Sets up the Express server, middleware, routes, and error handling.

import express from 'express';
// import { createConnection } from './config/db';
// For PostgreSQL with Prisma uncomment the following line and comment the previous one
import { createConnection } from './config/db.prisma';
import { baseRouter } from './routes/base.routes';

// Initialize express
export const app = express();
app.disable('x-powered-by');

//Connectar a la BBDD
await createConnection();

app.get('/ping', (req, res) => res.send('pong'));

app.use('/api/v1', baseRouter);
