export default function (pc, id) {
  pc.ontrack = function (obj) {
    console.log(`Adding Streams to ${id}`)
    let video = document.getElementById(`video-${id}`)
    if (video) {
      if (!video.SrcObject || !video.mozSrcObject) {
        video.src = window.URL.createObjectURL(obj.streams[0])
      } else {
        if (!video.mozSrcObject) {
          video.SrcObject = obj.streams[0]
        } else {
          video.mozSrcObject = obj.streams[0]
        }
      }
      console.log('Added Stream Successfully!')
      // Disable Button to Add Stream
      const user = document.getElementById(id)
      let button = user.childNodes[0]
      button.disabled = true
      if (!user.childNodes[2]) {
        // Add Mute
        let mute = document.createElement('input')
        mute.type = 'button'
        mute.value = 'Mute'
        mute.onclick = function () {
          // Mute User
          const video = this.previousSibling
          if (video.muted) {
            this.value = 'Mute'
            video.muted = false
          } else {
            this.value = 'Unmute'
            video.muted = true
          }
        }
        user.appendChild(mute)
      }
    } else {
      console.log('Failed to Add Stream...')
      console.warn('User Id is Null: ', id)
    }
  }
}
