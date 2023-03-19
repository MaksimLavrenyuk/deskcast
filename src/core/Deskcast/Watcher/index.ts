import { StrictEventEmitter } from 'strict-event-emitter';
import 'webrtc-adapter';
import { io, Socket } from 'socket.io-client';
import Logger from '../../Logger/types';

export type StreamHandler = {
  (stream: MediaStream): void
}

export type WatcherEvents = {
  stream: StreamHandler
  cancelStream(): void
  closeStream(): void
}

export type WatcherToBrokerEvents = {
  answer: (payload: { description: RTCSessionDescription }) => void;
  candidate: (payload: { candidate: RTCIceCandidate }) => void
  watch: () => void
}

export type BrokerToWatcherEvents = {
  cancelStream: () => void
  offer: (payload: { description: RTCSessionDescriptionInit }) => void;
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

  private logger: Logger;

  constructor(uri: string, logger: Logger) {
    this.socket = io(uri);
    this.peerConnection = null;
    this.logger = logger;
    this.eventEmitter = new StrictEventEmitter<WatcherEvents>();

    this.peerConnection = new RTCPeerConnection(PEER_CONNECTION_CONFIG);
    this.peerConnection.addEventListener('track', this.trackHandler);
    this.peerConnection.addEventListener('icecandidate', this.iceCandidateHandler);

    this.socket.on('offer', this.offerHandler);
    this.socket.on('disconnect', this.closeStreamHandler);
    this.socket.on('cancelStream', this.cancelStreamHandler);
    this.socket.emit('watch');
  }

  private offerHandler = async (payload: { description: RTCSessionDescriptionInit }) => {
    this.logger.write({ level: 'info', message: 'watcher_offer', details: { id: this.socket.id, description: payload.description } });

    try {
      await this.peerConnection.setRemoteDescription(payload.description);
      const sdp = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(sdp);
      this.logger.write({ level: 'info', message: 'watcher_local_description', details: { id: this.socket.id, sdp } });
      this.socket.emit('answer', { description: this.peerConnection.localDescription });
    } catch (e) {
      this.logger.write({ level: 'error', message: 'watcher_local_description', details: { id: this.socket.id, error: String(e) } });
    }
  };

  private closeStreamHandler = () => {
    this.peerConnection = null;
    this.eventEmitter.emit('closeStream');
    this.logger.write({ level: 'info', message: 'watcher_close_stream', details: { id: this.socket.id } });
  };

  private cancelStreamHandler = () => {
    this.eventEmitter.emit('cancelStream');
    this.logger.write({ level: 'info', message: 'watcher_cancel_stream', details: { id: this.socket.id } });
  };

  private trackHandler = (event: RTCTrackEvent) => {
    this.logger.write({ level: 'info', message: 'watcher_received_track', details: { id: this.socket.id, kind: event.track.kind } });
    this.eventEmitter.emit('stream', event.streams[0]);
  };

  private iceCandidateHandler = (event: RTCPeerConnectionIceEvent) => {
    this.logger.write({ level: 'info', message: 'watcher_received_candidate', details: { id: this.socket.id, candidate: event.candidate } });
    this.socket.emit('candidate', { candidate: event.candidate });
  };

  public addEventListener = <Event extends keyof WatcherEvents>(event: Event, listener: WatcherEvents[Event]) => {
    this.eventEmitter.on(event, listener);
  };

  public removeEventListener = <Event extends keyof WatcherEvents>(event: Event, listener: WatcherEvents[Event]) => {
    this.eventEmitter.removeListener(event, listener);
  };

  public dispose() {
    this.logger.write({ level: 'info', message: 'watcher_dispose', details: { id: this.socket.id } });
    this.socket.close();
    this.peerConnection.close();
  }
}

export default Watcher;
