// Handles database connection and configuration.
// This file is responsible for setting up and exporting the database instance.

import mongoose, { type ConnectOptions } from 'mongoose';
import { DB_URL } from './config';
import logger from './logger';

export const createConnection = async () => {
  try {
    const options: ConnectOptions = {};

    if (!DB_URL) {
      throw new Error('DB_URL is not defined');
    }

    logger.info('Attempting to connect to the DB...');
    await mongoose.connect(DB_URL, options);
    logger.info('Connected to the DB');

    mongoose.connection.on('error', (error) => {
      logger.error({ error }, 'The connection was interrupted');
      process.exit(1);
    });
  } catch (error) {
    logger.error({ error }, 'Cannot connect to the DB');
    process.exit(1);
  }
};
