require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const compression = require('compression')
const morgan = require('morgan')
const mongoose = require('mongoose')
const http = require('http')
const { Server } = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
})

// Middleware
app.use(cors())
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(morgan('dev'))

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected')
}).catch((err) => {
  console.error('MongoDB connection error:', err)
})

// Socket.IO setup
io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id)
  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id)
  })
})

// Sample route
app.get('/', (req, res) => {
  res.json({ message: 'M7RNetworking API running' })
})

// Import and use routes (auth, store, marketplace, chat, etc.)
const authRoutes = require('./routes/auth')
const storeRoutes = require('./routes/store')
const marketplaceRoutes = require('./routes/marketplace')
const orderRoutes = require('./routes/order')
const setupRoutes = require('./routes/setup')

app.use('/api/auth', authRoutes)
app.use('/api/store', storeRoutes)
app.use('/api/marketplace', marketplaceRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/setup', setupRoutes)

const PORT = process.env.PORT || 5001
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
