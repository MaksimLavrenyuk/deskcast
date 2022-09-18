import { io } from 'socket.io-client';
import Watcher from './Watcher';
import Receiver from './Watcher/Receiver';

let peerConnection: RTCPeerConnection;
const config = {
  iceServers: [
    {
      urls: 'stun:stun.l.google.com:19302',
    },
    // {
    //   "urls": "turn:TURN_IP?transport=tcp",
    //   "username": "TURN_USERNAME",
    //   "credential": "TURN_CREDENTIALS"
    // }
  ],
};

window.addEventListener('DOMContentLoaded', () => {
  const watcher = new Watcher({ connectionManager: new Receiver() });
  const video = document.querySelector('video');
  const enableAudioButton = document.querySelector('#enable-audio');

  watcher.addEventListener('stream', (stream) => {
    video.srcObject = stream;
  });
  //
  // const socket = io('ws://localhost:4002');
  //
  // function enableAudio() {
  //   console.log('Enabling audio');
  //   video.muted = false;
  // }
  //
  // enableAudioButton.addEventListener('click', enableAudio);
  //
  // socket.on('offer', (id, description) => {
  //   console.log('offer');
  //   peerConnection = new RTCPeerConnection(config);
  //   peerConnection
  //     .setRemoteDescription(description)
  //     .then(() => peerConnection.createAnswer())
  //     .then((sdp) => peerConnection.setLocalDescription(sdp))
  //     .then(() => {
  //       socket.emit('answer', id, peerConnection.localDescription);
  //     })
  //     .catch((e) => console.log(e));
  //   peerConnection.ontrack = (event) => {
  //     console.log('ontrack');
  //     video.srcObject = event.streams[0];
  //   };
  //   peerConnection.onicecandidate = (event) => {
  //     console.log('onicecandidate');
  //     if (event.candidate) {
  //       socket.emit('candidate', id, event.candidate);
  //     }
  //   };
  // });
  //
  // socket.on('candidate', (id, candidate) => {
  //   peerConnection.addIceCandidate(new RTCIceCandidate(candidate)).catch((e) => console.error(e));
  // });
  //
  // socket.on('disconnect', (reason) => {
  //   console.log('disconnect', reason);
  // });
  // //
  // socket.on('connect', () => {
  //   console.log('connect');
  //   socket.emit('watcher');
  // });
  //
  // socket.on('broadcaster', () => {
  //   console.log('broadcaster');
  //   socket.emit('watcher');
  // });
  //
  // window.onunload = window.onbeforeunload = () => {
  //   socket.close();
  //   peerConnection.close();
  // };
});
