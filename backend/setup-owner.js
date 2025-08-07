// Manual owner setup script
// Run this with: node setup-owner.js

require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

// User model inline for this script
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  avatar: { type: String },
  role: { type: String, enum: ['user', 'admin', 'owner'], default: 'user' },
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  cart: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, default: 1 }
  }],
  createdAt: { type: Date, default: Date.now }
})

const User = mongoose.model('User', userSchema)

async function setupOwner() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    console.log('✅ Connected to MongoDB')

    // Check if owner already exists
    const existingOwner = await User.findOne({ role: 'owner' })
    if (existingOwner) {
      console.log('👑 Owner already exists:', {
        name: existingOwner.name,
        username: existingOwner.username,
        email: existingOwner.email
      })
      return
    }

    // Check if user with owner email exists
    const existingUser = await User.findOne({ email: 'mark7raw@gmail.com' })
    
    if (existingUser) {
      // Promote existing user to owner
      existingUser.role = 'owner'
      existingUser.avatar = '👑'
      existingUser.name = 'Achmat Armien'
      existingUser.username = 'MaRk7RaW'
      await existingUser.save()
      
      console.log('⬆️ Promoted existing user to owner:')
      console.log({
        id: existingUser._id,
        name: existingUser.name,
        username: existingUser.username,
        email: existingUser.email,
        role: existingUser.role,
        avatar: existingUser.avatar
      })
    } else {
      // Create new owner account
      const hashedPassword = await bcrypt.hash('Owner@M7R2024!', 10)
      
      const owner = new User({
        name: 'Achmat Armien',
        username: 'MaRk7RaW',
        email: 'mark7raw@gmail.com',
        password: hashedPassword,
        role: 'owner',
        avatar: '👑'
      })
      
      await owner.save()
      
      console.log('🎉 Created new owner account:')
      console.log({
        id: owner._id,
        name: owner.name,
        username: owner.username,
        email: owner.email,
        role: owner.role,
        avatar: owner.avatar,
        defaultPassword: 'Owner@M7R2024!'
      })
    }

    console.log('\n👑 Owner setup complete!')
    console.log('🔑 You can now login with:')
    console.log('📧 Email: mark7raw@gmail.com')
    console.log('🔐 Password: Owner@M7R2024! (or your current password if account existed)')
    console.log('🌟 Role: owner (full platform access)')
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message)
  } finally {
    await mongoose.disconnect()
    console.log('💾 Disconnected from MongoDB')
    process.exit(0)
  }
}

setupOwner()
