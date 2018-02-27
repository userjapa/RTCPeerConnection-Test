import connect from './on-connect'
import userDisconnected from './on-user-disconnected'
import callAnswer from './on-call-answer'
import callMade from './on-call-made'
import answerMade from './on-answer-made'
import offerMade from './on-offer-made'
import newConnection from './on-new-connection'

export default function (socket) {
  socket.on('connect', connect)
  socket.on('user-disconnected', userDisconnected)
  socket.on('call-made', callMade)
  socket.on('call-answer', callAnswer)
  socket.on('answer-made', answerMade)
  socket.on('offer-made', offerMade)
  socket.on('new-connection', newConnection)
}
