module.exports = io => {
  // Store Connections
  let sockets = []

  // User Connected
  io.on('connection', socket => {
    console.log(`User ${socket.id} connected!`)

    // Adding new user to sockets array
    sockets.push(socket.id)

    // On Ready Stream
    socket.on('ready', () => {
      // Emit new Connection
      socket.emit('new-connection', {
        users: sockets
      })
      // Emit new Connection For All
      socket.broadcast.emit('new-connection', {
        users: [socket.id]
      })
    })


    // On Disconnection
    socket.on('disconnect', () => {
      console.log(`User ${socket.id} disconnect...`)
      // Remove User from Array Sockets
      sockets.splice(sockets.indexOf(socket.id), 1)
      // Emit User Disconnected
      io.emit('user-disconnected', {
        id: socket.id
      })
    })

    // Make a Call
    socket.on('make-call', data => {
      // Call Made
      socket.to(data.to).emit('call-made', {
        to: socket.id
      })
    })

    // Answering a Call
    socket.on('answer-call', data => {
      // Emit Call Answer
      socket.to(data.to).emit('call-answer', {
        answer: data.answer,
        user: socket.id
      })
    })

    // Making a Offer
    socket.on('make-offer', data => {
      // Offer Made
      socket.to(data.to).emit('offer-made', {
        offer: data.offer,
        socket: socket.id
      })
    })

    // Making an Answer
    socket.on('make-answer', data => {
      // Answer Made
      socket.to(data.to).emit('answer-made', {
        socket: socket.id,
        answer: data.answer
      })
    })
  })

  // End Socket
}
