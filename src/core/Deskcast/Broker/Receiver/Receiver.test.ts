import { Server } from 'socket.io';
import { Socket as ServerSocket } from 'socket.io/dist/socket';
import { createServer } from 'http';
import Receiver from './index';
import { mockRTCSessionDescription, mockCandidate } from '../webrtc.mock';

describe('Socket receiver testing', () => {
  let ioServer: Server;
  let serverSocket: ServerSocket;
  let receiver: Receiver;

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

      receiver = new Receiver(uri);
      receiver.on('connectToManager', done);
    });
  });

  afterAll(() => {
    ioServer.close();
    receiver.close();
  });

  it('Getting an offer for RTCSessionDescription', (done) => {
    receiver.on('offer', (description) => {
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

    receiver.candidate(mockCandidate);
  });

  it('Sending rtc answer', (done) => {
    serverSocket.on('answer', (description: RTCIceCandidate) => {
      expect(description.candidate === mockRTCSessionDescription.type);
      done();
    });

    receiver.answer(mockRTCSessionDescription);
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

    receiver.on('closeBroadcast', mockCloseBroadcasterHandler);
    serverSocket.emit('closeBroadcast');
  });
});
