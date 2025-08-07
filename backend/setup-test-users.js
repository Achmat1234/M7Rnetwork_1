const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
require('dotenv').config()

const User = require('./models/User')

const setupTestUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')

    const testPassword = 'testpass123'
    const testUsers = [
      'mark7raw@gmail.com',      // Owner account
      'admin@demo.com',          // Admin account  
      'user@demo.com',           // Regular user
      'newuser@example.com'      // Test user
    ]

    console.log('Setting up test accounts with password: testpass123\n')

    for (const email of testUsers) {
      const user = await User.findOne({ email })
      if (user) {
        const newHash = await bcrypt.hash(testPassword, 10)
        await User.findByIdAndUpdate(user._id, { password: newHash })
        console.log(`✅ ${user.name} (${email}) - Password set`)
      } else {
        console.log(`❌ User not found: ${email}`)
      }
    }

    console.log('\n🎉 All test accounts ready!')
    console.log('You can now login with any of these accounts using password: testpass123')

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await mongoose.connection.close()
  }
}

setupTestUsers()
