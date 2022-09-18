import { StreamManager } from './types';

class StreamManagerImpl implements StreamManager {
  private readonly videoConfig: { minHeight: number; maxHeight: number; minWidth: number; maxWidth: number };

  constructor() {
    this.videoConfig = {
      minWidth: 1280,
      maxWidth: 1280,
      minHeight: 720,
      maxHeight: 720,
    };
  }

  async getStream(streamID: string): Promise<MediaStream | null> {
    try {
      return await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          mandatory: {
            chromeMediaSource: 'desktop',
            chromeMediaSourceId: streamID,
            ...this.videoConfig,
          },
        },
      });
    } catch (e) {
      return null;
    }
  }
}

export default StreamManagerImpl;
