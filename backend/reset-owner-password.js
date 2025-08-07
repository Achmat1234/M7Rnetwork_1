// Reset owner password script
require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

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

async function resetOwnerPassword() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    console.log('✅ Connected to MongoDB')

    const owner = await User.findOne({ email: 'mark7raw@gmail.com' })
    
    if (owner) {
      // Set a new temporary password
      const newPassword = 'M7ROwner2024!'
      const hashedPassword = await bcrypt.hash(newPassword, 10)
      
      owner.password = hashedPassword
      await owner.save()
      
      console.log('🎉 Owner password reset successfully!')
      console.log('\n🔑 NEW LOGIN CREDENTIALS:')
      console.log('📧 Email: mark7raw@gmail.com')
      console.log('🔐 Password: M7ROwner2024!')
      console.log('\n⚠️  IMPORTANT SECURITY NOTICE:')
      console.log('1. Login immediately with these credentials')
      console.log('2. Go to Owner Dashboard → Security Settings')
      console.log('3. Change to your preferred password')
      console.log('4. Keep your new password secure!')
      
    } else {
      console.log('❌ Owner account not found')
    }
    
  } catch (error) {
    console.error('❌ Reset failed:', error.message)
  } finally {
    await mongoose.disconnect()
    console.log('\n💾 Disconnected from MongoDB')
    process.exit(0)
  }
}

resetOwnerPassword()
