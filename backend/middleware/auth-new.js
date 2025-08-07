const jwt = require('jsonwebtoken')

// Simple auth middleware
const auth = (requiredRole = null) => {
  return (req, res, next) => {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '')
      
      if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' })
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret')
      req.user = decoded

      // Check role if required
      if (requiredRole && decoded.role !== requiredRole) {
        return res.status(403).json({ message: 'Access denied. Insufficient permissions.' })
      }

      next()
    } catch (error) {
      res.status(401).json({ message: 'Invalid token.' })
    }
  }
}

module.exports = auth
