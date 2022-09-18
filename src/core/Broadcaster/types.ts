export type Source = {
  id: string,
  name: string
};

export interface SourceCollector {
  sources(): Promise<Source[]>
}

export type ConnectionEvents = {
  disconnectPeer(id: string): void
  candidate(id: string, candidate: RTCIceCandidateInit): void
  answer(id: string, description: RTCSessionDescriptionInit): void
  watcher(id: string): void
};

export interface ConnectionManager {
  offer(id: string, description: RTCSessionDescription): void
  candidate(id: string, candidate: RTCIceCandidate): void
  on<Event extends keyof ConnectionEvents>(event: Event, listener: ConnectionEvents[Event]): void
  close(): void
  broadcaster(): void
}
