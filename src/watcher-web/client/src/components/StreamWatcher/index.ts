import axios from 'axios';
import Watcher, { StreamHandler } from '../../../../../core/RTCConnectionManager/Watcher';
import SocketReceiver from '../../../../../core/RTCConnectionManager/Receiver/SocketReceiver/SocketReceiver';
import Component from '../Component';
import ExpandIcon from '../../icons/expand_maximize_icon.svg';

type State = {
  isActiveStream: boolean;
}

const LOCALS = {
  WAITING: 'broadcast waiting...',
};

class StreamWatcher extends Component<unknown, State> {
  private static async requestConnectionUri(): Promise<string | null> {
    try {
      const response = await axios.get('/connection_receiver_uri');

      if (response.data) {
        return response.data.url;
      }

      return null;
    } catch (e) {
      return null;
    }
  }

  private watcher: Watcher | null;

  private videoRef: { current: null | HTMLVideoElement; };

  private isFullScreen: boolean;

  constructor() {
    super();

    this.state = {
      isActiveStream: false,
    };
    this.isFullScreen = false;
    this.watcher = null;
    this.videoRef = { current: null };
    this.createWatcher();
  }

  private streamHandler: StreamHandler = (stream) => {
    this.setState({ isActiveStream: true });
    this.videoRef.current.srcObject = stream;
  };

  private clickFullScreenHandler = async () => {
    const { containerRef } = this;

    if (containerRef.current) {
      try {
        if (!this.isFullScreen) {
          await containerRef.current.requestFullscreen();
        } else {
          await document.exitFullscreen();
        }
        this.isFullScreen = !this.isFullScreen;
      } catch (e) {
        this.isFullScreen = false;
        console.log(e);
      }
    }
  };

  private async createWatcher() {
    const connectionUri = await StreamWatcher.requestConnectionUri();
    if (connectionUri) {
      this.watcher = new Watcher({ receiver: new SocketReceiver(connectionUri) });
      this.watcher.addEventListener('stream', this.streamHandler);
    }
  }

  private Video() {
    const $video = document.createElement('video');
    this.videoRef.current = $video;

    $video.classList.add('stream-watcher__video');
    $video.playsInline = true;
    $video.autoplay = true;
    $video.muted = true;

    return $video;
  }

  private Waiting() {
    const $waiting = document.createElement('div');

    $waiting.classList.add('stream-watcher__waiting');
    $waiting.textContent = LOCALS.WAITING;

    return $waiting;
  }

  private BtnFullScreen() {
    const $btn = document.createElement('button');
    $btn.classList.add('stream-watcher__expand-btn');
    $btn.addEventListener('click', this.clickFullScreenHandler);

    $btn.innerHTML = ExpandIcon;

    return $btn;
  }

  public render() {
    const { isActiveStream } = this.state;
    const $container = document.createElement('div');
    $container.classList.add('stream-watcher');
    this.setContainerRef($container);

    if (isActiveStream) {
      $container.append(this.Video(), this.BtnFullScreen());
    } else {
      $container.append(this.Waiting());
    }

    return $container;
  }
}

export default StreamWatcher;
