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

    this.offerHandler = this.offerHandler.bind(this);
    this.close = this.close.bind(this);
    this.connectHandler = this.connectHandler.bind(this);
    this.broadcasterHandler = this.broadcasterHandler.bind(this);
    this.answer = this.answer.bind(this);

    this.socket.on('connect', this.connectHandler);
    this.socket.on('offer', this.offerHandler);
    this.socket.on('broadcaster', this.broadcasterHandler);
  }

  private offerHandler(description: RTCSessionDescriptionInit) {
    this.eventEmitter.emit('offer', description);
  }

  private connectHandler() {
    this.wasConnected = true;
    this.eventEmitter.emit('connectToManager');
  }

  private broadcasterHandler() {
    this.socket.emit('watcher');
  }

  answer(description: RTCSessionDescription): void {
    this.socket.emit('answer', description);
  }

  candidate(candidate: RTCIceCandidate): void {
    this.socket.emit('candidate', candidate);
  }

  close(): void {
    this.socket.close();
  }

  on<Event extends keyof ReceiverEvents>(event: Event, listener: ReceiverEvents[Event]): void {
    this.eventEmitter.on(event, listener);
  }
}

export default SocketReceiver;
