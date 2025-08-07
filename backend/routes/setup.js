const express = require('express')
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const router = express.Router()

// One-time owner setup route
router.post('/setup-owner', async (req, res) => {
  try {
    // Check if owner already exists
    const existingOwner = await User.findOne({ role: 'owner' })
    if (existingOwner) {
      return res.status(400).json({ message: 'Owner already exists' })
    }

    // Owner credentials
    const ownerData = {
      name: 'Achmat Armien',
      username: 'MaRk7RaW',
      email: 'mark7raw@gmail.com',
      password: await bcrypt.hash('Owner@M7R2024!', 10), // Secure default password
      role: 'owner',
      avatar: '👑'
    }

    const owner = new User(ownerData)
    await owner.save()

    res.status(201).json({ 
      message: 'Owner account created successfully',
      owner: {
        id: owner._id,
        name: owner.name,
        username: owner.username,
        email: owner.email,
        role: owner.role,
        avatar: owner.avatar
      }
    })
  } catch (error) {
    console.error('Owner setup error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Update existing user to owner (alternative method)
router.post('/promote-to-owner', async (req, res) => {
  try {
    const { email } = req.body
    
    if (email !== 'mark7raw@gmail.com') {
      return res.status(403).json({ message: 'Unauthorized' })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Check if owner already exists
    const existingOwner = await User.findOne({ role: 'owner' })
    if (existingOwner && existingOwner._id.toString() !== user._id.toString()) {
      return res.status(400).json({ message: 'Owner already exists' })
    }

    user.role = 'owner'
    user.avatar = '👑'
    await user.save()

    res.json({ 
      message: 'User promoted to owner successfully',
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    })
  } catch (error) {
    console.error('Promotion error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

module.exports = router
