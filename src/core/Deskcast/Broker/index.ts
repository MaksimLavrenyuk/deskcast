import { Server, Socket as SocketDefault } from 'socket.io';
import { StreamerToBrokerEvents, BrokerToStreamerEvents } from '../Streamer';
import { WatcherToBrokerEvents, BrokerToWatcherEvents } from '../Watcher';

type SenderSocket = SocketDefault<StreamerToBrokerEvents, BrokerToStreamerEvents>;

type ReceiverSocket = SocketDefault<WatcherToBrokerEvents, BrokerToWatcherEvents>;

class Broker {
  public static PORT_SENDER = 4002;

  public static PORT_RECEIVER = 4003;

  private senderSocket: SenderSocket | null;

  private readonly receiverSockets: Map<ReceiverSocket['id'], ReceiverSocket>;

  constructor() {
    this.senderSocket = null;
    this.receiverSockets = new Map<ReceiverSocket['id'], ReceiverSocket>();
    const senderServer = new Server(Broker.PORT_SENDER, {
      cors: {
        origin: '*',
      },
    });

    const receiverServer = new Server(Broker.PORT_RECEIVER, {
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

    socket.on('broadcaster', () => {
      this.receiverSockets.forEach((receiver) => {
        receiver.emit('broadcaster');
      });
    });
    socket.on('offer', (id, description) => {
      const receiver = this.receiverSockets.get(id);

      receiver.emit('offer', description);
    });

    socket.on('cancel', () => {
      this.receiverSockets.forEach((receiver) => {
        receiver.emit('cancelBroadcast');
      });
    });

    this.senderSocket.on('disconnect', () => {
      this.receiverSockets.forEach((receiver) => {
        receiver.emit('closeBroadcast');
      });
    });
  };

  // eslint-disable-next-line class-methods-use-this
  private errorHandler(error: unknown) {
    console.log(error);
  }
}

export default Broker;
