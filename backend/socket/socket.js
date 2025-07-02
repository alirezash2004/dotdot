import { Server } from 'socket.io';
import http from 'http';
import express from 'express';
import Page from '../api/v1.0/models/page.model.js';


// create app
const app = express();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        // TODO: change to https
        origin: ["http://10.22.18.11:3000", "http://localhost:3000", "http://127.0.0.1:5000", "http://10.22.18.11:3000", "http://192.168.170.119:3000"],
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
    // console.log(socket.handshake.headers.cookie);
    // console.log(socket);


    console.log("connected", socket.id);

    const pageId = socket.handshake.query.pageId;

    if (pageId !== "undefined") {
        pageSocketMap[pageId] = socket.id;
    }

    // TODO: change to send to related pages
    // const doOmit = async () => {
    //     const pages = await Page.find({
    //         $and: [
    //             {
    //                 _id: {
    //                     $in: Object.keys(pageSocketMap)
    //                 }
    //             },
    //             {
    //                 _id: {
    //                     $in: await Page
    //                         .find({ _id: { $ne: pageId }, pageType: 'public' }, '_id')
    //                         .select('_id')
    //                         .distinct('_id')
    //                 }
    //             }
    //         ]
    //     })

    //     console.log("pages:", pages);

    // }

    // doOmit();

    io.emit('onlinePages', Object.keys(pageSocketMap));

    socket.on('disconnect', () => {
        console.log("disconnected", socket.id);
        delete pageSocketMap[pageId];
        io.emit('onlinePages', Object.keys(pageSocketMap));
    })
})

export { app, io, server }