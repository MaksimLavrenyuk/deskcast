import express from 'express';
import http from 'http';
import path from 'path';
import ip from 'ip';
import SocketConnectionManager from '../core/RTCConnectionManager/SocketConnectionManager';

const watcherPort = 4010;
const rtcConnectionManagerPort = 4002;
const addressInnLocalNetwork = ip.address();

const app = express();
const server = http.createServer(app);
const connectionManager = new SocketConnectionManager({ port: rtcConnectionManagerPort });

app.get('/', (req, res) => {
  res.sendFile(path.resolve('src/watcher-web/client/dist/index.html'));
});

app.get('/connection_uri', (req, res) => {
  res.send({ url: `ws://${addressInnLocalNetwork}:${rtcConnectionManagerPort}` });
});

app.use(express.static('node_modules'));
app.use(express.static(path.resolve('src/watcher-web/client/dist/')));
console.log(ip.address());

server.listen(watcherPort, addressInnLocalNetwork, () => console.log(`Server is running on port ${watcherPort}`));
