import { IpcManagerI } from './types';

type Hanlders = {
  [key: string]: () => any
}

export default class IpcManagerMock implements IpcManagerI {
  handlers: Hanlders = {};

  invoke: IpcManagerI['invoke'] = async (channel) => (this.handlers[channel]
    ? this.handlers[channel]()
    : null);

  handle: IpcManagerI['handle'] = (channel, handler) => {
    this.handlers[channel] = handler;
  };
}
