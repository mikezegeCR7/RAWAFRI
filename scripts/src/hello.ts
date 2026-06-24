import { createLogger, transports, format } from 'winston';

const logger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'warn' : 'info',
  transports: [new transports.Console()],
  format: format.combine(
    format.timestamp(),
    format.json()
  )
});

logger.info('Hello from @workspace/scripts');