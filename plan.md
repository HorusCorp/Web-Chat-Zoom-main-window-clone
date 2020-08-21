
# Plan d'action

- Initialiser notre NodeJs Project
- Initialiser notre premiere views
- Créer un Room Id
- Pouvoir capter et visualiser notre flux vidéo et audio
- Ajouter du style
- Pouvoir créer des messages
- Ajouter un boutton Mute
- Ajouter un boutton pour stopper la vidéo

--------------------------------------------------------------------------------------------------------------------------------------------------------

# initialiser le server Node 
- npm init (puis appuyer sur ENTRER jusqua la fin)
- npm i express
- configurer server.js :

            const express = require('express');
            const app = express();
            const server = require('http').Server(app);


            app.set('view engine', 'ejs')//set view engine to ejs

            app.get('/', (req, res) => {
                res.status(200).send("Hello World");
            })

            server.listen(3030); // localhost:3030 setting adress of the server


- npm i nodemon
- lancer nodemon (si erreur lancer la console en administrateur et utiliser la commande : set-executionpolicy unrestricted)
- Se mettre sur le localhost:3030 pour voir si notre message apparait

--------------------------------------------------------------------------------------------------------------------------------------------------------

# creation des views
- créer dans le dossier views  uen fichier room.ejs et créer un basic html template
- npm i ejs

- Ajouter "app.set('view engine', 'ejs')" dans server.js,
        and replace "res.status(200).send("Hello World");" by "res.render('room');"

--------------------------------------------------------------------------------------------------------------------------------------------------------

# librairie uuid va générer des uniques ID pour nos rooms
- npm i uuid
- Ajouter dans server.js : 

            const { v4: uuidv4 } = require('uuid') 

- modifier la route '/' et rajouter la route '/:room' dans server.js :
            res.redirect(`/${uuidv4()}`);

            app.get('/:room', (req, res) => {
                res.render('room', { roomId: req.params.room});
            })

- Ajouter dans le fichier room.ejs ces lignes dans le header :
            <script>
                console.log("<%= roomId %>");
            </script>
dans la console nous avons maintenant le room id qui apparait

--------------------------------------------------------------------------------------------------------------------------------------------------------

# Ajouter la possibilité de voir notre propre vidéo

- Créer un dossier public et un fichier sccript.js vierge puis le relier au fichier room.ejs

- Ajouter au fichier server.js:

        app.use(express.static('public')); 

- Ajouter au fichier script.js :

        const myVideo = document.createElement('video');
            myVideo.muted = true;

            let myVideoStream

            navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            }).then(stream => {
                myVideoStream = stream
                addVideoStream(myVideo, stream);
            })

            const addVideoStream = (video, stream) => {
                video.srcObject = stream;
                video.addEventListener('loadmetadata', () => {
                    video.play();
                })
            }


----------------------------------------------------------------------------------------
# Pour la messagerie

- npm i socket.io puis l'importer dans server.js

            const io = require('socketio')(server);


            io.on('connection', socket => {
                socket.on('join-room' , (roomId) => {
                    socket.join(roomId)
                    socket.to(roomId).broadcast.emit('user-connected');
                })
            })

- Dans script.js rajouter ligne 1 : 

            const socket = io('/');

- Et apres le getUserMedia : 

            socket.emit('join-room', ROOM_ID);

            socket.on('user-connected' , () => {
                connectToNewUser();
            })

            const connectToNewUser = () => {
                console.log('new user');
            }

- Et dans room.ejs : 

            <script src="/socket.io/socket.io.js"></script>

- Et dans la balise script avec le console log du roomId ajouter:

            const ROOM_ID = "<%= roomId %>";

- npm i peer

- Ajouter une structure html et du style en css à la page 

- Importer les balises bootstrap pour la font et pour pouvoir utiliser le jquery de bootstrap 5