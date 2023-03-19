import winston, { format, transports } from 'winston';
import os from 'os';
import Logger, { Log } from '../types';
import isDev from '../../../utils/isDev';

const myFormat = format.printf(({
  level, message, timestamp,
}) => `[${timestamp}] [${level}]: ${message}`);

/**
 * logger with writing to disk
 */
export default class DiskLogger implements Logger {
  private logger: winston.Logger | null;

  constructor() {
    /**
     * There is a problem creating a folder with logs on the mac in a packed by dmg application
     */
    this.logger = !isDev() && process.platform === 'darwin'
      ? null
      : winston.createLogger({
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
    this.logger?.log({
      message: `${log.message};${log.details ? ` ${JSON.stringify(log.details)}` : ''}`,
      level: log.level,
    });
  }
}
