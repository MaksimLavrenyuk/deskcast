import Watcher from '../../../core/RTCConnectionManager/Watcher';
import SocketReceiver from '../../../core/RTCConnectionManager/Receiver/SocketReceiver';

window.addEventListener('DOMContentLoaded', () => {
  const watcher = new Watcher({ receiver: new SocketReceiver() });
  const video = document.querySelector('video');

  watcher.addEventListener('stream', (stream) => {
    video.srcObject = stream;
  });
});
