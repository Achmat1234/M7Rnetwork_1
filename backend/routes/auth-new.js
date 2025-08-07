// Simple and reliable authentication routes
const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const router = express.Router()

// Simple in-memory user store (for development)
const users = new Map()

// Initialize with your owner account
const initializeUsers = async () => {
  const ownerPassword = await bcrypt.hash('admin123', 10)
  users.set('mark7raw@gmail.com', {
    id: '1',
    name: 'Achmat Armien',
    username: 'MaRk7RaW',
    email: 'mark7raw@gmail.com',
    password: ownerPassword,
    role: 'owner',
    avatar: '👑'
  })
  console.log('✅ Owner account created: mark7raw@gmail.com / admin123')
}

// Initialize users on startup
initializeUsers()

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const { name, username, email, password } = req.body

    // Check if user exists
    if (users.has(email)) {
      return res.status(400).json({ message: 'User already exists' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const newUser = {
      id: Date.now().toString(),
      name,
      username,
      email,
      password: hashedPassword,
      role: 'user',
      avatar: '👤'
    }

    users.set(email, newUser)

    // Create token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    )

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser
    res.status(201).json({
      message: 'Registration successful',
      user: userWithoutPassword,
      token
    })

  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ message: 'Registration failed' })
  }
})

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    console.log(`🔐 Login attempt for: ${email}`)

    // Find user
    const user = users.get(email)
    if (!user) {
      console.log(`❌ User not found: ${email}`)
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      console.log(`❌ Invalid password for: ${email}`)
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Create token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    )

    // Return user without password
    const { password: _, ...userWithoutPassword } = user
    
    console.log(`✅ Login successful for: ${email} (${user.role})`)
    res.json({
      message: 'Login successful',
      user: userWithoutPassword,
      token
    })

  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: 'Login failed' })
  }
})

// Get current user
router.get('/me', (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret')
    const user = users.get(decoded.email)
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' })
    }

    const { password: _, ...userWithoutPassword } = user
    res.json({ user: userWithoutPassword })

  } catch (error) {
    console.error('Auth check error:', error)
    res.status(401).json({ message: 'Invalid token' })
  }
})

// Logout (client-side handles token removal)
router.post('/logout', (req, res) => {
  res.json({ message: 'Logout successful' })
})

// Change password endpoint
router.put('/change-password', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret')
    const user = users.get(decoded.email)
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' })
    }

    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' })
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password)
    if (!isValidPassword) {
      console.log(`❌ Invalid current password for: ${user.email}`)
      return res.status(401).json({ message: 'Current password is incorrect' })
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10)
    
    // Update password in memory store
    user.password = hashedNewPassword
    users.set(user.email, user)

    console.log(`✅ Password changed successfully for: ${user.email}`)
    res.json({ message: 'Password changed successfully' })

  } catch (error) {
    console.error('Change password error:', error)
    res.status(500).json({ message: 'Failed to change password' })
  }
})

module.exports = router
