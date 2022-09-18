import express from 'express';
import http from 'http';
import path from 'path';
import ip from 'ip';
import SocketConnectionManager from '../core/RTCConnectionManager/SocketConnectionManager';

const app = express();
const port = 4010;
const server = http.createServer(app);
const connectionManager = new SocketConnectionManager({ port: 4002 });

app.get('/', (req, res) => {
  res.sendFile(path.resolve('src/watcher-web/client/dist/index.html'));
});

app.use(express.static('node_modules'));
app.use(express.static(path.resolve('src/watcher-web/client/dist/')));
console.log(ip.address());

server.listen(port, ip.address(), () => console.log(`Server is running on port ${port}`));
