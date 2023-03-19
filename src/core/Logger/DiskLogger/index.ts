import winston, { format, transports } from 'winston';
import Logger, { Log } from '../types';

const myFormat = format.printf(({
  level, message, timestamp,
}) => `[${timestamp}] [${level}]: ${message}`);

/**
 * logger with writing to disk
 */
export default class DiskLogger implements Logger {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      format: format.combine(
        format.timestamp(),
        myFormat,
      ),
      transports: [
        new transports.File({ filename: 'logs/logs.log' }),
      ],
    });
  }

  write(log: Log) {
    this.logger.log({
      message: `${log.message};${log.details ? ` ${JSON.stringify(log.details)}` : ''}`,
      level: log.level,
    });
  }
}
