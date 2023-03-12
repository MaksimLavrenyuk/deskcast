import { Server, Socket } from 'socket.io';
import { nanoid } from 'nanoid';
import { StreamerToBrokerEvents, BrokerToStreamerEvents, Payload } from '../Streamer';
import isType from '../../../utils/guards/isType';

type SenderSocket = Socket<StreamerToBrokerEvents, BrokerToStreamerEvents>;

class Broker {
  public static PORT_STREAMER = 4002;

  public static PORT_WATCHER = 4003;

  private streamerSocket: SenderSocket | null;

  private readonly watcherSockets = new Map<string, Socket>();

  constructor() {
    this.streamerSocket = null;
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
    streamerServer.sockets.on('connection', (socket) => {
      this.streamerSocket = socket;

      socket.onAny((event, ...args) => {
        const payload = args[0];

        if (isType<Payload>(payload, 'id')) {
          const { id, ...rest } = payload;
          const watcher = this.watcherSockets.get(id);

          watcher.emit(event, rest);
        } else {
          this.watcherSockets.forEach((watcher) => {
            watcher.emit(event);
          });
        }
      });
    });

    watcherServer.sockets.on('error', this.errorHandler);
    watcherServer.sockets.on('connection', (socket) => {
      const watcherID = nanoid();
      this.watcherSockets.set(watcherID, socket);

      socket.onAny((event, ...args) => {
        this.streamerSocket.emit(event, { id: watcherID, ...args[0] });
      });
    });
  }

  // eslint-disable-next-line class-methods-use-this
  private errorHandler(error: unknown) {
    console.log(error);
  }
}

export default Broker;
