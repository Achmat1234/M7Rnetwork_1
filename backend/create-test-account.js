const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
require('dotenv').config()

const User = require('./models/User')

const createTestAccount = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')

    // You can customize these details for your test account
    const testUser = {
      name: 'Test User',
      username: 'testuser',
      email: 'your-other-email@example.com', // Replace with your actual email
      password: 'your-password', // Replace with your preferred password
      role: 'user' // or 'admin' if you want admin privileges
    }

    console.log('Creating test account...')
    console.log(`Email: ${testUser.email}`)
    console.log(`Password: ${testUser.password}`)
    console.log(`Role: ${testUser.role}`)

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [
        { email: testUser.email },
        { username: testUser.username }
      ]
    })

    if (existingUser) {
      console.log('❌ User already exists. Updating password...')
      const hashedPassword = await bcrypt.hash(testUser.password, 10)
      await User.findByIdAndUpdate(existingUser._id, {
        password: hashedPassword,
        name: testUser.name,
        role: testUser.role
      })
      console.log('✅ Existing user updated with new credentials')
    } else {
      // Hash password
      const hashedPassword = await bcrypt.hash(testUser.password, 10)
      
      // Create new user
      const newUser = await User.create({
        name: testUser.name,
        username: testUser.username,
        email: testUser.email,
        password: hashedPassword,
        role: testUser.role
      })
      
      console.log('✅ New test account created successfully!')
      console.log(`User ID: ${newUser._id}`)
    }

    console.log('\n🎉 Test account ready!')
    console.log('You can now login with these credentials on your site.')

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await mongoose.connection.close()
    console.log('Disconnected from MongoDB')
  }
}

createTestAccount()
