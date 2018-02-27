// Importing CSS
import './../css/style.css';

// Import Socket Client
import io from 'socket.io-client';

// Import User Media
import userMedia from './user-media';

// Import New Peer Connection and Create Offer
import { createNewConnection, createOffer } from './peer-connection';

// Import Socket Events
import addSocketEvents from './socket'

(async function () {
  // Setting Global Variables
  window.answerers = {}
  window.answers = {}
  window.offerers = {}
  window.offers = {}
  window.stream = null

  // Setting RTCPeerConnection and SessionDescription
  window.PeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection
  window.SessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription
  window.iceServers = { iceServers: [{ urls: 'stun:stun.services.mozilla.com' }] }

  // Setting Connection
  window.socket = io.connect(`http://${window.location.host}`)

  // Add Events to Socket
  addSocketEvents(window.socket)

  // Accessing User Midia
  try {
    stream = await userMedia()
  } catch (error) {
    console.error(error)
  }
  
}())
