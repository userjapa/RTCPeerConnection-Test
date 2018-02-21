// Getting App
const app = require('express')()

// Adding Routes
require('./app/middlewares')(app)
require('./app/routes')(app)

// Getting Server
const server = app.listen(8080, () => {
  console.log(`Running at port 8080`)
})

// Getting Socket
const io = require('socket.io').listen(server)

// Setting Socket
require('./app/socket')(io)
