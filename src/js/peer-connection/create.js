import signaling from './on-signaling-state'
import track from './on-track'

export default function (id) {
  answerers[id] = new PeerConnection(iceServers)
  offerers[id] = new PeerConnection(iceServers)
  signaling(answerers[id])
  signaling(offerers[id])
  track(answerers[id], id)
  offerers[id].addStream(stream)
  console.log(answerers)
  console.log(offerers)
}
