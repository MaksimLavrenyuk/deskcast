import Logger, { Log } from '../types';

export default class ClientLogger implements Logger {
  public static readonly URL = 'log_write';

  async write(log: Log) {
    const options: RequestInit = {
      headers: {
        // https://clck.ru/Uvfrb
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'Content-Type': 'application/json; charset=utf-8',
      },
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(log),
    };

    try {
      await fetch(ClientLogger.URL, options);
    } catch (e) {
      console.error(e);
    }
  }
}
