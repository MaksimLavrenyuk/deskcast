import { Server } from 'socket.io';
import { Socket as ServerSocket } from 'socket.io/dist/socket';
import { createServer } from 'http';
import SocketReceiver from './SocketReceiver';
import { mockRTCSessionDescription, mockCandidate } from '../../mocks/webrtc';

describe('Socket receiver testing', () => {
  let ioServer: Server;
  let serverSocket: ServerSocket;
  let socketReceiver: SocketReceiver;

  beforeAll((done) => {
    const httpServer = createServer();
    let uri: string;

    ioServer = new Server(httpServer);

    httpServer.listen(() => {
      const address = httpServer.address();

      if (typeof address === 'string') {
        uri = `http://localhost:${address}`;
      } else {
        uri = `http://localhost:${address.port}`;
      }

      ioServer.on('connection', (socket) => {
        serverSocket = socket;
      });

      socketReceiver = new SocketReceiver(uri);
      socketReceiver.on('connectToManager', done);
    });
  });

  afterAll(() => {
    ioServer.close();
    socketReceiver.close();
  });

  it('Getting an offer for RTCSessionDescription', (done) => {
    socketReceiver.on('offer', (description) => {
      expect(description.type).toBe(mockRTCSessionDescription.type);
      done();
    });

    serverSocket.emit('offer', mockRTCSessionDescription);
  });

  it('Sending rtc candidate', (done) => {
    serverSocket.on('candidate', (description: RTCIceCandidate) => {
      expect(description.candidate === mockCandidate.candidate);
      done();
    });

    socketReceiver.candidate(mockCandidate);
  });

  it('Sending rtc answer', (done) => {
    serverSocket.on('answer', (description: RTCIceCandidate) => {
      expect(description.candidate === mockRTCSessionDescription.type);
      done();
    });

    socketReceiver.answer(mockRTCSessionDescription);
  });

  it('Send a preview message after the broadcaster has created the stream', (done) => {
    const mockWatcherHandler = jest.fn(() => {
      expect(mockWatcherHandler).toBeCalled();
      done();
    });

    serverSocket.on('watcher', mockWatcherHandler);
    serverSocket.emit('broadcaster');
  });

  it('Broadcast termination processing', (done) => {
    const mockCloseBroadcasterHandler = jest.fn(() => {
      expect(mockCloseBroadcasterHandler).toBeCalled();
      done();
    });

    socketReceiver.on('closeBroadcast', mockCloseBroadcasterHandler);
    serverSocket.emit('closeBroadcast');
  });
});
