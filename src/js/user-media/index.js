export default async function () {
  try {
    // Getting Audio and Video
    const stream = await navigator.mediaDevices.getUserMedia(
      {
        audio: true,
        video: true
      }
    )
    // Adding Stream to HTML5 Video Tag
    const video = document.getElementById('video')
    let camera = document.createElement('video')
    camera.id = 'camera'
    camera.muted = true
    camera.src = window.URL.createObjectURL(stream)
    video.appendChild(camera)
    camera.play()

    socket.emit('ready')
    return stream
  } catch (error) {
    console.warn('Failed to Get User Media: ', error)
  }
}
