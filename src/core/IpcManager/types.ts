import { Log } from '../Logger/types';

export type IpcChannels = {
  screenSources: { sources: { id: string, name: string }[] }
  watcherUrl: { url: string }
  log: Log
}

export interface IpcHandler<Channel extends keyof IpcChannels> {
  (data?: IpcChannels[Channel]): Promise<IpcChannels[Channel]> | IpcChannels[Channel] | void
}

export interface IpcManagerI {
  invoke<Channel extends keyof IpcChannels>(
    channel: Channel,
    data?: IpcChannels[Channel],
  ): Promise<IpcChannels[Channel]>
  handle<Channel extends keyof IpcChannels>(
    channel: Channel,
    handler: IpcHandler<Channel>): void
}
