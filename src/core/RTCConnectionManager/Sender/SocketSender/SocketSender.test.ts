import { createServer } from 'http';
import { Server, Socket as ServerSocket } from 'socket.io';
import SocketSender from './index';
import { mockCandidate, mockRTCSessionDescription, mockDescriptionInit } from '../../mocks/webrtc';

describe('Socket sender testing', () => {
  const receiverID = 'watcher-1234';
  let ioServer: Server;
  let serverSocket: ServerSocket;
  let socketSender: SocketSender;

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

      socketSender = new SocketSender(uri);
      socketSender.on('connectToManager', done);
    });
  });

  afterAll(() => {
    ioServer.close();
    socketSender.close();
  });

  it('Receiving events about the connected watcher', (done) => {
    socketSender.on('watcher', (arg) => {
      expect(arg).toBe(receiverID);
      done();
    });
    serverSocket.emit('watcher', receiverID);
  });

  it('Receiving an event about the disconnection of the watcher', (done) => {
    socketSender.on('disconnectPeer', (arg) => {
      expect(arg).toBe(receiverID);
      done();
    });
    serverSocket.emit('disconnectPeer', receiverID);
  });

  it('RTCIceCandidateInit API WebRTC dictionary get event', (done) => {
    socketSender.on('candidate', (id, candidate) => {
      expect(id).toBe(receiverID);
      expect(candidate.candidate === mockCandidate.candidate);
      done();
    });
    serverSocket.emit('candidate', receiverID, mockCandidate);
  });

  it('getting sdp data', (done) => {
    socketSender.on('answer', (id, candidate) => {
      expect(id).toBe(receiverID);
      expect(candidate.type === mockDescriptionInit.type);
      done();
    });

    serverSocket.emit('answer', receiverID, mockDescriptionInit);
  });

  it('Notify the master of the creation of the broadcaster', (done) => {
    const mockBroadcasterHandler = jest.fn(() => {
      expect(mockBroadcasterHandler).toBeCalled();
      done();
    });
    serverSocket.on('broadcaster', mockBroadcasterHandler);

    socketSender.broadcaster();
  });

  it('sending an offer for RTCSessionDescription', (done) => {
    serverSocket.on('offer', (id, description) => {
      expect(id).toBe(receiverID);
      expect(description.type).toBe(mockRTCSessionDescription.type);
      done();
    });

    socketSender.offer(receiverID, mockRTCSessionDescription);
  });

  it('sending an candidate for RTCIceCandidate', (done) => {
    serverSocket.on('candidate', (id, description) => {
      expect(id).toBe(receiverID);
      expect(description.candidate).toBe(mockCandidate.candidate);
      done();
    });

    socketSender.candidate(receiverID, mockCandidate);
  });

  it('connection closing', (done) => {
    const mockCloseHandler = jest.fn(() => {
      expect(mockCloseHandler).toBeCalled();
      done();
    });

    serverSocket.on('disconnect', mockCloseHandler);

    socketSender.close();
  });
});
