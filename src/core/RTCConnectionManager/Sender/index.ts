export type SenderEvents = {
  connectToManager(): void
  disconnectPeer(id: string): void
  candidate(id: string, candidate: RTCIceCandidateInit): void
  answer(id: string, description: RTCSessionDescriptionInit): void
  watcher(id: string): void
};

export interface Sender {
  offer(id: string, description: RTCSessionDescription): void
  candidate(id: string, candidate: RTCIceCandidate): void
  on<Event extends keyof SenderEvents>(event: Event, listener: SenderEvents[Event]): void
  close(): void
  broadcaster(): void
}
