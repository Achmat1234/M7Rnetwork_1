// Ownership middleware for protecting owner-only routes
const ownerRequired = (req, res, next) => {
  // Check if user is authenticated (this should be set by auth middleware)
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' })
  }

  // Check if user has owner role
  if (req.user.role !== 'owner') {
    return res.status(403).json({ error: 'Owner access required' })
  }

  next()
}

module.exports = {
  ownerRequired
}
