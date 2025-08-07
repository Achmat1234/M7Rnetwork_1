const rateLimit = require('express-rate-limit')
const slowDown = require('express-slow-down')
const helmet = require('helmet')

// Rate limiting configurations
const createRateLimit = (windowMs, max, message) => rateLimit({
  windowMs,
  max,
  message: { error: message },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: message,
      retryAfter: Math.round(windowMs / 1000)
    })
  }
})

// General API rate limiting (more lenient for development)
const generalLimiter = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  process.env.NODE_ENV === 'production' ? 100 : 1000, // 1000 requests for dev, 100 for prod
  'Too many requests from this IP, please try again later.'
)

// Authentication rate limiting (more lenient for development)
const authLimiter = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  process.env.NODE_ENV === 'production' ? 10 : 50, // 50 attempts for dev, 10 for prod
  'Too many authentication attempts, please try again later.'
)

// Password reset rate limiting
const passwordResetLimiter = createRateLimit(
  60 * 60 * 1000, // 1 hour
  process.env.NODE_ENV === 'production' ? 3 : 20, // 20 attempts for dev, 3 for prod
  'Too many password reset attempts, please try again later.'
)

// Slow down repeated requests
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 50, // allow 50 requests per 15 minutes, then...
  delayMs: () => 500, // begin adding 500ms of delay per request after delayAfter
  validate: {
    delayMs: false // Disable the warning
  }
})

// Enhanced Helmet configuration for maximum security
const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      scriptSrc: ["'self'"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"]
    }
  },
  crossOriginEmbedderPolicy: false,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
})

// Custom security headers
const securityHeaders = (req, res, next) => {
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-XSS-Protection', '1; mode=block')
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()')
  next()
}

// Input sanitization middleware
const sanitizeInput = (req, res, next) => {
  // Basic XSS protection
  const sanitize = (obj) => {
    for (let key in obj) {
      if (typeof obj[key] === 'string') {
        // Remove potential XSS patterns
        obj[key] = obj[key]
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/javascript:/gi, '')
          .replace(/on\w+\s*=/gi, '')
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitize(obj[key])
      }
    }
  }

  if (req.body) sanitize(req.body)
  if (req.query) sanitize(req.query)
  if (req.params) sanitize(req.params)
  
  next()
}

// Security monitoring and logging
const securityLogger = (req, res, next) => {
  const start = Date.now()
  
  res.on('finish', () => {
    const duration = Date.now() - start
    const logData = {
      method: req.method,
      url: req.url,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString()
    }

    // Log suspicious activity
    if (res.statusCode === 429 || res.statusCode >= 400) {
      console.log('🚨 Security Alert:', logData)
    }
    
    // Log owner actions for audit trail
    if (req.user && req.user.role === 'owner') {
      console.log('👑 Owner Activity:', logData)
    }
  })
  
  next()
}

// Owner protection middleware
const ownerProtection = (req, res, next) => {
  // Extra logging for owner-related operations
  if (req.body && req.body.userId) {
    console.log('🔐 Owner Operation Attempted:', {
      targetUser: req.body.userId,
      operation: req.method + ' ' + req.path,
      requester: req.ip,
      timestamp: new Date().toISOString()
    })
  }
  next()
}

// Request size limiting
const requestSizeLimit = (req, res, next) => {
  const contentLength = parseInt(req.get('Content-Length') || '0')
  const maxSize = 10 * 1024 * 1024 // 10MB

  if (contentLength > maxSize) {
    return res.status(413).json({
      error: 'Request entity too large',
      maxSize: '10MB'
    })
  }
  
  next()
}

// Enhanced error handling for security violations
const securityErrorHandler = (err, req, res, next) => {
  if (err.type === 'entity.too.large') {
    return res.status(413).json({
      error: 'Request entity too large'
    })
  }
  
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      error: 'Invalid request format'
    })
  }
  
  next(err)
}

module.exports = {
  generalLimiter,
  authLimiter,
  passwordResetLimiter,
  speedLimiter,
  helmetConfig,
  securityHeaders,
  sanitizeInput,
  securityLogger,
  ownerProtection,
  requestSizeLimit,
  securityErrorHandler
}
