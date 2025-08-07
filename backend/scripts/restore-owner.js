require('dotenv').config()
const mongoose = require('mongoose')
const User = require('../models/User')

async function checkOwnerStatus() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('🔍 Checking owner status...')
    
    // Find your user account
    const user = await User.findOne({ email: 'mark7raw@gmail.com' })
    
    if (user) {
      console.log('👤 User found:', {
        name: user.name,
        email: user.email,
        role: user.role,
        id: user._id
      })
      
      if (user.role !== 'owner') {
        console.log('👑 Updating to owner role...')
        await User.findByIdAndUpdate(user._id, { role: 'owner' })
        console.log('✅ Owner role restored!')
      } else {
        console.log('✅ Already has owner role!')
      }
    } else {
      console.log('❌ User not found')
    }
    
    // Also check if there are any other users with owner role
    const owners = await User.find({ role: 'owner' })
    console.log('👑 Current owners:', owners.map(o => ({ email: o.email, name: o.name })))
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    mongoose.disconnect()
  }
}

checkOwnerStatus()
