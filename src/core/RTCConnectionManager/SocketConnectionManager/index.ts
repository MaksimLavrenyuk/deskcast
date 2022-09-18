import { Server, Socket as SocketDefault } from 'socket.io';
import {
  ManagerToReceiverEvents,
  ManagerToSenderEvents,
  ReceiverToManagerEvents,
  SenderToManagerEvents,
} from '../types';

type BrockerProps = {
  port: number
}

type ListenEvents = {
  connection: (socket: SocketDefault) => void
} & ReceiverToManagerEvents & SenderToManagerEvents;

type EmitEvents = ManagerToSenderEvents & ManagerToReceiverEvents;

type Socket = SocketDefault<ListenEvents, EmitEvents>;

class SocketConnectionManager {
  private io: Server<ListenEvents, EmitEvents>;

  private broadcaster: string | null;

  constructor(props: BrockerProps) {
    this.broadcaster = null;
    this.io = new Server(props.port, {
      cors: {
        origin: '*',
      },
    });

    this.connectionHandler = this.connectionHandler.bind(this);
    this.createBroadcasterHandler = this.createBroadcasterHandler.bind(this);
    this.createOfferHandler = this.createOfferHandler.bind(this);
    this.createAnswerHandler = this.createAnswerHandler.bind(this);

    this.io.sockets.on('error', this.errorHandler);
    this.io.sockets.on('connection', this.connectionHandler);
  }

  private connectionHandler(socket: Socket) {
    socket.on('broadcaster', this.createBroadcasterHandler(socket));
    socket.on('watcher', this.createWatcherHandler(socket));
    socket.on('offer', this.createOfferHandler(socket));
    socket.on('answer', this.createAnswerHandler(socket));
    socket.on('candidate', this.createCandidateHandler(socket));
    socket.on('disconnect', this.createDisconnectHandler(socket));
  }

  private createBroadcasterHandler(socket: Socket) {
    return () => {
      this.broadcaster = socket.id;
      socket.broadcast.emit('broadcaster');
    };
  }

  private createWatcherHandler(socket: Socket) {
    return () => {
      if (this.broadcaster) {
        socket.to(this.broadcaster).emit('watcher', socket.id);
      }
    };
  }

  // eslint-disable-next-line class-methods-use-this
  private createOfferHandler(socket: Socket) {
    return (id: string, description: RTCSessionDescription) => {
      socket.to(id).emit('offer', socket.id, description);
    };
  }

  // eslint-disable-next-line class-methods-use-this
  private createAnswerHandler(socket: Socket) {
    return (id: string, description: RTCSessionDescription) => {
      socket.to(id).emit('answer', socket.id, description);
    };
  }

  // eslint-disable-next-line class-methods-use-this
  private createCandidateHandler(socket: Socket) {
    return (id: string, candidate: RTCIceCandidate) => {
      socket.to(id).emit('candidate', socket.id, candidate);
    };
  }

  private createDisconnectHandler(socket: Socket) {
    return () => {
      if (this.broadcaster) {
        socket.to(this.broadcaster).emit('disconnectPeer', socket.id);
      }
    };
  }

  // eslint-disable-next-line class-methods-use-this
  private errorHandler(error: unknown) {
    console.log(error);
  }
}

export default SocketConnectionManager;
