import { StrictEventEmitter } from 'strict-event-emitter';
import 'webrtc-adapter';
import { io, Socket } from 'socket.io-client';

export type StreamHandler = {
  (stream: MediaStream): void
}

export type WatcherEvents = {
  stream: StreamHandler
  cancelBroadcast(): void
  closeBroadcast(): void
}

export type WatcherToBrokerEvents = {
  answer: (description: RTCSessionDescription) => void;
  candidate: (candidate: RTCIceCandidate) => void
  watcher: () => void
}

export type BrokerToWatcherEvents = {
  cancelBroadcast: () => void
  closeBroadcast: () => void
  startStream: () => void
  offer: (description: RTCSessionDescriptionInit) => void;
}

const PEER_CONNECTION_CONFIG = {
  // iceServers: [
  //   {
  //     urls: 'stun:stun.l.google.com:19302',
  //   },
  // ],
};

class Watcher {
  private socket: Socket<BrokerToWatcherEvents, WatcherToBrokerEvents>;

  private peerConnection: RTCPeerConnection | null;

  private eventEmitter: StrictEventEmitter<WatcherEvents>;

  constructor(uri: string) {
    this.socket = io(uri);
    this.peerConnection = null;
    this.eventEmitter = new StrictEventEmitter<WatcherEvents>();

    this.socket.on('connect', () => console.log('connect'));
    this.socket.on('offer', this.offerHandler);
    this.socket.on('startStream', this.attachStreamHandler);
    this.socket.on('closeBroadcast', this.closeBroadcastHandler);
    this.socket.on('cancelBroadcast', this.cancelBroadcastHandler);
    this.socket.emit('watcher');
  }

  private attachStreamHandler = () => {
    this.socket.emit('watcher');
  };

  private offerHandler = async (description: RTCSessionDescriptionInit) => {
    this.peerConnection = new RTCPeerConnection(PEER_CONNECTION_CONFIG);
    this.peerConnection.addEventListener('track', this.trackHandler);
    this.peerConnection.addEventListener('icecandidate', this.iceCandidateHandler);

    try {
      await this.peerConnection.setRemoteDescription(description);
      const sdp = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(sdp);
      this.socket.emit('answer', this.peerConnection.localDescription);
    } catch (e) {
      console.log(e);
    }
  };

  private closeBroadcastHandler = () => {
    this.eventEmitter.emit('closeBroadcast');
  };

  private cancelBroadcastHandler = () => {
    this.eventEmitter.emit('cancelBroadcast');
    this.peerConnection = null;
  };

  private trackHandler = (event: RTCTrackEvent) => {
    this.eventEmitter.emit('stream', event.streams[0]);
  };

  private iceCandidateHandler = (event: RTCPeerConnectionIceEvent) => {
    this.socket.emit('candidate', event.candidate);
  };

  public addEventListener = <Event extends keyof WatcherEvents>(event: Event, listener: WatcherEvents[Event]) => {
    this.eventEmitter.on(event, listener);
  };

  public removeEventListener = <Event extends keyof WatcherEvents>(event: Event, listener: WatcherEvents[Event]) => {
    this.eventEmitter.removeListener(event, listener);
  };

  public dispose() {
    this.socket.close();
    this.peerConnection.close();
  }
}

export default Watcher;
