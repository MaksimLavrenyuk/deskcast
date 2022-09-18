import { ConnectionManager } from './types';

type BroadcasterDeps = {
  connectionManager: ConnectionManager
}

type Connections = {
  [id: string]: RTCPeerConnection
};

const PEER_CONNECTION_CONFIG = {
  iceServers: [
    {
      urls: 'stun:stun.l.google.com:19302',
    },
    // {
    //   "urls": "turn:TURN_IP?transport=tcp",
    //   "username": "TURN_USERNAME",
    //   "credential": "TURN_CREDENTIALS"
    // }
  ],
};

class Broadcaster {
  private readonly connectionManager: ConnectionManager;

  private readonly peerConnections: Connections;

  private stream: MediaStream | null;

  constructor(deps: BroadcasterDeps) {
    this.connectionManager = deps.connectionManager;
    this.peerConnections = {};
    this.stream = null;

    this.answerHandler = this.answerHandler.bind(this);
    this.watcherHandler = this.watcherHandler.bind(this);
    this.attachStream = this.attachStream.bind(this);
    this.iceCandidateHandler = this.iceCandidateHandler.bind(this);
    this.candidateHandler = this.candidateHandler.bind(this);
    this.disconnectPeerHandler = this.disconnectPeerHandler.bind(this);
    this.dispose = this.dispose.bind(this);

    this.connectionManager.on('answer', this.answerHandler);
    this.connectionManager.on('watcher', this.watcherHandler);
    this.connectionManager.on('candidate', this.candidateHandler);
    this.connectionManager.on('disconnectPeer', this.disconnectPeerHandler);
  }

  private async answerHandler(id: string, description: RTCSessionDescriptionInit) {
    if (this.peerConnections[id]) {
      await this.peerConnections[id].setRemoteDescription(description);
    }
  }

  private async watcherHandler(id: string) {
    console.log('watcherHandler');
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
    this.connectionManager.offer(id, peerConnection.localDescription);
  }

  private iceCandidateHandler(id: string, event: RTCPeerConnectionIceEventInit) {
    if (event.candidate) {
      this.connectionManager.candidate(id, event.candidate);
    }
  }

  private async candidateHandler(id: string, candidate: RTCIceCandidateInit | null) {
    if (this.peerConnections[id] && candidate) {
      await this.peerConnections[id].addIceCandidate(new RTCIceCandidate(candidate));
    }
  }

  private disconnectPeerHandler(id: string) {
    const peerConnection = this.peerConnections[id];

    if (peerConnection) {
      peerConnection.close();
      delete this.peerConnections[id];
    }
  }

  public attachStream(stream: MediaStream) {
    this.stream = stream;
    this.connectionManager.broadcaster();
  }

  public dispose() {
    this.connectionManager.close();
  }
}

export default Broadcaster;
