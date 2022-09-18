export type ConnectionEvents = {
  offer(description: RTCSessionDescriptionInit): void
  candidate(candidate: RTCIceCandidate): void
};

export interface ConnectionManager {
  candidate(candidate: RTCIceCandidate): void
  answer(description: RTCSessionDescription): void;
  on<Event extends keyof ConnectionEvents>(event: Event, listener: ConnectionEvents[Event]): void
  connect(): void
  close(): void
}
