// Entry point of the application.
// Starts the server and listens for incoming requests.

import { app } from './app';
import { PORT } from './config/config';
import logger from './config/logger';

app.listen(PORT, () => {
  logger.info(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
