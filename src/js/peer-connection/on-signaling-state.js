export default function (pc) {
  console.log(pc.signalingState)
  pc.onsignalingstatechange = function (event) {
    console.log(pc.signalingState)
  }
}
