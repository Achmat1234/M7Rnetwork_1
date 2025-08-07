const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const auth = require('../middleware/auth')
const memoryStore = require('../utils/memoryUserStore')
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
    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: 'All fields required' })
    }

    // Try database first, then fallback to memory store
    try {
      const existsPromise = User.findOne({ $or: [{ email }, { username }] })
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database timeout')), 3000)
      )
      
      const exists = await Promise.race([existsPromise, timeoutPromise])
      if (exists) {
        return res.status(409).json({ message: 'User already exists' })
      }
      
      const hash = await bcrypt.hash(password, 10)
      const user = await User.create({ name, username, email, password: hash })
      const token = jwt.sign({ 
        id: user._id, 
        role: user.role, 
        email: user.email 
      }, process.env.JWT_SECRET, { expiresIn: '30d' })
      
      res.status(201).json({
        message: 'Registration successful',
        user: { id: user._id, name, username, email, role: user.role },
        token
      })
    } catch (dbError) {
      console.log('Database unavailable, using memory store for registration')
      
      // Check if user exists in memory store
      const existingUser = await memoryStore.findUserByEmail(email) || await memoryStore.findUserByUsername(username)
      if (existingUser) {
        return res.status(409).json({ message: 'User already exists' })
      }
      
      // Create user in memory store
      const hash = await bcrypt.hash(password, 10)
      const user = await memoryStore.createUser({ name, username, email, password: hash })
      
      const token = jwt.sign({ 
        id: user._id, 
        role: user.role, 
        email: user.email 
      }, process.env.JWT_SECRET, { expiresIn: '30d' })
      
      res.status(201).json({
        message: 'Registration successful (temporary account)',
        user: { id: user._id, name, username, email, role: user.role },
        token
      })
    }
  } catch (err) {
    console.error('Registration error:', err.message)
    res.status(500).json({ message: 'Registration failed', error: err.message })
  }
})

// Login
router.post('/login', validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body
    
    // Try database authentication with timeout
    try {
      const userPromise = User.findOne({ email })
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database timeout')), 3000)
      )
      
      const user = await Promise.race([userPromise, timeoutPromise])
      
      if (!user) {
        // Try memory store if not found in database
        const memoryUser = await memoryStore.findUserByEmail(email)
        if (!memoryUser) {
          return res.status(401).json({ message: 'Invalid email or password' })
        }
        
        // Check password against memory store
        const isValidPassword = await bcrypt.compare(password, memoryUser.password)
        if (!isValidPassword) {
          return res.status(401).json({ message: 'Invalid email or password' })
        }
        
        const token = jwt.sign({ 
          id: memoryUser._id, 
          role: memoryUser.role, 
          email: memoryUser.email 
        }, process.env.JWT_SECRET, { expiresIn: '30d' })
        
        console.log(`� User ${memoryUser.username} logged in via memory store`)
        return res.json({ user: memoryUser, token })
      }
      
      // Check password against database user
      const isValidPassword = await bcrypt.compare(password, user.password)
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid email or password' })
      }
      
      const token = jwt.sign({ 
        id: user._id, 
        role: user.role, 
        email: user.email 
      }, process.env.JWT_SECRET, { expiresIn: '30d' })
      
      res.json({ user, token })
    } catch (dbError) {
      console.log('Database unavailable, checking memory store for login...')
      
      // Fallback to memory store
      const memoryUser = await memoryStore.findUserByEmail(email)
      if (!memoryUser) {
        return res.status(401).json({ message: 'Invalid email or password' })
      }
      
      const isValidPassword = await bcrypt.compare(password, memoryUser.password)
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid email or password' })
      }
      
      const token = jwt.sign({ 
        id: memoryUser._id, 
        role: memoryUser.role, 
        email: memoryUser.email 
      }, process.env.JWT_SECRET, { expiresIn: '30d' })
      
      const logMessage = memoryUser.role === 'owner' ? '👑 Owner logged in via fallback authentication' : `👤 User ${memoryUser.username} logged in via memory store`
      console.log(logMessage)
      return res.json({ user: memoryUser, token })
    }
  } catch (err) {
    console.error('Login error:', err.message)
    res.status(500).json({ message: 'Login failed', error: err.message })
  }
})

// Get current user
router.get('/me', auth(), async (req, res) => {
  try {
    // Try database with timeout
    try {
      const userPromise = User.findById(req.user.id).select('-password')
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database timeout')), 3000)
      )
      
      const user = await Promise.race([userPromise, timeoutPromise])
      
      if (!user) {
        // Try memory store
        const memoryUser = await memoryStore.findUserById(req.user.id)
        if (!memoryUser) {
          return res.status(404).json({ message: 'User not found' })
        }
        
        // Remove password from response
        const { password, ...userWithoutPassword } = memoryUser
        return res.json({ user: userWithoutPassword })
      }
      
      res.json({ user })
    } catch (dbError) {
      console.log('Database unavailable for /me endpoint, checking memory store...')
      
      // Fallback to memory store
      const memoryUser = await memoryStore.findUserById(req.user.id)
      if (!memoryUser) {
        return res.status(404).json({ message: 'User not found' })
      }
      
      // Remove password from response
      const { password, ...userWithoutPassword } = memoryUser
      return res.json({ user: userWithoutPassword })
    }
  } catch (err) {
    console.error('/me endpoint error:', err.message)
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

    // Try database first, then fallback to memory store
    try {
      const userPromise = User.findById(req.user.id)
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database timeout')), 3000)
      )
      
      const user = await Promise.race([userPromise, timeoutPromise])
      
      if (!user) {
        // Try memory store
        const memoryUser = await memoryStore.findUserById(req.user.id)
        if (!memoryUser) {
          return res.status(404).json({ message: 'User not found' })
        }
        
        // Verify current password
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, memoryUser.password)
        if (!isCurrentPasswordValid) {
          return res.status(400).json({ message: 'Current password is incorrect' })
        }
        
        // Hash new password and update in memory store
        const hashedNewPassword = await bcrypt.hash(newPassword, 12)
        await memoryStore.updateUserPassword(req.user.id, hashedNewPassword)
        
        console.log(`🔑 Password changed for user ${memoryUser.username} in memory store`)
        return res.json({ 
          success: true, 
          message: 'Password changed successfully (temporary account)',
          user: {
            id: memoryUser._id,
            name: memoryUser.name,
            username: memoryUser.username,
            email: memoryUser.email,
            role: memoryUser.role,
            avatar: memoryUser.avatar
          }
        })
      }
      
      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password)
      if (!isCurrentPasswordValid) {
        return res.status(400).json({ message: 'Current password is incorrect' })
      }

      // Hash new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 12)
      
      // Update password in database
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
    } catch (dbError) {
      console.log('Database unavailable for password change, using memory store...')
      
      // Fallback to memory store
      const memoryUser = await memoryStore.findUserById(req.user.id)
      if (!memoryUser) {
        return res.status(404).json({ message: 'User not found' })
      }
      
      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, memoryUser.password)
      if (!isCurrentPasswordValid) {
        return res.status(400).json({ message: 'Current password is incorrect' })
      }
      
      // Hash new password and update in memory store
      const hashedNewPassword = await bcrypt.hash(newPassword, 12)
      await memoryStore.updateUserPassword(req.user.id, hashedNewPassword)
      
      console.log(`🔑 Password changed for user ${memoryUser.username} in memory store`)
      res.json({ 
        success: true, 
        message: 'Password changed successfully (temporary account)',
        user: {
          id: memoryUser._id,
          name: memoryUser.name,
          username: memoryUser.username,
          email: memoryUser.email,
          role: memoryUser.role,
          avatar: memoryUser.avatar
        }
      })
    }
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
