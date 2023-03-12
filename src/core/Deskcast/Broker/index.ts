import { Server, Socket as SocketDefault } from 'socket.io';
import { StreamerToBrokerEvents, BrokerToStreamerEvents } from '../Streamer';
import { WatcherToBrokerEvents, BrokerToWatcherEvents } from '../Watcher';

type SenderSocket = SocketDefault<StreamerToBrokerEvents, BrokerToStreamerEvents>;

type ReceiverSocket = SocketDefault<WatcherToBrokerEvents, BrokerToWatcherEvents>;

class Broker {
  public static PORT_STREAMER = 4002;

  public static PORT_WATCHER = 4003;

  private streamerSocket: SenderSocket | null;

  private readonly watcherSockets: Map<ReceiverSocket['id'], ReceiverSocket>;

  constructor() {
    this.streamerSocket = null;
    this.watcherSockets = new Map<ReceiverSocket['id'], ReceiverSocket>();
    const streamerServer = new Server(Broker.PORT_STREAMER, {
      cors: {
        origin: '*',
      },
    });

    const watcherServer = new Server(Broker.PORT_WATCHER, {
      cors: {
        origin: '*',
      },
    });

    streamerServer.sockets.on('error', this.errorHandler);
    streamerServer.sockets.on('connection', this.senderConnectionHandler);

    watcherServer.sockets.on('error', this.errorHandler);
    watcherServer.sockets.on('connection', this.receiverConnectionHandler);
  }

  private receiverConnectionHandler = (socket: ReceiverSocket) => {
    this.watcherSockets.set(socket.id, socket);

    socket.on('watcher', () => {
      this.streamerSocket.emit('watcher', socket.id);
    });

    socket.on('disconnect', () => {
      this.streamerSocket.emit('disconnectPeer', socket.id);
    });

    socket.on('answer', (description) => {
      this.streamerSocket.emit('answer', socket.id, description);
    });

    socket.on('candidate', (candidate) => {
      this.streamerSocket.emit('candidate', socket.id, candidate);
    });
  };

  private senderConnectionHandler = (socket: SenderSocket) => {
    this.streamerSocket = socket;

    socket.on('startStream', () => {
      this.watcherSockets.forEach((receiver) => {
        receiver.emit('startStream');
      });
    });
    socket.on('offer', (id, description) => {
      const receiver = this.watcherSockets.get(id);

      receiver.emit('offer', description);
    });

    socket.on('cancel', () => {
      this.watcherSockets.forEach((receiver) => {
        receiver.emit('cancelBroadcast');
      });
    });

    this.streamerSocket.on('disconnect', () => {
      this.watcherSockets.forEach((receiver) => {
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
