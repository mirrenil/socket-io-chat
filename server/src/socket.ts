import { Server, Socket } from 'socket.io';
import { nanoid } from "nanoid";



const rooms: Record<string, {name: string}> = {};


function socket({ io }: { io: Server }) {
  console.log('in function socket');
  
  
  io.use((socket: Socket, next) => {
    console.log('in io.use')
    const username: string = socket.handshake.auth.username;
    console.log(username);
    if (!username) {
      return next(new Error('invalid username'));
    }

    socket.data.username = username;
    console.log("socket.data.username: " + socket.data.username)
    next();
  });

  io.on('connection', (socket: Socket) => {
    console.log(`User is connected ${socket.id}`);

    socket.emit('welcome', `welcome new user!`);
    socket.emit("ROOMS", rooms);

    socket.on("CREATE_ROOM", ({roomName}, callback) => {
      console.log('in create room')
      console.log({ roomName });
      const roomId = nanoid();
      rooms[roomId] = {
        name: roomName,
      }
      socket.join(roomId);
      //broadcast
      socket.broadcast.emit("ROOMS", rooms)

      // emit back to the room creator
      socket.emit("ROOMS", rooms)
      socket.emit("JOINED_ROOM", roomId)
  
      callback(roomId);
    })

    socket.emit('connected', socket.data.username);

    socket.on('chat-message', (message) => {
      console.log(message);
      // io.emit('chat message', message);
    });

    socket.on("JOIN_ROOM", (roomId) => {
      console.log(roomId);
      console.log(socket.data.username)
      socket.join(roomId);
      
      socket.emit("JOINED_ROOM", roomId);
    })

    socket.on('LEAVE_ROOM', (room, callback) => {
      socket.leave(room);
      console.log(`${socket.data.username} has left room ${room}`)
      callback(`${socket.data.username} has left room`);
    })


  });


  
}


export default socket;