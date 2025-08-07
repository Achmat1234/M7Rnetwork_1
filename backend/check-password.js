// Check current user password script
require('dotenv').config()
const mongoose = require('mongoose')

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

async function checkCurrentPassword() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    console.log('✅ Connected to MongoDB')

    const owner = await User.findOne({ email: 'mark7raw@gmail.com' })
    
    if (owner) {
      console.log('\n👑 Owner Account Details:')
      console.log('📧 Email:', owner.email)
      console.log('👤 Name:', owner.name)
      console.log('🎯 Username:', owner.username)
      console.log('🌟 Role:', owner.role)
      console.log('👑 Avatar:', owner.avatar)
      console.log('📅 Created:', owner.createdAt)
      
      // Note: We can't show the actual password as it's hashed with bcrypt
      console.log('\n🔐 Password Information:')
      console.log('🔒 Current password is securely hashed with bcrypt')
      console.log('📝 Hash starts with:', owner.password.substring(0, 10) + '...')
      console.log('💡 You can use the password change form to set a new password')
      
      // Check if this looks like the default password hash
      console.log('\n❓ Password Status:')
      if (owner.password.includes('$2a$') || owner.password.includes('$2b$')) {
        console.log('✅ Password is properly hashed')
        console.log('🔑 If you forgot your password, you can:')
        console.log('   1. Use the "Change Password" form in your dashboard')
        console.log('   2. Or reset it using the owner setup script')
      }
      
    } else {
      console.log('❌ Owner account not found')
    }
    
  } catch (error) {
    console.error('❌ Check failed:', error.message)
  } finally {
    await mongoose.disconnect()
    console.log('\n💾 Disconnected from MongoDB')
    process.exit(0)
  }
}

checkCurrentPassword()
