const mongoose = require('mongoose')
const User = require('./models/User')
require('dotenv').config()

async function checkUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')

    const users = await User.find({}, 'name username email role createdAt')
    console.log('Found users:')
    users.forEach((user, index) => {
      console.log(`${index + 1}. Name: ${user.name}`)
      console.log(`   Username: ${user.username}`)
      console.log(`   Email: ${user.email}`)
      console.log(`   Role: ${user.role}`)
      console.log(`   Created: ${user.createdAt}`)
      console.log(`   ID: ${user._id}`)
      console.log('---')
    })

    console.log(`Total users: ${users.length}`)
    
    await mongoose.disconnect()
  } catch (error) {
    console.error('Error:', error)
  }
}

checkUsers()
