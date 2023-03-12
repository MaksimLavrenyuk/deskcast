import { Sender } from '../Sender';

type BroadcasterDeps = {
  sender: Sender
}

type Connections = {
  [id: string]: RTCPeerConnection
};

const PEER_CONNECTION_CONFIG = {
  // iceServers: [
  //   {
  //     urls: 'stun:stun.l.google.com:19302',
  //   },
  // ],
};

class Broadcaster {
  private readonly sender: Sender;

  private readonly peerConnections: Connections;

  private stream: MediaStream | null;

  constructor(deps: BroadcasterDeps) {
    this.sender = deps.sender;
    this.peerConnections = {};
    this.stream = null;

    this.sender.on('answer', this.answerHandler);
    this.sender.on('watcher', this.watcherHandler);
    this.sender.on('candidate', this.candidateHandler);
    this.sender.on('disconnectPeer', this.disconnectPeerHandler);
  }

  private answerHandler = async (id: string, description: RTCSessionDescriptionInit) => {
    if (this.peerConnections[id]) {
      await this.peerConnections[id].setRemoteDescription(description);
    }
  };

  private watcherHandler = async (id: string) => {
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
    this.sender.offer(id, peerConnection.localDescription);
  };

  private iceCandidateHandler = (id: string, event: RTCPeerConnectionIceEventInit) => {
    if (event.candidate) {
      this.sender.candidate(id, event.candidate);
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
    this.sender.broadcaster();
  };

  public cancelStream = () => {
    this.stream = null;
    this.sender.cancel();
  };

  public dispose = () => {
    this.sender.close();
  };
}

export default Broadcaster;
