const { io } = require('socket.io-client');

let peerConnection;
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
  const socket = io.connect('ws://localhost:4002');
  console.log(socket);
  const video = document.querySelector('video');
  const enableAudioButton = document.querySelector('#enable-audio');

  enableAudioButton.addEventListener('click', enableAudio);

  socket.on('offer', (id, description) => {
    console.log('offer');
    peerConnection = new RTCPeerConnection(config);
    peerConnection
      .setRemoteDescription(description)
      .then(() => peerConnection.createAnswer())
      .then((sdp) => peerConnection.setLocalDescription(sdp))
      .then(() => {
        socket.emit('answer', id, peerConnection.localDescription);
      })
      .catch((e) => console.log(e));
    peerConnection.ontrack = (event) => {
      console.log('ontrack');
      video.srcObject = event.streams[0];
    };
    peerConnection.onicecandidate = (event) => {
      console.log('onicecandidate');
      if (event.candidate) {
        socket.emit('candidate', id, event.candidate);
      }
    };
  });

  socket.on('candidate', (id, candidate) => {
    peerConnection.addIceCandidate(new RTCIceCandidate(candidate)).catch((e) => console.error(e));
  });

  socket.on('disconnect', (reason) => {
    console.log('disconnect', reason);
  });
  //
  socket.on('connect', () => {
    console.log('connect');
    socket.emit('watcher');
  });

  socket.on('broadcaster', () => {
    console.log('broadcaster');
    socket.emit('watcher');
  });

  window.onunload = window.onbeforeunload = () => {
    socket.close();
    peerConnection.close();
  };

  function enableAudio() {
    console.log('Enabling audio');
    video.muted = false;
  }
});

