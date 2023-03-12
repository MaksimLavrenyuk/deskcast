import { io, Socket } from 'socket.io-client';

type Connections = {
  [id: string]: RTCPeerConnection
};

export type Payload = {
  id: string,
}

export type StreamerToBrokerEvents = {
  cancel: () => void
  offer: (payload: Payload & { description: RTCSessionDescription }) => void;
  candidate: (payload: Payload & { candidate: RTCIceCandidate | null }) => void
  startStream: () => void
}

export type BrokerToStreamerEvents = {
  watcher: (payload: Payload) => void
  candidate: (payload: Payload & { candidate: RTCIceCandidateInit }) => void
  answer: (payload: Payload & { description: RTCSessionDescriptionInit }) => void;
  disconnectPeer: (payload: Payload) => void
}

const PEER_CONNECTION_CONFIG = {
  // iceServers: [
  //   {
  //     urls: 'stun:stun.l.google.com:19302',
  //   },
  // ],
};

class Streamer {
  private socket: Socket<BrokerToStreamerEvents, StreamerToBrokerEvents>;

  private readonly peerConnections: Connections;

  private stream: MediaStream | null;

  constructor() {
    this.socket = io('ws://localhost:4002');
    this.peerConnections = {};
    this.stream = null;

    this.socket.on('answer', this.answerHandler);
    this.socket.on('watcher', this.watcherHandler);
    this.socket.on('candidate', this.candidateHandler);
    this.socket.on('disconnectPeer', this.disconnectPeerHandler);
  }

  private answerHandler = async (payload: Payload & { description: RTCSessionDescription }) => {
    if (this.peerConnections[payload.id]) {
      await this.peerConnections[payload.id].setRemoteDescription(payload.description);
    }
  };

  private watcherHandler = async (payload: Payload) => {
    const peerConnection = new RTCPeerConnection(PEER_CONNECTION_CONFIG);

    this.peerConnections[payload.id] = peerConnection;

    if (this.stream) {
      this.stream.getTracks().forEach((track) => peerConnection.addTrack(track, this.stream));
    }

    peerConnection.addEventListener('icecandidate', (event) => {
      this.iceCandidateHandler(payload.id, event);
    });

    const sdp = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(sdp);
    this.socket.emit('offer', { id: payload.id, description: peerConnection.localDescription });
  };

  private iceCandidateHandler = (id: string, event: RTCPeerConnectionIceEventInit) => {
    if (event.candidate) {
      this.socket.emit('candidate', { id, candidate: event.candidate });
    }
  };

  private candidateHandler = async (payload: Payload & { candidate: RTCIceCandidateInit | null }) => {
    if (this.peerConnections[payload.id] && payload.candidate) {
      await this.peerConnections[payload.id].addIceCandidate(new RTCIceCandidate(payload.candidate));
    }
  };

  private disconnectPeerHandler = (payload: Payload) => {
    const peerConnection = this.peerConnections[payload.id];

    if (peerConnection) {
      peerConnection.close();
      delete this.peerConnections[payload.id];
    }
  };

  public attachStream = (stream: MediaStream) => {
    this.stream = stream;
    this.socket.emit('startStream');
  };

  public cancelStream = () => {
    this.stream = null;
    this.socket.emit('cancel');
  };

  public dispose = () => {
    this.socket.close();
  };
}

export default Streamer;
