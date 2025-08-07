const rateLimit = r// General API rate limiting (more lenient for development)
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
)-limit')
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

// General API rate limiting
const generalLimiter = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  100, // limit each IP to 100 requests per windowMs
  'Too many requests from this IP, please try again later.'
)

// Strict rate limiting for authentication endpoints
const authLimiter = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  5, // limit each IP to 5 requests per windowMs
  'Too many authentication attempts, please try again later.'
)

// Very strict rate limiting for password reset
const passwordResetLimiter = createRateLimit(
  60 * 60 * 1000, // 1 hour
  3, // limit each IP to 3 password reset attempts per hour
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
      connectSrc: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
})

// Security headers middleware
const securityHeaders = (req, res, next) => {
  // Additional security headers
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('X-XSS-Protection', '1; mode=block')
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()')
  
  // Remove server signature
  res.removeHeader('X-Powered-By')
  
  next()
}

// Input sanitization middleware
const sanitizeInput = (req, res, next) => {
  const sanitize = (obj) => {
    for (let key in obj) {
      if (typeof obj[key] === 'string') {
        // Remove potential XSS attempts
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

// Request logging for security monitoring
const securityLogger = (req, res, next) => {
  const timestamp = new Date().toISOString()
  const ip = req.ip || req.connection.remoteAddress
  const userAgent = req.get('User-Agent') || 'Unknown'
  
  // Log suspicious activity
  const suspiciousPatterns = [
    /(\.|%2e){2,}/i, // Path traversal
    /(union|select|insert|delete|drop|create|alter)/i, // SQL injection
    /<script|javascript:|on\w+=/i, // XSS attempts
    /\.\./i, // Directory traversal
  ]
  
  const url = req.url.toLowerCase()
  const isSuspicious = suspiciousPatterns.some(pattern => pattern.test(url))
  
  if (isSuspicious) {
    console.warn(`🚨 SUSPICIOUS REQUEST DETECTED:`)
    console.warn(`   Time: ${timestamp}`)
    console.warn(`   IP: ${ip}`)
    console.warn(`   URL: ${req.method} ${req.url}`)
    console.warn(`   User-Agent: ${userAgent}`)
    console.warn(`   Body:`, req.body)
  }
  
  next()
}

// Owner protection middleware
const ownerProtection = (req, res, next) => {
  // Extra validation for owner-related operations
  if (req.user && req.user.role === 'owner') {
    // Log all owner actions for audit trail
    console.log(`👑 OWNER ACTION:`, {
      time: new Date().toISOString(),
      user: req.user.email,
      action: `${req.method} ${req.url}`,
      ip: req.ip
    })
  }
  
  next()
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
  ownerProtection
}
