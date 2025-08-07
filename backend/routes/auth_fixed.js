const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const auth = require('../middleware/auth')
const { 
  validateRegistration, 
  validateLogin, 
  validatePasswordChange, 
  validatePasswordReset 
} = require('../middleware/validation')
const router = express.Router()

// Register
router.post('/register', validateRegistration, async (req, res) => {
  try {
    const { name, username, email, password } = req.body
    if (!name || !username || !email || !password) return res.status(400).json({ message: 'All fields required' })
    const exists = await User.findOne({ $or: [{ email }, { username }] })
    if (exists) return res.status(409).json({ message: 'User already exists' })
    const hash = await bcrypt.hash(password, 10)
    const user = await User.create({ name, username, email, password: hash })
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' })
    res.status(201).json({
      message: 'Registration successful',
      user: { id: user._id, name, username, email },
      token
    })
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message })
  }
})

// Login
router.post('/login', validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(401).json({ message: 'Invalid credentials' })
    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(401).json({ message: 'Invalid credentials' })
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' })
    res.json({ user, token })
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message })
  }
})

// Get current user
router.get('/me', auth(), async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json({ user })
  } catch (err) {
    res.status(500).json({ message: 'Failed to get user info', error: err.message })
  }
})

// Change Password
router.put('/change-password', auth(), validatePasswordChange, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long' })
    }

    // Get user with password
    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password)
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: 'Current password is incorrect' })
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12)
    
    // Update password
    await User.findByIdAndUpdate(req.user.id, { 
      password: hashedNewPassword 
    })

    res.json({ 
      success: true, 
      message: 'Password changed successfully',
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    })
  } catch (err) {
    console.error('Password change error:', err)
    res.status(500).json({ message: 'Failed to change password', error: err.message })
  }
})

// Admin/Owner: Reset user password
router.put('/reset-password/:userId', auth(['admin', 'owner']), validatePasswordReset, async (req, res) => {
  try {
    const { newPassword } = req.body
    const { userId } = req.params
    
    if (!newPassword) {
      return res.status(400).json({ message: 'New password is required' })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' })
    }

    // Find target user
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12)
    
    // Update user password
    await User.findByIdAndUpdate(userId, { 
      password: hashedPassword 
    })

    console.log(`Password reset by ${req.user.role} for user: ${user.email}`)

    res.json({ 
      success: true, 
      message: 'Password reset successfully',
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role
      }
    })
  } catch (err) {
    console.error('Password reset error:', err)
    res.status(500).json({ message: 'Failed to reset password', error: err.message })
  }
})

module.exports = router
