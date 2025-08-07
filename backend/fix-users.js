const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
require('dotenv').config()

// Import User model
const User = require('./models/User')

const fixUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')

    // Find all users
    const users = await User.find({})
    console.log(`Found ${users.length} users`)

    let fixedCount = 0

    for (const user of users) {
      let needsUpdate = false
      const updates = {}

      // Fix undefined names
      if (!user.name || user.name === 'undefined') {
        updates.name = user.username || 'User'
        needsUpdate = true
        console.log(`Fixing name for user: ${user.email}`)
      }

      // Fix undefined usernames
      if (!user.username || user.username === 'undefined') {
        updates.username = user.email.split('@')[0]
        needsUpdate = true
        console.log(`Fixing username for user: ${user.email}`)
      }

      // Ensure role is set
      if (!user.role) {
        updates.role = 'user'
        needsUpdate = true
        console.log(`Setting role for user: ${user.email}`)
      }

      // Check if password might need rehashing (if it's not properly hashed)
      if (user.password && !user.password.startsWith('$2a$') && !user.password.startsWith('$2b$')) {
        console.log(`Password for ${user.email} might not be properly hashed`)
        // You can uncomment this to rehash if needed:
        // updates.password = await bcrypt.hash(user.password, 10)
        // needsUpdate = true
      }

      // Update user if needed
      if (needsUpdate) {
        await User.findByIdAndUpdate(user._id, updates)
        fixedCount++
        console.log(`✅ Fixed user: ${user.email}`)
      }
    }

    console.log(`\n✅ Fixed ${fixedCount} users`)
    
    // Display final user list
    const updatedUsers = await User.find({}, 'name username email role createdAt').sort({ createdAt: -1 })
    console.log('\nAll users:')
    updatedUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.username}) - ${user.email} [${user.role}]`)
    })

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await mongoose.connection.close()
    console.log('Disconnected from MongoDB')
  }
}

fixUsers()
