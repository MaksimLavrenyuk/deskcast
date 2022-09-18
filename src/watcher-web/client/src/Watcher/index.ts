import { StrictEventEmitter } from 'strict-event-emitter';
import { ConnectionManager } from './types';

type WatcherDeps = {
  connectionManager: ConnectionManager,
}

export type WatcherEvents = {
  stream(stream: MediaStream): void
}

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

class Watcher {
  private readonly connectionManager: ConnectionManager;

  private peerConnection: RTCPeerConnection | null;

  private eventEmitter: StrictEventEmitter<WatcherEvents>;

  constructor(deps: WatcherDeps) {
    this.connectionManager = deps.connectionManager;
    this.peerConnection = null;
    this.eventEmitter = new StrictEventEmitter<WatcherEvents>();

    this.connectionManager.on('candidate', this.candidateHandler);
    this.connectionManager.on('offer', this.offerHandler);
  }

  private offerHandler = async (description: RTCSessionDescriptionInit) => {
    this.peerConnection = new RTCPeerConnection(PEER_CONNECTION_CONFIG);
    this.peerConnection.addEventListener('track', this.trackHandler);
    this.peerConnection.addEventListener('icecandidate', this.iceCandidateHandler);

    try {
      await this.peerConnection.setRemoteDescription(description);
      const sdp = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(sdp);
      this.connectionManager.answer(this.peerConnection.localDescription);
    } catch (e) {
      console.log(e);
    }
  };

  private trackHandler = (event: RTCTrackEvent) => {
    this.eventEmitter.emit('stream', event.streams[0]);
  };

  private iceCandidateHandler = (event: RTCPeerConnectionIceEvent) => {
    this.connectionManager.candidate(event.candidate);
  };

  private candidateHandler = async (candidateInit: RTCIceCandidateInit) => {
    try {
      if (this.peerConnection) {
        await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidateInit));
      }
    } catch (e) {
      console.log(e);
    }
  };

  public addEventListener = <Event extends keyof WatcherEvents>(event: Event, listener: WatcherEvents[Event]) => {
    this.eventEmitter.on(event, listener);
  };

  public removeEventListener = <Event extends keyof WatcherEvents>(event: Event, listener: WatcherEvents[Event]) => {
    this.eventEmitter.removeListener(event, listener);
  };

  public dispose() {
    this.connectionManager.close();
    this.peerConnection.close();
  }
}

export default Watcher;
