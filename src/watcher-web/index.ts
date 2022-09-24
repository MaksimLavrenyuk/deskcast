import express from 'express';
import http from 'http';
import path from 'path';
import ip from 'ip';
import SocketConnectionManager from '../core/RTCConnectionManager/SocketConnectionManager';

const watcherPort = 4010;
const portSenderSocketConnection = 4002;
const portReceiverSocketConnection = 4003;
const addressInLocalNetwork = ip.address();

const app = express();
const server = http.createServer(app);
const connectionManager = new SocketConnectionManager({
  senderPort: portSenderSocketConnection,
  receiverPort: portReceiverSocketConnection,
});

app.get('/', (req, res) => {
  res.sendFile(path.resolve('src/watcher-web/client/dist/index.html'));
});

app.get('/connection_sender_uri', (req, res) => {
  res.send({ url: `ws://${addressInLocalNetwork}:${portSenderSocketConnection}` });
});

app.get('/connection_receiver_uri', (req, res) => {
  res.send({ url: `ws://${addressInLocalNetwork}:${portReceiverSocketConnection}` });
});

app.use(express.static('node_modules'));
app.use(express.static(path.resolve('src/watcher-web/client/dist/')));
console.log(ip.address());

server.listen(watcherPort, addressInLocalNetwork, () => console.log(`Server is running on port ${watcherPort}`));
