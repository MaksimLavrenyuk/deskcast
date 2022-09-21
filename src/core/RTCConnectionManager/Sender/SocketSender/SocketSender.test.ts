import { createServer } from 'http';
import { Server, Socket as ServerSocket } from 'socket.io';
import { io as Client, Socket as ClientSocket } from 'socket.io-client';
import SocketSender from './index';

const candidateMock: RTCIceCandidate = {
  address: null,
  candidate: 'candidate',
  component: null,
  foundation: null,
  port: null,
  priority: null,
  protocol: null,
  relatedAddress: null,
  relatedPort: null,
  sdpMLineIndex: null,
  sdpMid: null,
  tcpType: null,
  type: null,
  usernameFragment: null,
  toJSON() {
    return {
      candidate: 'candidate',
      sdpMLineIndex: null,
      sdpMid: null,
      usernameFragment: null,
    };
  },
};

const mockRTCSessionDescription: RTCSessionDescription = {
  sdp: 'sdp',
  type: 'offer',
  toJSON() {
    return {
      sdp: 'sdp',
      type: 'offer',
    };
  },
};

const mockDescriptionInit: RTCSessionDescriptionInit = {
  type: 'answer',
};

describe('Socket sender testing', () => {
  const watcherID = 'watcher-1234';
  let ioServer: Server;
  let serverSocket: ServerSocket;
  let clientSocket: ClientSocket;
  let socketSender: SocketSender;

  beforeAll((done) => {
    const httpServer = createServer();
    let uri: string;

    ioServer = new Server(httpServer);

    httpServer.listen(() => {
      const address = httpServer.address();

      if (typeof address === 'string') {
        uri = `http://localhost:${address}`;
        clientSocket = Client(uri);
      } else {
        uri = `http://localhost:${address.port}`;
        clientSocket = Client(uri);
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
    clientSocket.close();
  });

  it('Receiving events about the connected watcher', (done) => {
    socketSender.on('watcher', (arg) => {
      expect(arg).toBe(watcherID);
      done();
    });
    serverSocket.emit('watcher', watcherID);
  });

  it('Receiving an event about the disconnection of the watcher', (done) => {
    socketSender.on('disconnectPeer', (arg) => {
      expect(arg).toBe(watcherID);
      done();
    });
    serverSocket.emit('disconnectPeer', watcherID);
  });

  it('RTCIceCandidateInit API WebRTC dictionary get event', (done) => {
    socketSender.on('candidate', (id, candidate) => {
      expect(id).toBe(watcherID);
      expect(candidate.candidate === candidateMock.candidate);
      done();
    });
    serverSocket.emit('candidate', watcherID, candidateMock);
  });

  it('getting sdp data', (done) => {
    socketSender.on('answer', (id, candidate) => {
      expect(id).toBe(watcherID);
      expect(candidate.type === mockDescriptionInit.type);
      done();
    });

    serverSocket.emit('answer', watcherID, mockDescriptionInit);
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
      expect(id).toBe(watcherID);
      expect(description.type).toBe(mockRTCSessionDescription.type);
      done();
    });

    socketSender.offer(watcherID, mockRTCSessionDescription);
  });

  it('sending an candidate for RTCIceCandidate', (done) => {
    serverSocket.on('candidate', (id, description) => {
      expect(id).toBe(watcherID);
      expect(description.candidate).toBe(candidateMock.candidate);
      done();
    });

    socketSender.candidate(watcherID, candidateMock);
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
