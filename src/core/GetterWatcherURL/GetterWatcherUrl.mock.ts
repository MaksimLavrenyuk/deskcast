import { GetterWatcherURLI } from './types';

export default class GetterWatcherUrlMock implements GetterWatcherURLI {
  private readonly link: string;

  constructor(url?: string) {
    this.link = url;
  }

  url = async () => this.link;
}
