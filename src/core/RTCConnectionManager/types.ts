export type SenderToManagerEvents = {
  offer: (id: string, description: RTCSessionDescription) => void;
  candidate: (id: string, candidate: RTCIceCandidate) => void
  broadcaster: () => void
}

export type ManagerToSenderEvents = {
  watcher: (id: string) => void
  candidate: (id: string, candidate: RTCIceCandidateInit) => void
  answer: (id: string, description: RTCSessionDescriptionInit) => void;
  disconnectPeer: (id: string) => void
}

export type ReceiverToManagerEvents = {
  answer: (description: RTCSessionDescription) => void;
  candidate: (candidate: RTCIceCandidate) => void
  watcher: () => void
}

export type ManagerToReceiverEvents = {
  closeBroadcast: () => void
  broadcaster: () => void
  offer: (description: RTCSessionDescriptionInit) => void;
}
