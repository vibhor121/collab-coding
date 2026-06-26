const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const { YSocketIO } = require('y-socket.io/dist/server')

const DEFAULT_CODE = `// Welcome to CodeCollab!
// Share your room link and code together in real-time.

function greet(name) {
  return \`Hello, \${name}!\`
}

console.log(greet('world'))
`

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})

const ysocketio = new YSocketIO(io)
ysocketio.initialize()

ysocketio.on('document-loaded', (doc) => {
  const ytext = doc.getText('monaco')
  if (ytext.length === 0) {
    ytext.insert(0, DEFAULT_CODE)
  }
})

app.get('/', (req, res) => {
  res.json({
    name: 'CodeCollab API',
    status: 'running',
    message: 'Real-time collaborative coding server',
  })
})

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    activeRooms: ysocketio.documents.size,
  })
})

const PORT = process.env.PORT || 3000

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`\nPort ${PORT} is already in use.`)
    console.error('Fix: kill the old process  ->  lsof -i :' + PORT)
    console.error('Or use another port     ->  PORT=3001 npm run dev\n')
    process.exit(1)
  }

  console.error('Server error:', error)
  process.exit(1)
})

server.listen(PORT, () => {
  console.log(`CodeCollab backend listening on http://localhost:${PORT}`)
})
