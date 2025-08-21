const express = require('express')
const http = require('http')
const { Server } = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*', 
    methods: ['GET', 'POST'],
  },
})

// Handle WebSocket connections.
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id)

  // Listen for 'update-grid' from a client and broadcast to all clients.
  socket.on('update-data', (data) => {
    console.log('Received data:', data)
    io.emit('update-grid', data) // Broadcast to all connected clients.
  })

  socket.on('message', (data) => {
    console.log('Received message data:', data)
    io.emit('update-grid', data) // Broadcast to all connected clients.
  })

  // Handle 'request' event for request-response pattern.
  socket.on('request', (data, ack) => {
    console.log('Received request:', data)
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