const express = require('express')
var cors = require('cors')

const  { addUser, removeUser, getUser , getUsersInRoom  } = require('./users')

const route = require('./router.js')
const PORT = process.env.PORT || 5000

const app = express()
const http = require('http').Server(app);

const io = require('socket.io')(http, {
    cors: {
        origin:  [ "http://localhost:3000" , "https://chat-app-n6f5.onrender.com/" ]
    }
});

app.use(cors({
    origin : [ "http://localhost:3000" , "https://chat-app-n6f5.onrender.com/" ]
}))
app.use(route)

io.on('connection' , socket => {
   socket.on('join' , ({name, room }, callback ) => {
    const {error , user} = addUser( {id : socket.id , name , room} )
    
    if(error) return callback(error);
    
    console.log(`welcome new user ${user.name}`);
    socket.join(user.room);
    socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${user.room}.`});
    socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });
    io.to(user.room).emit('roomInfo' ,{room : user.room , users : getUsersInRoom(user.room)} )

    callback();
    });

    socket.on('sendMessage', ({name,message}, callback) => {
        const user = getUser(name);
        socket.broadcast.to(user.room).emit('message' , {user : user.name , text : message});
 
        callback()
    })


    socket.on('disconnect' , ()=> {
        const user = removeUser(socket.id);
        if(user) {
            io.to(user.room).emit('message', { user: 'admin', text: `${user.name} has left.` });
        }

    })
})

http.listen(PORT , ()=> {
    console.log(`Server is running on port ${PORT}`)
})