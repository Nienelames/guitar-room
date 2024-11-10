"use strict";

const socket = new signalR.HubConnectionBuilder().withUrl("/brokerHub").build();

socket.start().then(async () => {
    await socket.invoke("AnnounceConnection", "1987");
})