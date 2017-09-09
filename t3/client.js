
var myPeerConnection = null;
var micUse = false;
var camUse = false;


var socket = io.connect('http://localhost:8080');

socket.on('connect',function (){
    //handler for messages from server
    socket.on('message', function (args){
        console.log('received msg: ' + args);
        msg = args[0];
        if (msg.type === 'offer') {
            myPeerConnection.setRemoteDescription(new RTCSessionDescription(msg),
                function() {
                    myPeerConnection.createAnswer(function(answer) {
                        myPeerConnection.setLocalDescription(answer, function() {
                            // send the answer to a server to be forwarded back to the caller (you)
                            send(answer);
                        }, function(error) { console.log(error) });
                    }, function(error) { console.log(error) });
                },
                function(error) { console.log(error) }
            );
        }
        else if (msg.type === 'answer') {
            myPeerConnection.setRemoteDescription(new RTCSessionDescription(msg),
                function(error) { console.log(error) });
        }
        else if (msg.type === 'candidate') {
            //var candidate = new RTCIceCandidate({sdpMLineIndex: msg.label, candidate: msg.candidate});
            var candidate = new RTCIceCandidate(msg);
            myPeerConnection.addIceCandidate(candidate);
        }
    });

});




function start() {
    var mediaConstraints = {
        audio: micUse, // We want an audio track
        video: camUse // ...and we want a video track
    };

    navigator.mediaDevices.getUserMedia(mediaConstraints)
        .then(function (localStream) {
            document.getElementById("local_video").srcObject = localStream;
            //create connection
            myPeerConnection = new RTCPeerConnection();
            myPeerConnection.addStream(localStream);
            // handler for ice candidate from other side
            myPeerConnection.onicecandidate = function (event) {
                // event contains ice candidate, which describe the route which can be used in transfer data
                if (event.candidate) {
                    send({
                        type: "candidate",
                        label: event.candidate.sdpMLineIndex,
                        id: event.candidate.sdpMid,
                        candidate: event.candidate.candidate
                    });
/*
                    sendToServer({
                        type: "new-ice-candidate",
                        target: targetUsername,
                        candidate: event.candidate
                    }
                    */
                }
            };
            myPeerConnection.onaddstream = gotRemoteStream;

        });
}

//send message to server
function send(msg) {
    socket.emit('message', msg);
}

function gotRemoteStream(event){
    //document.getElementById("remoteVideo").src = URL.createObjectURL(event.stream);
    document.getElementById("remoteVideo").srcObject = event.stream;
}

document.getElementById("cameraButton").addEventListener('click', function () {
    camUse = true;
});

document.getElementById("microButton").addEventListener('click', function () {
    micUse = true;
});


document.getElementById("connectButton").addEventListener('click', function () {
   start();
});

document.getElementById("sendButton").addEventListener('click', function () {
    //create offer - creates offer message
    myPeerConnection.createOffer(function(offer) {
        //set local description
        myPeerConnection.setLocalDescription(offer, function() {
            // send the offer to a server to be forwarded to the friend you're calling.
            send(offer);
        }, function(error) { console.log(error) });
    }, function(error) { console.log(error) });

});