var socket = io.connect('http://localhost:8080');
socket.on('connect',function (){
    socket.on('message', function (data){
        alert (data);
    });

});
var myPeerConnection = null;

var mediaConstraints = {
    audio: true, // We want an audio track
    video: true // ...and we want a video track
};

function start() {
    navigator.mediaDevices.getUserMedia(mediaConstraints)
        .then(function (localStream) {
            document.getElementById("local_video").srcObject = localStream;
            myPeerConnection = new RTCPeerConnection();
            myPeerConnection.addStream(localStream);
        });
}
function send() {
    socket.send('test');
}

document.getElementById("connectButton").addEventListener('click', function () {
   start();
});

document.getElementById("sendButton").addEventListener('click', function () {
    send();
});