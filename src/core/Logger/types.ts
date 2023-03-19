export type LogLevel = 'info' | 'debug' | 'warn' | 'error';

export type Log = {
  message: string,
  details?: Record<string, unknown>,
  level: LogLevel,
}

export default interface Logger {
  write(log: Log): void
}
