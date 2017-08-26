var mediaConstraints = {
    audio: true, // We want an audio track
    video: true // ...and we want a video track
};

function start() {
    navigator.mediaDevices.getUserMedia(mediaConstraints)
        .then(function (localStream) {
            document.getElementById("local_video").srcObject = localStream;
        });
}

document.getElementById("connectButton").addEventListener('click', function () {
   start();
});