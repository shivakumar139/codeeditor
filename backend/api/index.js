import express from 'express';
import {createServer} from 'http';
import { Server } from 'socket.io';
import { APP_PORT, FRONTEND_URL } from '../config';
import { ACTIONS } from '../actions'

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: FRONTEND_URL,
    },
});

const userSocketmap = new Map();
const socketIdToUsername = new Map();
const roomIdToCode = new Map();

io.on('connection', (socket) => {
  console.log('socket id', socket.id);

  socket.on(ACTIONS.JOIN, ({roomId, username}) => { 
    if(!roomIdToCode.has(roomId)){
      roomIdToCode.set(roomId, 'console.log("Hello World")');
    } 

    socketIdToUsername.set(socket.id, username);

    userSocketmap.set(roomId, userSocketmap.get(roomId) ? [...userSocketmap.get(roomId), socket.id] : [socket.id]);


    socket.join(roomId);

    const clientsSocketId = userSocketmap.get(roomId);
    const clientsUserName = clientsSocketId.map(socketId => {
      return {
        socketId: socketId,
        userName: socketIdToUsername.get(socketId)
      }
    })

    console.log("clients", clientsUserName)

    clientsSocketId.forEach(socketId => {
      io.to(socketId).emit(ACTIONS.USER_JOINED, {username, clients: clientsUserName, code: roomIdToCode.get(roomId)});
    });

    
  });


  // when user close the tab
  socket.on("disconnecting",()=>{
    const roomId = [...socket.adapter.sids.get(socket.id)][1];


    console.log('user left', socketIdToUsername.get(socket.id), roomId);

    socket.leave(roomId);

    const clientsSocketId = userSocketmap.get(roomId);
    if(clientsSocketId){
      clientsSocketId.splice(clientsSocketId.indexOf(socket.id), 1);

      userSocketmap.set(roomId, clientsSocketId);
      const username = socketIdToUsername.get(socket.id);
      delete socketIdToUsername[socket.id];

      const clientsUserName = clientsSocketId.map(socketId => {
        return {
          socketId: socketId,
          userName: socketIdToUsername.get(socketId)
        }
      })

      clientsSocketId.forEach(socketId => {
        io.to(socketId).emit(ACTIONS.LEAVE, {username, clients: clientsUserName});
      });
    }
    
    
    
  })


  // on code change
  socket.on(ACTIONS.CODE_CHANGE,({code})=>{
    const roomId = [...socket.adapter.sids.get(socket.id)][1];
    roomIdToCode.set(roomId, code);

    io.to(roomId).emit(ACTIONS.SYNC_CODE,{code});
  })

  
});




const appport = process.env.PORT || APP_PORT;

httpServer.listen(APP_PORT, () => {
  console.log(`Server started on port ${APP_PORT}`)
});
