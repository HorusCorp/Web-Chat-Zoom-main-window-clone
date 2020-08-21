const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const { v4: uuidv4 } = require('uuid');
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
    debug: true
});
app.set('view engine', 'ejs')//set view engine to ejs

app.use(express.static('public'));


app.use('/peerjs', peerServer);
app.get('/', (req, res) => {
    res.redirect(`/${uuidv4()}`);//va generer un unique id pour la room et te rediriger dessus
})

app.get('/:room', (req, res) => {
    res.render('room', { roomId: req.params.room});
})

io.on('connection', socket => {
    socket.on('join-room' , (roomId, userId) => {
        socket.join(roomId)
        socket.to(roomId).broadcast.emit('user-connected', userId);

        // quand l utilisateur est connecter on veux recevoir le message
        socket.on('message', message =>{
        // Ensuite on veut renvoyer à la Room seulement le message
            io.to(roomId).emit('createMessage', message)
        })
    })
})

server.listen(3030); // localhost:3030 setting adress of the server