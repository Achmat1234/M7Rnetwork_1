const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const User = require('./models/User')
require('dotenv').config()

async function resetPassword() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')

    // Email and new password from command line arguments
    const email = process.argv[2]
    const newPassword = process.argv[3]

    if (!email || !newPassword) {
      console.log('Usage: node reset-password.js <email> <new-password>')
      console.log('Example: node reset-password.js newuser@example.com testpass123')
      return
    }

    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      console.log(`User with email ${email} not found`)
      return
    }

    // Hash new password
    const hash = await bcrypt.hash(newPassword, 10)
    
    // Update user password
    await User.findByIdAndUpdate(user._id, { password: hash })
    
    console.log(`✅ Password updated successfully for user: ${user.name || user.username} (${email})`)
    console.log(`New password: ${newPassword}`)
    
    await mongoose.disconnect()
  } catch (error) {
    console.error('Error:', error)
  }
}

resetPassword()
