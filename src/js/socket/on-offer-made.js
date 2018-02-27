import { createOffer } from './../peer-connection'
import { setRemoteDescriptionError, createAnswerError, setLocalDescriptionError } from './../error'

export default data => {
  // Setting Remote Description
  answerers[data.socket].setRemoteDescription(new SessionDescription(data.offer), function () {
    console.log('Setting Offer as Remote Description')
    // Creating Answer
    console.log('Creating Answer')
    answerers[data.socket].createAnswer( function (answer) {
      // Setting Local Description
      console.log('Setting Answer as Local Description');
      answerers[data.socket].setLocalDescription(new SessionDescription(answer), function () {
        // Emit Make Answer
        socket.emit('make-answer', {
          answer: answer,
          to: data.socket
        })
        // CHECK IF OFFER WAS ALREADY MADE
        if (!offers[data.socket]) {
          // Create Offer
          createOffer(offerers[data.socket], data.socket)
          // Set Offer as Registered
          offers[data.socket] = true
        }
      }, setLocalDescriptionError)
    }, createAnswerError)
  }, setRemoteDescriptionError)
}
