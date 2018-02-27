export default data => {
  // Add All Users Connected
  for (const x of data.users) {
    // Check if the user isn't you
    if (x !== socket.id) {
      let user = document.createElement('div')
      user.id = x
      user.classList.add('item')
      let button = document.createElement('input')
      button.type = 'button'
      button.value = 'Call User'
      button.onclick = () => {
        // Making a Call
        socket.emit('make-call', {
          to: x
        })
      }
      user.appendChild(button)
      let video = document.createElement('video')
      video.id = `video-${x}`
      user.appendChild(video)
      document.getElementById('screen').appendChild(user)
    }
  }
}
