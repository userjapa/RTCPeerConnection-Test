export default function (pc, type, id) {
  console.log(pc.signalingState)
  pc.onsignalingstatechange = function (event) {
    console.log(`${type} ${id} state: `, pc.signalingState)
  }
}
