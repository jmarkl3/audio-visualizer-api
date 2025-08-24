const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const cors = require('cors')

const app = express()

// Enable CORS for all routes
app.use(cors({
  origin: '*',
}))

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*', 
  },
})

let currentGrid = [
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0]
];

// Ping to spin up free tier server instance
app.get('/ping', (req, res) => {
  console.log("Pinged")
  res.send('OK')
})

// Testing endpoints
app.get('/test', (req, res) => {
  console.log("Test endpoint reached")
  res.json({message: 'Major Tom to ground control, all systems go.'})
})
app.get('/test-frame-1', (req, res) => {
  let returnArray = [
    [ 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0 ],
    [ 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0 ],
    [ 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0 ],
    [ 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0 ],
    [ 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
  ]
  res.json({matrix: returnArray})
})
app.get('/test-frame-2', (req, res) => {
  let returnArray = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0],
    [0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0],
    [0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0],
    [0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0]
  ]
  res.json({matrix: returnArray})
})

app.get('/current-grid', (req, res) => {
  res.json(currentGrid);
});

// Socket connections
io.on('connection', (socket) => {
  // Log connection event
  console.log('Client connected:', socket.id)

  // Broadcasting 'update-data' to all clients
  socket.on('update-data', (data) => {
    currentGrid = data
    io.emit('update-grid', data) 
  })

  // For arduino 8x12 led matrix
  socket.on('update-grid-8x12', (data) => {
    io.emit('update-grid', data)
  })

  // Log disconnect event
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id)
  })

})

// Start server on port 8080 or the render.com configuration port 
server.listen(process.env.PORT || 8080, () => {
  console.log('Server running.')
})