import { io, Socket } from 'socket.io-client';
import { StrictEventEmitter } from 'strict-event-emitter';
import { SenderEvents, Sender } from '../index';
import { ManagerToSenderEvents, SenderToManagerEvents } from '../../types';

class SocketSender implements Sender {
  private socket: Socket<ManagerToSenderEvents, SenderToManagerEvents>;

  private eventEmitter: StrictEventEmitter<SenderEvents>;

  constructor(uri: string) {
    this.socket = io(uri);
    this.eventEmitter = new StrictEventEmitter();

    this.socket.on('connect', this.connectHandler);
    this.socket.on('answer', this.answerHandler);
    this.socket.on('watcher', this.watcherHandler);
    this.socket.on('candidate', this.candidateHandler);
    this.socket.on('disconnectPeer', this.disconnectPeerHandler);
  }

  private connectHandler = () => {
    this.eventEmitter.emit('connectToManager');
  };

  private answerHandler = (id: string, description: RTCSessionDescription) => {
    this.eventEmitter.emit('answer', id, description);
  };

  private watcherHandler = (id: string) => {
    this.eventEmitter.emit('watcher', id);
  };

  private candidateHandler = (id: string, candidate: RTCIceCandidateInit) => {
    this.eventEmitter.emit('candidate', id, candidate);
  };

  private disconnectPeerHandler = (id: string) => {
    this.eventEmitter.emit('disconnectPeer', id);
  };

  public on = <Event extends keyof SenderEvents>(event: Event, listener: SenderEvents[Event]) => {
    this.eventEmitter.on(event, listener);
  };

  public candidate = (id: string, candidate: RTCIceCandidate) => {
    this.socket.emit('candidate', id, candidate);
  };

  public offer = (id: string, description: RTCSessionDescription) => {
    this.socket.emit('offer', id, description);
  };

  public broadcaster() {
    this.socket.emit('broadcaster');
  }

  public cancel = () => {
    this.socket.emit('cancel');
  };

  public close = () => {
    this.socket.close();
  };
}

export default SocketSender;
