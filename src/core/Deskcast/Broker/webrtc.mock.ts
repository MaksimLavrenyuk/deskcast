export const mockCandidate: RTCIceCandidate = {
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

export const mockRTCSessionDescription: RTCSessionDescription = {
  sdp: 'sdp',
  type: 'offer',
  toJSON() {
    return {
      sdp: 'sdp',
      type: 'offer',
    };
  },
};

export const mockDescriptionInit: RTCSessionDescriptionInit = {
  type: 'answer',
};
