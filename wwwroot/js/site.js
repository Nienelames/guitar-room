"use strict";

const socket = new signalR.HubConnectionBuilder().withUrl("/brokerHub").build();
const peers = new Map();

const peerBroker = new Peer(undefined, {
    host: "/",
    port: 9000
})

socket.start().then(() => {
    peerBroker.on("open", async id => {
        await socket.invoke("AnnounceConnection", id);
    })

});

socket.on("peer-disconnected", peerId => {
    console.log(peerId)
    if (peers.get(peerId)) peers.get(peerId).close();
})


function addAudioStream(audioElement, stream) {
    audioElement.srcObject = stream;
    audioElement.addEventListener("loadedmetadata", async () => {
        await audioElement.play()
    })

     document.querySelector("#audio-grid").append(audioElement);
}

function connectToNewPeer(peerId, stream) {
    const call = peerBroker.call(peerId, stream);
    const peerAudioElement = document.createElement("audio");
    
    call.on("stream", peerAudioStream => {
        addAudioStream(peerAudioElement, peerAudioStream);
    });
    call.on("close", () => {
        peerBroker.close();
    });
    
    peers.set(peerId, call);
}

navigator.mediaDevices.getUserMedia({
    video: false,
    audio: true,
}).then(stream => {
   peerBroker.on("call", call => {
       call.answer(stream);
       const peerAudioElement = document.createElement("audio");
       
       call.on("stream", peerAudioStream => {
            addAudioStream(peerAudioElement, peerAudioStream);     
       });
   })
   
   socket.on("peer-connected", peerId => {
       connectToNewPeer(peerId, stream);
   })
})

