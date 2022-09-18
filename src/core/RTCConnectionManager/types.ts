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
  answer: (id: string, description: RTCSessionDescription) => void;
  candidate: (id: string, candidate: RTCIceCandidate) => void
  watcher: () => void
}

export type ManagerToReceiverEvents = {
  broadcaster: () => void
  offer: (id: string, description: RTCSessionDescriptionInit) => void;
}
