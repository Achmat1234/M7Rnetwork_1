const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
require('dotenv').config()

// Import User model
const User = require('./models/User')

const testLogin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')

    // Test user credentials
    const email = 'mark7raw@gmail.com'
    const testPassword = 'testpass123'
    
    console.log(`\nTesting login for: ${email}`)
    console.log(`Password: ${testPassword}`)
    
    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      console.log('❌ User not found')
      return
    }
    
    console.log(`✅ User found: ${user.name} (${user.email})`)
    console.log(`Password hash: ${user.password.substring(0, 20)}...`)
    
    // Test password
    const isValid = await bcrypt.compare(testPassword, user.password)
    console.log(`Password match: ${isValid ? '✅ VALID' : '❌ INVALID'}`)
    
    if (!isValid) {
      console.log('\n🔧 Resetting password...')
      const newHash = await bcrypt.hash(testPassword, 10)
      await User.findByIdAndUpdate(user._id, { password: newHash })
      console.log('✅ Password reset successfully')
      
      // Test again
      const updatedUser = await User.findOne({ email })
      const isValidNow = await bcrypt.compare(testPassword, updatedUser.password)
      console.log(`New password test: ${isValidNow ? '✅ VALID' : '❌ STILL INVALID'}`)
    }

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await mongoose.connection.close()
    console.log('Disconnected from MongoDB')
  }
}

testLogin()
