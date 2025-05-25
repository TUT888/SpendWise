const winston = require('winston');
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { 
    service: 'expense'
  },
  transports: [
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
  ],
});
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

const logInfo = (method, url, message) => {
  logger.info(`[EXPENSE] ${method} at ${url}: ${message}`);
}
const logError = (method, url, message) => {
  logger.error(`[EXPENSE] ${method} at ${url}: ${message}`);
}

module.exports = {
  logger,
  logInfo,
  logError
};