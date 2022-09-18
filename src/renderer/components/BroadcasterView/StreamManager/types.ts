export interface StreamManager {
  getStream(streamID: string): Promise<MediaStream | null>
}
