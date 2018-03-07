import signaling from './on-signaling-state'
import track from './on-track'

export default function (id) {
  answerers[id] = new PeerConnection(iceServers)
  offerers[id] = new PeerConnection(iceServers)
  signaling(answerers[id], 'answerer', id)
  signaling(offerers[id], 'offerer', id)
  track(answerers[id], id)
  track(offerers[id], id)
  answerers[id].addStream(stream)
  offerers[id].addStream(stream)
  console.log(answerers)
  console.log(offerers)
}
