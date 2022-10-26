import adapter from 'webrtc-adapter';
import App from './app';
import StreamWatcher from './components/StreamWatcher';
import './styles/index.scss';

console.log(JSON.stringify(adapter.browserDetails));

App(new StreamWatcher().render());
