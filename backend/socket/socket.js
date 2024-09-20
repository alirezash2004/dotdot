import { Server } from 'socket.io';
import http from 'http';
import express from 'express';


// create app
const app = express();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        // TODO: change to https
        origin: ["http://10.61.18.11:3000", "http://localhost:3000", "http://10.61.18.10:3000"],
        methods: ["GET", "POST", "PUT"],
        credentials: true
    }
});

export const getPageSocketId = (pageId) => {
    return pageSocketMap[pageId];
}

const pageSocketMap = {}; // {pageId: socketId}

io.on('connection', (socket) => {
    // TODO: add auth
    console.log("connected", socket.id);

    const pageId = socket.handshake.query.pageId;

    if (pageId !== "undefined") {
        pageSocketMap[pageId] = socket.id;
    }

    // TODO: change to send to related pages
    io.emit('onlinePages', Object.keys(pageSocketMap));

    socket.on('disconnect', () => {
        console.log("disconnected", socket.id);
        delete pageSocketMap[pageId];
        io.emit('onlinePages', Object.keys(pageSocketMap));
    })
})

export { app, io, server }