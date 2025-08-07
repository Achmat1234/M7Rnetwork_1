const jwt = require('jsonwebtoken')

module.exports = (roles = []) => {
  if (typeof roles === 'string') roles = [roles]
  return (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) return res.status(401).json({ message: 'No token provided' })
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json({ message: 'Invalid token' })
      req.user = user
      if (roles.length && !roles.includes(user.role)) {
        return res.status(403).json({ message: 'Forbidden' })
      }
      next()
    })
  }
}
