import { io, Socket } from 'socket.io-client';
import { StrictEventEmitter } from 'strict-event-emitter';
import { Receiver, ReceiverEvents } from '../index';
import { ManagerToReceiverEvents, ReceiverToManagerEvents } from '../../types';

class SocketReceiver implements Receiver {
  private socket: Socket<ManagerToReceiverEvents, ReceiverToManagerEvents>;

  private eventEmitter: StrictEventEmitter<ReceiverEvents>;

  private wasConnected: boolean;

  constructor(uri: string) {
    this.socket = io(uri);
    this.eventEmitter = new StrictEventEmitter();
    this.wasConnected = false;

    this.socket.on('connect', this.connectHandler);
    this.socket.on('offer', this.offerHandler);
    this.socket.on('broadcaster', this.broadcasterHandler);
    this.socket.on('closeBroadcast', this.closeBroadcastHandler);
    this.viewRequest();
  }

  private offerHandler = (description: RTCSessionDescriptionInit) => {
    this.eventEmitter.emit('offer', description);
  };

  private connectHandler = () => {
    this.wasConnected = true;
    this.eventEmitter.emit('connectToManager');
  };

  private broadcasterHandler = () => {
    this.viewRequest();
  };

  private closeBroadcastHandler = () => {
    this.eventEmitter.emit('closeBroadcast');
  };

  private viewRequest() {
    this.socket.emit('watcher');
  }

  answer = (description: RTCSessionDescription): void => {
    this.socket.emit('answer', description);
  };

  candidate = (candidate: RTCIceCandidate): void => {
    this.socket.emit('candidate', candidate);
  };

  close = (): void => {
    this.socket.close();
  };

  on = <Event extends keyof ReceiverEvents>(event: Event, listener: ReceiverEvents[Event]): void => {
    this.eventEmitter.on(event, listener);
  };
}

export default SocketReceiver;
