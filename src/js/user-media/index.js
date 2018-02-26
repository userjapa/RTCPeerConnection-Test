exports default async function (str) {
  try {
    if (!str || typeof str !== 'object') throw new Error('Argument must be an Array.')
    // Getting Audio and Video
    const stream = await navigator.mediaDevices.getUserMedia(
      {
        audio: true,
        video: true
      }
    )
    str.push(str)
    // Adding Stream to HTML5 Video Tag
    const video = document.getElementById('video')
    let camera = document.createElement('video')
    camera.id = 'camera'
    camera.muted = true
    camera.src = window.URL.createObjectURL(stream)
    video.appendChild(camera)
    camera.play()

    // Add Stream
    console.log('Added Stream to PeerConnection')
    socket.emit('ready')
  } catch (error) {
    console.warn('Failed to Get User Media: ', error)
  }
}
