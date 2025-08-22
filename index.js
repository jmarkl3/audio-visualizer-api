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

app.get('/ping', (req, res) => {
  console.log("Pinged")
  res.send('OK')
})

app.get('/test', (req, res) => {
  console.log("Test endpoint reached")
  res.json({message: 'Major Tom to ground control, all systems go.'})
})
// Handle WebSocket connections.
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id)

  // Listen for 'update-grid' from a client and broadcast to all clients.
  socket.on('update-data', (data) => {
    io.emit('update-grid', data) // Broadcast to all connected clients.
  })

  socket.on('update-grid-8x12', (data) => {
    io.emit('update-grid', data) // Broadcast to all connected clients.
  })

  // Handle 'request' event for request-response pattern.
  socket.on('request', (data, ack) => {
    // Example response customize as needed.
    ack({ status: 'success', data })
  })

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id)
  })
})

// Start server on port 8080 (matches useSocket URL).
server.listen(process.env.PORT || 8080, () => {
  console.log('Server running.')
})