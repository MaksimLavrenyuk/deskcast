import { io, Socket } from 'socket.io-client';
import { StrictEventEmitter } from 'strict-event-emitter';
import { Receiver, ReceiverEvents } from './index';
import { ManagerToReceiverEvents, ReceiverToManagerEvents } from '../types';

class SocketReceiver implements Receiver {
  private socket: Socket<ManagerToReceiverEvents, ReceiverToManagerEvents>;

  private eventEmitter: StrictEventEmitter<ReceiverEvents>;

  private connectionID: string | null;

  private wasConnected: boolean;

  constructor() {
    this.socket = io('ws://192.168.1.241:4002');
    this.eventEmitter = new StrictEventEmitter();
    this.connectionID = null;
    this.wasConnected = false;

    this.offerHandler = this.offerHandler.bind(this);
    this.close = this.close.bind(this);
    this.connectHandler = this.connectHandler.bind(this);
    this.broadcasterHandler = this.broadcasterHandler.bind(this);
    this.answer = this.answer.bind(this);

    this.socket.on('offer', this.offerHandler);
    this.socket.on('connect', this.connectHandler);
    this.socket.on('broadcaster', this.broadcasterHandler);
  }

  private offerHandler(id: string, description: RTCSessionDescriptionInit) {
    this.connectionID = id;
    this.eventEmitter.emit('offer', description);
  }

  private connectHandler() {
    this.wasConnected = true;
  }

  private broadcasterHandler() {
    this.socket.emit('watcher');
  }

  answer(description: RTCSessionDescription): void {
    if (this.connectionID) {
      this.socket.emit('answer', this.connectionID, description);
    }
  }

  candidate(candidate: RTCIceCandidate): void {
    if (this.connectionID) {
      this.socket.emit('candidate', this.connectionID, candidate);
    }
  }

  close(): void {
    this.socket.close();
  }

  connect(): void {
    this.socket.emit('watcher');
  }

  on<Event extends keyof ReceiverEvents>(event: Event, listener: ReceiverEvents[Event]): void {
    this.eventEmitter.on(event, listener);
  }
}

export default SocketReceiver;
