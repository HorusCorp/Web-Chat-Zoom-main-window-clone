// const { text } = require("express");

const socket = io('/');
const videoGrid = document.getElementById('video-grid')
const myVideo = document.createElement('video');
myVideo.muted = true;

var peer = new Peer(undefined, {
    path:'/peerjs',
    host:'/',
    port: '3030'
}); 

let myVideoStream
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    myVideoStream = stream
    addVideoStream(myVideo, stream);

    // Quand l'autre utilisateur nous reponds , on l'ajoute au stream video
    peer.on('call', call => {
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream =>{
            addVideoStream(video, userVideoStream)
        })
    })
        socket.on('user-connected' , (userId) => {
        connectToNewUser(userId, stream);
})

    let msg = $('input')
    // Ici on va demander au document html de detecter la pression sur la touche entrer / 13 == touche enter
    $('html').keydown((e) => {
        if (e.which == '13' && msg.val().length !== 0) {
            // console.log(msg.val())
            socket.emit('message', msg.val());
            msg.val('')
        }
    })

    // On envoi le message dans le chat en front
    socket.on('createMessage', message => {
        // console.log('message reçu du serveur : ' + message)
        $('ul').append(`<li class="message"><b>userName</b><br/>${message}</li>`)
        scrollToBottom()
    })
    
})

// Vas généré des id automatriquement
peer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id);
})


// On se connecte à un autre utilisateur et on lui envoi notre stream video avec call.on et addVideoStream
const connectToNewUser = (userId, stream) => {
    const call = peer.call(userId, stream)
    const video = document.createElement('video')
//quand je reçois le stream de quelqun je l'ajoute
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
    })
    console.log('new user :' + userId);
}


const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    //then when we load all that data we want to play the video: 
    video.addEventListener('loadedmetadata', () => {
        video.play();
    })
    //envoyer la video au html / ejx file
    videoGrid.append(video);
}

// Ici on créer la fonction pour scroll le chat quand il y a trop de messages
const scrollToBottom = () => {
    let d = $('.main__chat__window');
    d.scrollTop(d.prop("scrollHeight"));
}


// Mute / unmute la video
const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled
    if (enabled) {
        myVideoStream.getAudioTracks()[0].enabled = false;
        setUnmuteButton();
        console.log('video muted')
    } else {
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled = true;
        console.log('video unmuted')
    }
}

const setMuteButton = () => {
    const html =`
        <div class="mute"></div>
        <span>Mute</span>
    `
    document.querySelector('.main__mute__button').innerHTML = html;
}

const setUnmuteButton = () => {
    const html = `
        <div class="unmute"></div>
        <span>Unmute</span>
    `
    document.querySelector('.main__mute__button').innerHTML = html;
}

// stoper et relancer la video 
const playStop = () => {
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
        setStopVideo()
        myVideoStream.getVideoTracks()[0].enabled = false;
        console.log('video stopped')
    } else {
        myVideoStream.getVideoTracks()[0].enabled = true;
        setPlayVideo()
        console.log('video start')
    }
}

const setPlayVideo = () => {
    const html =`
        <div class="main__controls__video"></div>
        <span>Stop</span>
    `
    document.querySelector('.main__video__button').innerHTML = html;
}

const setStopVideo = () => {
    const html = `
        <div class="main__controls__video__off"></div>
        <span>Play</span>
    `
    document.querySelector('.main__video__button').innerHTML = html;
}
  