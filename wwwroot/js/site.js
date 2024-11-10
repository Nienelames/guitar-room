"use strict";

const socket = new signalR.HubConnectionBuilder().withUrl("/brokerHub").build();
socket.start().then();

socket.on("user-connected", (user) => {
    console.log("User connected:", user);
})

const peer = new Peer(undefined, {
    host: "/",
    port: 9000
})

peer.on("open", async id => {
    await socket.invoke("AnnounceConnection", id) ;
})