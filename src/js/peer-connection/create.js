import signaling from './on-signaling-state'
import track from './on-track'

export default function (id) {
  let pc = new PeerConnection(iceServers)
  signaling(pc)
  track(pc, id)
  return pc
}
