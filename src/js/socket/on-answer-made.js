import { createNewConnection, createOffer } from './../peer-connection'
import { setRemoteDescriptionError } from './../error'

export default data => {
  // Setting Remote Description
  offerers[data.socket].setRemoteDescription(new SessionDescription(data.answer), function () {
    console.log('Setting Answer as Remote Description');
    // Check if answer is active already
    if (!answers[data.socket]) {
      // Create Offer
      createOffer(offerers[data.socket], data.socket)
      console.log('Answer Setted')
      answers[data.socket] = true
    }
  }, setRemoteDescriptionError)
}
