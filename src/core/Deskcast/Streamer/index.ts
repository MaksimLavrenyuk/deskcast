import { io, Socket } from 'socket.io-client';

type Connections = {
  [id: string]: RTCPeerConnection
};

export type StreamerToBrokerEvents = {
  cancel: () => void
  offer: (id: string, description: RTCSessionDescription) => void;
  candidate: (id: string, candidate: RTCIceCandidate) => void
  broadcaster: () => void
}

export type BrokerToStreamerEvents = {
  watcher: (id: string) => void
  candidate: (id: string, candidate: RTCIceCandidateInit) => void
  answer: (id: string, description: RTCSessionDescriptionInit) => void;
  disconnectPeer: (id: string) => void
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

  private answerHandler = async (id: string, description: RTCSessionDescriptionInit) => {
    if (this.peerConnections[id]) {
      await this.peerConnections[id].setRemoteDescription(description);
    }
  };

  private watcherHandler = async (id: string) => {
    console.log('watcher');
    const peerConnection = new RTCPeerConnection(PEER_CONNECTION_CONFIG);

    this.peerConnections[id] = peerConnection;

    if (this.stream) {
      this.stream.getTracks().forEach((track) => peerConnection.addTrack(track, this.stream));
    }

    peerConnection.addEventListener('icecandidate', (event) => {
      this.iceCandidateHandler(id, event);
    });

    const sdp = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(sdp);
    this.socket.emit('offer', id, peerConnection.localDescription);
  };

  private iceCandidateHandler = (id: string, event: RTCPeerConnectionIceEventInit) => {
    if (event.candidate) {
      this.socket.emit('candidate', id, event.candidate);
    }
  };

  private candidateHandler = async (id: string, candidate: RTCIceCandidateInit | null) => {
    if (this.peerConnections[id] && candidate) {
      await this.peerConnections[id].addIceCandidate(new RTCIceCandidate(candidate));
    }
  };

  private disconnectPeerHandler = (id: string) => {
    const peerConnection = this.peerConnections[id];

    if (peerConnection) {
      peerConnection.close();
      delete this.peerConnections[id];
    }
  };

  public attachStream = (stream: MediaStream) => {
    this.stream = stream;
    this.socket.emit('broadcaster');
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
