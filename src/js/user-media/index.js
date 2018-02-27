import { userMediaError } from './../error'

export default async function () {
  try {
    // Check if User Media is Supported
    if (!window.navigator.mediaDevices || !window.navigator.mediaDevices.getUserMedia) throw userMediaError()
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
    // Warn That Your Ready to Stream
    window.socket.emit('ready')
    return stream
  } catch (error) {
    console.error('Failed to Get User Media: ', error)
  }
}
