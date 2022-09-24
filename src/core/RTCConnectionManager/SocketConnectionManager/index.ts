import { Server, Socket as SocketDefault } from 'socket.io';
import {
  ManagerToReceiverEvents,
  ManagerToSenderEvents,
  ReceiverToManagerEvents,
  SenderToManagerEvents,
} from '../types';

type BrockerProps = {
  senderPort: number
  receiverPort: number
}

type ListenEvents = {
  connection: (socket: SocketDefault) => void
} & ReceiverToManagerEvents & SenderToManagerEvents;

type EmitEvents = ManagerToSenderEvents & ManagerToReceiverEvents;

export type Socket = SocketDefault<ListenEvents, EmitEvents>;

type SenderSocket = SocketDefault<
  { connection: (socket: SocketDefault) => void } & SenderToManagerEvents,
  ManagerToSenderEvents>;

type ReceiverSocket = SocketDefault<
  { connection: (socket: SocketDefault) => void } & ReceiverToManagerEvents,
  ManagerToReceiverEvents>;

class SocketConnectionManager {
  private senderSocket: SenderSocket | null;

  private readonly receiverSockets: Map<ReceiverSocket['id'], ReceiverSocket>;

  constructor(props: BrockerProps) {
    this.senderSocket = null;
    this.receiverSockets = new Map<ReceiverSocket['id'], ReceiverSocket>();
    const senderServer = new Server(props.senderPort, {
      cors: {
        origin: '*',
      },
    });

    const receiverServer = new Server(props.receiverPort, {
      cors: {
        origin: '*',
      },
    });

    senderServer.sockets.on('error', this.errorHandler);
    senderServer.sockets.on('connection', this.senderConnectionHandler);

    receiverServer.sockets.on('error', this.errorHandler);
    receiverServer.sockets.on('connection', this.receiverConnectionHandler);
  }

  private receiverConnectionHandler = (socket: ReceiverSocket) => {
    this.receiverSockets.set(socket.id, socket);

    socket.on('watcher', () => {
      this.senderSocket.emit('watcher', socket.id);
    });

    socket.on('disconnect', () => {
      this.senderSocket.emit('disconnectPeer', socket.id);
    });

    socket.on('answer', (description) => {
      this.senderSocket.emit('answer', socket.id, description);
    });

    socket.on('candidate', (candidate) => {
      this.senderSocket.emit('candidate', socket.id, candidate);
    });
  };

  private senderConnectionHandler = (socket: SenderSocket) => {
    this.senderSocket = socket;

    this.senderSocket.on('broadcaster', () => {
      this.receiverSockets.forEach((receiver) => {
        receiver.emit('broadcaster');
      });
    });
    this.senderSocket.on('offer', (id, description) => {
      const receiver = this.receiverSockets.get(id);

      receiver.emit('offer', description);
    });
  };

  // eslint-disable-next-line class-methods-use-this
  private errorHandler(error: unknown) {
    console.log(error);
  }
}

export default SocketConnectionManager;
