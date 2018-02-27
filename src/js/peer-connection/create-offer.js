import { createOfferError, setLocalDescriptionError } from './../error'

export default function (pc, id) {
  console.log('Creating Offer...')
  // Setting SDP Constraints
  const spdConstraints = {
      optional: [{
          VoiceActivityDetection: false
      }],
      mandatory: {
          OfferToReceiveAudio: true,
          OfferToReceiveVideo: false
      }
  }

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
  }, createOfferError, spdConstraints)
}
