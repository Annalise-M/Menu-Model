const app = require('./lib/app');
const pool = require('./lib/utils/pool');
const logger = require('./lib/utils/logger');

const PORT = process.env.PORT || 7890;

app.listen(PORT, () => {
  logger.info(`Server started on port ${PORT}`);
});

process.on('exit', () => {
  logger.info('Server shutting down');
  pool.end();
});
