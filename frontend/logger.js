const winston = require('winston');
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'test' ? 'silent' : 'info',
  format: winston.format.json(),
  defaultMeta: { 
    service: 'frontend'
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

module.exports = {
  logger
};