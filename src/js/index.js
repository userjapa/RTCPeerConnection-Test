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

// Setting Connection
const socket = io.connect(`http://${window.location.host}`)

// Connected
socket.on('connect', () => {
  console.log(`You're connected!`, socket.id)
})

// Create new Instance Of PeerConnection
let pc = new PeerConnection({ iceServers: [{ urls: 'stun:stun.services.mozilla.com' }] })

// Watch Singnaling State
console.log(pc.signalingState)
pc.onsignalingstatechange = function (event) {
  console.log(pc.signalingState)
}

// On Add Stream for PC
pc.ontrack = function (obj) {
  console.log(userId)
  console.log('Adding Stream')
  let video = document.getElementById(`video-${userId}`)
  if (video) {
    if (video.mozSrcObject) {
      video.mozSrcObject = obj.stream
    } else {
      video.src = window.URL.createObjectURL
    }
    // Disable Button to Add Stream
    const user = document.getElementById(userId)
    let button = user.childNodes[0]
    button.disabled = true
  } else {
    console.log('User Id is Null: ', userId)
  }
};

// Accessing User Midia
(async function () {
  try {
    // Getting Audio and Video
    const stream = await navigator.mediaDevices.getUserMedia(
      {
        audio: true,
        video: true
      }
    )
    // Adding Stream to HTML5 Video Tag
    const video = document.getElementById('video')
    let camera = document.createElement('video')
    camera.id = 'camera'
    camera.muted = true
    camera.src = window.URL.createObjectURL(stream)
    video.appendChild(camera)
    camera.play()

    // Add Stream
    console.log('Added Stream to PeerConnection')
    pc.addStream(stream)

    socket.emit('ready')
  } catch (error) {
    console.warn('Failed to Get User Media: ', error)
  }
})()

// Function to Create Offer
function createOffer (id) {
  userId = id
  // Creating Offer
  pc.createOffer(offer => {
    console.log('Offer Created')
    // Setting Local Description
    pc.setLocalDescription(new SessionDescription(offer), function () {
      console.log('Setting Offer as Local Description')
      // Emit Make Offer
      socket.emit('make-offer', {
        offer: offer,
        to: id
      })
    }, setLocalDescriptionError)
  }, createOfferError)
}
// End Create Offer


// On Answer Made
socket.on('answer-made', data => {
  // Setting Remote Description
  pc.setRemoteDescription(new SessionDescription(data.answer), function () {
    console.log('Setting Answer as Remote Description');
    // Check if answer is active already
    if (!answers[data.socket]) {
      // Create Offer
      createOffer(data.socket)
      // Set Answer as Active
      answers[data.socket] = true
    }
  }, setRemoteDescriptionError)
})

// On Offer Made
socket.on('offer-made', data => {
  // Set Offer
  offer = data.offer
  // Set User Id
  userId = data.socket
  // Setting Remote Description
  pc.setRemoteDescription(new SessionDescription(data.offer), function () {
    console.log('Setting Offer as Remote Description')
    // Creating Answer
    pc.createAnswer( function (answer) {
      console.log('Creating Answer')
      // Setting Local Description
      pc.setLocalDescription(new SessionDescription(answer), function () {
        console.log('Setting Answer as Local Description');
        // Emit Make Answer
        socket.emit('make-answer', {
          answer: answer,
          to: data.socket
        })
      }, setLocalDescriptionError)
    }, createAnswerError)
  }, setRemoteDescriptionError)
})


// Call Made
socket.on('call-made', data => {
  // Accept Call
  const accept = window.confirm('Accept Call?')
  socket.emit('answer-call', {
    to: data.to,
    answer: accept
  })
})

// Call Answer
socket.on('call-answer', data => {
  if (data.answer) {
    createOffer(data.user)
  }
})

// On New Connection
socket.on('new-connection', data => {
  // Add All Users Connected
  for (const x of data.users) {
    // Check if the user isn't you
    if (x !== socket.id) {
      let user = document.createElement('div')
      user.id = x
      user.classList.add('item')
      let button = document.createElement('input')
      button.type = 'button'
      button.value = 'Call User'
      button.onclick = () => {
        // Making a Call
        socket.emit('make-call', {
          to: x
        })
      }
      user.appendChild(button)
      let video = document.createElement('video')
      video.id = `video-${x}`
      user.appendChild(video)
      document.getElementById('screen').appendChild(user)
      // setTimeout(() => {
      //   // Create Offer to User
      //   createOffer(x)
      // }, 2500)
    }
  }
})

// On User Disconnected
socket.on('user-disconnected', data => {
  answers[data.id] = false
  const screen = document.getElementById('screen')
  const user = document.getElementById(data.id)
  // Removing User
  screen.removeChild(user)
})
