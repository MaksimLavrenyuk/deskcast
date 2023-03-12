import ip from 'ip';
import express from 'express';
import http from 'http';
import path from 'path';
import Broker from '../../core/Deskcast/Broker';

class WatcherServer {
  private static WATCHER_PORT = 4010;

  private readonly addressInLocalNetwork: string;

  constructor() {
    this.addressInLocalNetwork = ip.address();

    const watcherApp = express();
    const watcherServer = http.createServer(watcherApp);
    const broker = new Broker();

    watcherApp.use(express.static('node_modules'));
    // watcherApp.use(express.static(path.resolve('src/watcher-web/client/dist/')));
    watcherApp.use(express.static(path.join(__dirname, 'watcher-web/client/dist')));

    watcherApp.get('/', (req, res) => {
      // res.sendFile(path.resolve('src/watcher-web/client/dist/index.html'));
      res.sendFile(path.join(__dirname, 'watcher-web/client/dist/index.html'));
    });

    watcherApp.get('/connection_sender_uri', (req, res) => {
      res.send({ url: `ws://${this.addressInLocalNetwork}:${Broker.PORT_SENDER}` });
    });

    watcherApp.get('/connection_receiver_uri', (req, res) => {
      res.send({ url: `ws://${this.addressInLocalNetwork}:${Broker.PORT_RECEIVER}` });
    });

    watcherServer.listen(
      WatcherServer.WATCHER_PORT,
      this.addressInLocalNetwork,
      () => console.log(`\nWatcher server is running on port ${WatcherServer.WATCHER_PORT}`),
    );
  }

  getWatcherServerLink = () => `http://${this.addressInLocalNetwork}:${WatcherServer.WATCHER_PORT}`;
}

export default WatcherServer;
