import { action, makeObservable, observable } from 'mobx';
import Streamer from '../../../../core/Deskcast/Streamer';
import { SourceCollector } from '../../../../core/SourceCollector/types';
import { GetterWatcherURLI } from '../../../../core/GetterWatcherURL/types';

export type SelectScreen = (screenID: string) => void

export type Screen = {
  name: string
  id: string
  stream: MediaStream
  select: boolean
}

export type GetScreens = () => Screen[];

export type GetWatcherURL = () => string | null;

type StreamerViewProps = {
  sourceCollector: SourceCollector
  getterWatcherURL: GetterWatcherURLI
}

class StreamerViewStore {
  private streamer: Streamer;

  @observable.ref
  private screens: Screen[] | null;

  @observable
  private watcherURL: string | null;

  private static videoConfig = {
    minWidth: window.screen.width,
    maxWidth: window.screen.width,
    minHeight: window.screen.height,
    maxHeight: window.screen.height,
  };

  private sourceCollector: SourceCollector;

  private getterWatcherURL: GetterWatcherURLI;

  constructor(props: StreamerViewProps) {
    this.streamer = new Streamer();
    this.sourceCollector = props.sourceCollector;
    this.getterWatcherURL = props.getterWatcherURL;
    this.screens = [];
    this.watcherURL = null;

    makeObservable(this);

    this.requestAvailableScreens();
    this.requestWatcherUrl();
  }

  private async requestStream(streamID: string): Promise<MediaStream> {
    try {
      return await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          mandatory: {
            chromeMediaSource: 'desktop',
            chromeMediaSourceId: streamID,
            ...StreamerViewStore.videoConfig,
          },
        },
      });
    } catch (e) {
      console.error('Error getting a stream from navigator.mediaDevices.getUserMedia');

      return null;
    }
  }

  @action
  private setScreens(screens: Screen[]) {
    this.screens = screens;
  }

  @action
  private setWatcherURL(url: string) {
    this.watcherURL = url;
  }

  private async requestAvailableScreens() {
    const sourcesList = await this.sourceCollector.sources();
    const streams = await Promise.all(sourcesList.map((source) => this.requestStream(source.id)));

    this.setScreens(streams.map((stream, index) => ({
      stream,
      name: sourcesList[index].name,
      id: sourcesList[index].id,
      select: false,
    })));
  }

  private async requestWatcherUrl() {
    this.setWatcherURL(await this.getterWatcherURL.url());
  }

  selectScreen: SelectScreen = async (screenID) => {
    let selectedScreen: Screen | null = null;

    this.setScreens(this.screens.map((screen) => {
      if (screen.id === screenID) {
        selectedScreen = screen;

        return {
          ...screen,
          select: true,
        };
      }

      return {
        ...screen,
        select: false,
      };
    }));

    this.streamer.attachStream(selectedScreen.stream);
  };

  getScreens: GetScreens = () => this.screens;

  activeScreen = () => this.screens.find((screen) => screen.select);

  watcher: GetWatcherURL = () => this.watcherURL;

  @action
  reset() {
    this.setScreens(this.screens.map((screen) => ({ ...screen, select: false })));
    this.streamer.cancelStream();
  }
}

export default StreamerViewStore;
