import { io, Socket } from 'socket.io-client';
import { StrictEventEmitter } from 'strict-event-emitter';
import { ConnectionManager, ConnectionEvents } from '../types';

type ServerToClientEvents = {
  watcher: (id: string) => void
  candidate: (id: string, candidate: RTCIceCandidateInit) => void
  answer: (id: string, description: RTCSessionDescriptionInit) => void;
  disconnectPeer: (id: string) => void
}

type ClientToServerEvents = {
  offer: (id: string, description: RTCSessionDescription) => void;
  candidate: (id: string, candidate: RTCIceCandidate) => void
  broadcaster: () => void
}

class Sender implements ConnectionManager {
  private socket: Socket<ServerToClientEvents, ClientToServerEvents>;

  private eventEmitter: StrictEventEmitter<ConnectionEvents>;

  constructor() {
    this.socket = io('ws://localhost:4002');
    this.eventEmitter = new StrictEventEmitter();
    this.answerHandler = this.answerHandler.bind(this);
    this.watcherHandler = this.watcherHandler.bind(this);
    this.candidateHandler = this.candidateHandler.bind(this);
    this.disconnectPeerHandler = this.disconnectPeerHandler.bind(this);
    this.candidate = this.candidate.bind(this);
    this.offer = this.offer.bind(this);
    this.on = this.on.bind(this);
    this.close = this.close.bind(this);

    this.socket.on('answer', this.answerHandler);
    this.socket.on('watcher', this.watcherHandler);
    this.socket.on('candidate', this.candidateHandler);
    this.socket.on('disconnectPeer', this.disconnectPeerHandler);
  }

  private answerHandler(id: string, description: RTCSessionDescriptionInit) {
    console.log('answer');
    this.eventEmitter.emit('answer', id, description);
  }

  private watcherHandler(id: string) {
    this.eventEmitter.emit('watcher', id);
  }

  private candidateHandler(id: string, candidate: RTCIceCandidateInit) {
    this.eventEmitter.emit('candidate', id, candidate);
  }

  private disconnectPeerHandler(id: string) {
    this.eventEmitter.emit('disconnectPeer', id);
  }

  public on<Event extends keyof ConnectionEvents>(event: Event, listener: ConnectionEvents[Event]) {
    this.eventEmitter.on(event, listener);
  }

  public candidate(id: string, candidate: RTCIceCandidate) {
    this.socket.emit('candidate', id, candidate);
  }

  public offer(id: string, description: RTCSessionDescription) {
    this.socket.emit('offer', id, description);
  }

  public broadcaster() {
    this.socket.emit('broadcaster');
  }

  public close() {
    this.socket.close();
  }
}

export default Sender;
