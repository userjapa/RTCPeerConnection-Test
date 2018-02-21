// Importing CSS
import './../css/style.css'

// Import Socket Client
import io from 'socket.io-client'

// Setting UserID, Answers and Offer
let answers = {}
let userId = null
let offer = null

// Setting RTCPeerConnection and SessionDescription
const PeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection
const SessionDescription = window.RTCSessionDescription || window.moxRTCSessionDescription || window.webkitRTCSessionDescription

// ERRORS

function createOfferError (error) {
  console.warn('Failed to Create Offer: ', error)
}

function setLocalDescriptionError (error) {
  console.warn('Failed to Set Local Description: ', error)
}

function setRemoteDescriptionError (error) {
  console.warn('Failed to Set Remote Description: ', error)
}

function createAnswerError (error) {
  console.warn('Failed to Create Answer: ', error)
}

// END ERRORS

// Create new Instance Of PeerConnection
let pc = new PeerConnection({ iceServers: [{ urls: 'stun:stun.services.mozilla.com' }] })

// Add On Add Stream for PC
pc.ontrack = function (obj) {
  console.log(userId)
  console.log(URL)
  let video = document.getElementById(`video-${userId}`)
  video.src = window.URL.createObjectURL(obj.stream)
};

// Accessing User Midia
(async function () {
  try {
    const stream = await navigator.mediaDevices.getUserMedia(
      {
        audio: true,
        video: true
      }
    )
    const video = document.getElementById('video')
    let camera = document.createElement('video')
    camera.id = 'camera'
    camera.muted = true
    camera.src = window.URL.createObjectURL(stream)
    video.appendChild(camera)
    camera.play()
    pc.addStream(stream)
  } catch (error) {
    console.warn('Failed to Get User Media: ', error)
  }
})()

// navigator.mediaDevices.getUserMedia(
//  {
//     audio: true,
//     video: true
//   }
// )
//   .then(stream => {
//     const video = document.getElementById('video')
//     let camera = document.createElement('video')
//     camera.id = 'camera'
//     camera.muted = true
//     camera.src = window.URL.createObjectURL(stream)
//     video.appendChild(camera)
//     camera.play()
//     pc.addStream(stream)
//   })
//   .catch(error => {
//     console.warn('Failed to Get User Media: ', error)
//   })

// Setting Connection
const socket = io.connect(`http://${window.location.host}`)

// Connected
socket.on('connect', () => {
  console.log(`You're connected!`, socket.id)
})

// Function to Create Offer

function createOffer (id) {
  userId = id
  pc.createOffer().then(offer => {
    pc.setLocalDescription(new SessionDescription(offer), function () {
      socket.emit('make-offer', {
        offer: offer,
        to: id
      })
    }, setLocalDescriptionError)
  }, createOfferError)
}
// End Create Offer

// On New Connection
socket.on('new-connection', data => {
  for (const x of data.users) {
    if (x !== socket.id) {
      let user = document.createElement('div')
      user.id = x
      user.classList.add('item')
      let video = document.createElement('video')
      video.autoplay = true
      video.id = `video-${x}`
      user.appendChild(video)
      document.getElementById('screen').appendChild(user)
      setTimeout(() => {
        createOffer(x)
      }, 2000)
    }
  }
})

// On User Disconnected
socket.on('user-disconnected', data => {
  answers[data.id] = false
  const screen = document.getElementById('screen')
  const user = document.getElementById(data.id)
  screen.removeChild(user)
})

// On Offer Made
socket.on('offer-made', data => {
  offer = data.offer
  pc.setRemoteDescription(new SessionDescription(data.offer), function () {
    pc.createAnswer( function (answer) {
      pc.setLocalDescription(new SessionDescription(answer), function () {
        socket.emit('make-answer', {
          answer: answer,
          to: data.socket
        })
      }, setLocalDescriptionError)
    }, createAnswerError)
  }, setRemoteDescriptionError)
})

// On Answer Made
socket.on('answer-made', data => {
  pc.setRemoteDescription(new SessionDescription(data.answer), function () {
    if (!answers[data.socket]) {
      createOffer(data.socket)
      answers[data.socket] = true
    }
  }, setRemoteDescriptionError)
})
