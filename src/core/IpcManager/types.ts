export type IpcChannels = {
  screenSources: { sources: { id: string, name: string }[] }
  watcherUrl: { url: string }
}

export interface IpcManagerI {
  invoke<Channel extends keyof IpcChannels>(channel: Channel): Promise<IpcChannels[Channel]>
  handle<Channel extends keyof IpcChannels>(channel: Channel, handler: () => IpcChannels[Channel]): void
}
