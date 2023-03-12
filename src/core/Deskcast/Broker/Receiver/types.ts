export type ReceiverEvents = {
  cancelBroadcast(): void
  connectToManager(): void
  closeBroadcast(): void
  offer(description: RTCSessionDescriptionInit): void
};

export interface ReceiverI {
  candidate(candidate: RTCIceCandidate): void
  answer(description: RTCSessionDescription): void;
  on<Event extends keyof ReceiverEvents>(event: Event, listener: ReceiverEvents[Event]): void
  close(): void
}
