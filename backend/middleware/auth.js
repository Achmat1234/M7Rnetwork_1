const jwt = require('jsonwebtoken')

const auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'No token provided' 
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'M7R_fallback_secret_2024')
    req.user = decoded
    next()
  } catch (error) {
    console.error('Auth middleware error:', error)
    return res.status(403).json({ 
      success: false,
      message: 'Invalid token' 
    })
  }
}

module.exports = auth
