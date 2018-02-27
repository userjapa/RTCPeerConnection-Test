import { createNewConnection } from './../peer-connection'

export default data => {
  // Accept Call
  const accept = window.confirm('Accept Call?')
  if (accept) {
    createNewConnection(data.to)
    socket.emit('answer-call', {
      to: data.to,
      answer: accept
    })
  }
}
