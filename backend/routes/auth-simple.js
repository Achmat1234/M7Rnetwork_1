// Simple authentication system - allows anyone to register and login
const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const router = express.Router()

// Simple in-memory user store
const users = new Map()

// Initialize empty user store - users register their own accounts
const initializeUsers = async () => {
  console.log('✅ Registration and login system ready!')
  console.log('📝 Users can register new accounts and login with their credentials')
  console.log('� Password changes available from user dashboard')
}

// Initialize users on startup
initializeUsers()

// Register endpoint - Allow anyone to register
router.post('/register', async (req, res) => {
  try {
    console.log('📝 Registration attempt:', req.body.email)
    const { name, username, email, password } = req.body
    
    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    // Check if user already exists
    if (users.has(email)) {
      return res.status(400).json({ message: 'User already exists' })
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10)
    const isFirstUser = users.size === 0
    const newUser = {
      id: String(users.size + 1),
      name,
      username,
      email,
      password: hashedPassword,
      role: isFirstUser ? 'owner' : 'user', // First user becomes owner
      avatar: isFirstUser ? '👑' : '👤'
    }
    
    users.set(email, newUser)
    console.log('✅ User registered:', email, isFirstUser ? '(Owner)' : '(User)')

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET || 'M7R_fallback_secret_2024',
      { expiresIn: '7d' }
    )

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      user: { 
        id: newUser.id, 
        name: newUser.name, 
        username: newUser.username, 
        email: newUser.email, 
        role: newUser.role, 
        avatar: newUser.avatar 
      },
      token
    })
  } catch (error) {
    console.error('❌ Registration error:', error)
    res.status(500).json({ message: 'Registration failed', error: error.message })
  }
})

// Login endpoint - Allow anyone to login
router.post('/login', async (req, res) => {
  try {
    console.log('🔐 Login attempt:', req.body.email)
    console.log('🔐 Available users:', Array.from(users.keys()))
    const { email, password } = req.body

    if (!email || !password) {
      console.log('❌ Missing email or password')
      return res.status(400).json({ message: 'Email and password are required' })
    }

    // Find user
    const user = users.get(email)
    if (!user) {
      console.log('❌ User not found:', email)
      console.log('❌ Available emails:', Array.from(users.keys()))
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    console.log('🔍 Found user:', user.email, 'Role:', user.role)

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      console.log('❌ Invalid password for:', email)
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'M7R_fallback_secret_2024',
      { expiresIn: '7d' }
    )

    console.log('✅ Login successful:', email)
    res.json({
      success: true,
      message: 'Login successful',
      user: { 
        id: user.id, 
        name: user.name, 
        username: user.username, 
        email: user.email, 
        role: user.role, 
        avatar: user.avatar 
      },
      token
    })
  } catch (error) {
    console.error('❌ Login error:', error)
    res.status(500).json({ message: 'Login failed', error: error.message })
  }
})

// Get current user info
router.get('/me', (req, res) => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'M7R_fallback_secret_2024')
    const user = users.get(decoded.email)
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json({
      user: { 
        id: user.id, 
        name: user.name, 
        username: user.username, 
        email: user.email, 
        role: user.role, 
        avatar: user.avatar 
      }
    })
  } catch (error) {
    console.error('❌ Auth error:', error)
    res.status(403).json({ message: 'Invalid token' })
  }
})

// Change password
router.put('/change-password', async (req, res) => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'M7R_fallback_secret_2024')
    const { currentPassword, newPassword } = req.body
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' })
    }

    const user = users.get(decoded.email)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password)
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Current password is incorrect' })
    }

    // Hash and update new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10)
    user.password = hashedNewPassword
    users.set(decoded.email, user)

    console.log('✅ Password changed for:', decoded.email)
    res.json({ message: 'Password changed successfully' })
  } catch (error) {
    console.error('❌ Password change error:', error)
    res.status(500).json({ message: 'Password change failed', error: error.message })
  }
})

module.exports = router
