const fs = require('fs')
var app = require('express')()
var http = require('http').Server(app)
var io = require('socket.io')(http)

const raw = fs.readFileSync(`${__dirname}/data.txt`, 'utf8')
const lines = raw.trim().split('\n')
const events = lines.map(str => JSON.parse(str))
events.forEach((event, i, events) => {
  if (i >= events.length - 1) event.dTime = 20
  else event.dTime = events[i + 1].timestamp - event.timestamp
  event.dTime = 20
})

io.on('connection', socket => {
  console.log('Connected!!')

  socket.on('arm-parachute', () => {
    console.log('parachute-armed sent')
    socket.emit('parachute-armed')
  })

  socket.on('disarm-parachute', () => {
    console.log('parachute-disarmed sent')
    socket.emit('parachute-disarmed')
  })

  socket.on('deploy-parachute', () => {
    console.log('parachute-deployed sent')
    socket.emit('parachute-deployed')
  })
})

http.listen(1235, function(){
  console.log('listening on *:1235');
})

let i = 0
function sendEvent () {
  const event = events[i]
  io.sockets.emit('rocket-data', event)
  if (++i >= events.length) i = 0
  setTimeout(sendEvent, event.dTime)
}

sendEvent()
