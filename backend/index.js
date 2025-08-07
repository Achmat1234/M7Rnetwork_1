require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const compression = require('compression')
const morgan = require('morgan')
const mongoose = require('mongoose')
const http = require('http')
const { Server } = require('socket.io')

// Import security middleware
const {
  generalLimiter,
  authLimiter,
  passwordResetLimiter,
  speedLimiter,
  helmetConfig,
  securityHeaders,
  sanitizeInput,
  securityLogger,
  ownerProtection
} = require('./middleware/security')

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://yourdomain.com'] // Replace with your actual domain
      : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176', 'http://localhost:5177', 'http://localhost:5178'],
    methods: ['GET', 'POST'],
    credentials: true
  }
})

// Security Middleware (ORDER MATTERS!)
app.use(helmetConfig) // Enhanced helmet configuration
app.use(securityHeaders) // Custom security headers
app.use(securityLogger) // Security monitoring
app.use(generalLimiter) // General rate limiting
app.use(speedLimiter) // Slow down repeated requests
app.use(sanitizeInput) // Input sanitization

// Standard Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://yourdomain.com']
    : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176', 'http://localhost:5177', 'http://localhost:5178'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(compression())
app.use(express.json({ limit: '10mb' })) // Limit payload size
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(morgan('combined')) // More detailed logging

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
const authRoutes = require('./routes/auth-new')
const productRoutes = require('./routes/products')
const storeRoutes = require('./routes/store')
const marketplaceRoutes = require('./routes/marketplace')
const orderRoutes = require('./routes/order')
const setupRoutes = require('./routes/setup')

// Apply specific rate limiting to auth routes
app.use('/api/auth', authLimiter, authRoutes)
app.use('/api/auth/change-password', passwordResetLimiter)
app.use('/api/products', productRoutes)
app.use('/api/auth/reset-password', passwordResetLimiter)

// Apply owner protection to sensitive routes
app.use('/api/auth/reset-password', ownerProtection)

// Other routes
app.use('/api/store', storeRoutes)
app.use('/api/marketplace', marketplaceRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/setup', setupRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack)
  
  // Security incident logging
  if (err.type === 'security_violation') {
    console.error('🚨 SECURITY VIOLATION:', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      error: err.message,
      timestamp: new Date().toISOString()
    })
  }

  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message
  })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  })
})

const PORT = process.env.PORT || 5001
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})




