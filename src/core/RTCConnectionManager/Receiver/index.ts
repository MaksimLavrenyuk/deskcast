export type ReceiverEvents = {
  offer(description: RTCSessionDescriptionInit): void
  candidate(candidate: RTCIceCandidate): void
};

export interface Receiver {
  candidate(candidate: RTCIceCandidate): void
  answer(description: RTCSessionDescription): void;
  on<Event extends keyof ReceiverEvents>(event: Event, listener: ReceiverEvents[Event]): void
  connect(): void
  close(): void
}
