import { io, Socket } from 'socket.io-client';

type Connections = {
  [id: string]: RTCPeerConnection
};

export type Payload = {
  id: string,
}

export type StreamerToBrokerEvents = {
  cancelStream: () => void
  offer: (payload: Payload & { description: RTCSessionDescription }) => void;
  candidate: (payload: Payload & { candidate: RTCIceCandidate | null }) => void
}

export type BrokerToStreamerEvents = {
  watch: (payload: Payload) => void
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
    this.socket.on('watch', this.watchHandler);
    this.socket.on('candidate', this.candidateHandler);
    this.socket.on('disconnectPeer', this.disconnectPeerHandler);
  }

  private answerHandler = async (payload: Payload & { description: RTCSessionDescription }) => {
    if (this.peerConnections[payload.id]) {
      await this.peerConnections[payload.id].setRemoteDescription(payload.description);
    }
  };

  /**
   * The rtc connection is used to send the stream to the watcher.
   * As soon as an observer comes to the stream, we create this connection.
   * @param payload
   */
  private watchHandler = async (payload: Payload) => {
    this.createPeerConnection(payload.id);
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

  private createPeerConnection(connectionID: string) {
    const peerConnection = new RTCPeerConnection(PEER_CONNECTION_CONFIG);

    peerConnection.addEventListener('icecandidate', (event) => {
      this.iceCandidateHandler(connectionID, event);
    });

    this.addTrackToPeerConnection(peerConnection);
    this.createOffer(peerConnection, connectionID);
    this.peerConnections[connectionID] = peerConnection;
  }

  /**
   *
   * The stream is converted into a track.
   * To send a track to another peer, you need to tell it the nature of the track, and use sdp to do this.
   * We create a sentence with sdp data and pass it to the other peer.
   *
   * Every time a track with a streamer is added, we have to create an offer for other peers.
   * @param peerConnection - rtc connection that requires an offer
   * @param connectionID - connection id, indicates to which socket the data should be sent with the offer
   * @private
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Glossary/SDP}
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/createOffer}
   */
  private async createOffer(peerConnection: RTCPeerConnection, connectionID: string) {
    const sdp = await peerConnection.createOffer();

    await peerConnection.setLocalDescription(sdp);
    this.socket.emit('offer', { id: connectionID, description: peerConnection.localDescription });
  }

  /**
   * In order for a video stream to receive a peer connection, a video stream track must be sent to it
   * @param peerConnection
   * @private
   */
  private addTrackToPeerConnection(peerConnection: RTCPeerConnection) {
    if (this.stream) {
      const tracks = this.stream.getTracks();
      tracks.forEach((track) => {
        peerConnection.addTrack(track, this.stream);
      });
    }
  }

  private removeStreamFromAllPeerConnections() {
    const connectionsIDs = Object.keys(this.peerConnections);

    connectionsIDs.forEach((connectionID) => {
      const peerConnection = this.peerConnections[connectionID];
      const senders = peerConnection.getSenders();
      senders.forEach((sender) => peerConnection.removeTrack(sender));
    });
  }

  /**
   * In order to pass the stream to all connections,
   * you must set up stream tracks in the connection. Afterwards, be sure to create an offer.
   * @private
   */
  private setStreamToAllPeerConnections() {
    const connectionsIDs = Object.keys(this.peerConnections);

    connectionsIDs.forEach((connectionID) => {
      const peerConnection = this.peerConnections[connectionID];
      this.addTrackToPeerConnection(peerConnection);
      /**
       * you should not wait until the previous one has been sent to do the next one, you can do it in parallel.
       * For this reason we do not wait for Promise
       */
      this.createOffer(peerConnection, connectionID);
    });
  }

  public attachStream = (stream: MediaStream) => {
    this.stream = stream;
    this.setStreamToAllPeerConnections();
  };

  public cancelStream = () => {
    this.removeStreamFromAllPeerConnections();
    this.stream = null;
    this.socket.emit('cancelStream');
  };

  public dispose = () => {
    this.removeStreamFromAllPeerConnections();
    this.socket.close();
  };
}

export default Streamer;
