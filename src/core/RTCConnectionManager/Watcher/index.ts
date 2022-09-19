import { StrictEventEmitter } from 'strict-event-emitter';
import { Receiver } from '../Receiver';

type WatcherDeps = {
  receiver: Receiver,
}

export type StreamHandler = {
  (stream: MediaStream): void
}

export type WatcherEvents = {
  stream: StreamHandler
}

const PEER_CONNECTION_CONFIG = {
  iceServers: [
    {
      urls: 'stun:stun.l.google.com:19302',
    },
  ],
};

class Watcher {
  private readonly connectionReceiver: Receiver;

  private peerConnection: RTCPeerConnection | null;

  private eventEmitter: StrictEventEmitter<WatcherEvents>;

  constructor(deps: WatcherDeps) {
    this.connectionReceiver = deps.receiver;
    this.peerConnection = null;
    this.eventEmitter = new StrictEventEmitter<WatcherEvents>();

    this.connectionReceiver.on('candidate', this.candidateHandler);
    this.connectionReceiver.on('offer', this.offerHandler);
  }

  private offerHandler = async (description: RTCSessionDescriptionInit) => {
    this.peerConnection = new RTCPeerConnection(PEER_CONNECTION_CONFIG);
    this.peerConnection.addEventListener('track', this.trackHandler);
    this.peerConnection.addEventListener('icecandidate', this.iceCandidateHandler);

    try {
      await this.peerConnection.setRemoteDescription(description);
      const sdp = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(sdp);
      this.connectionReceiver.answer(this.peerConnection.localDescription);
    } catch (e) {
      console.log(e);
    }
  };

  private trackHandler = (event: RTCTrackEvent) => {
    this.eventEmitter.emit('stream', event.streams[0]);
  };

  private iceCandidateHandler = (event: RTCPeerConnectionIceEvent) => {
    this.connectionReceiver.candidate(event.candidate);
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
    this.connectionReceiver.close();
    this.peerConnection.close();
  }
}

export default Watcher;
