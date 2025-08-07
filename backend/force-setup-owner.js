const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
require('dotenv').config()

// User model
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

async function forceSetupOwner() {
  try {
    console.log('🔄 Attempting to connect to MongoDB...')
    
    // Try connection with timeout
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // 5 second timeout
    })
    
    console.log('✅ Connected to MongoDB')

    // Delete any existing owner accounts first
    await User.deleteMany({ role: 'owner' })
    console.log('🗑️ Cleared existing owner accounts')

    // Create fresh owner account
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
    
    console.log('👑 Owner account created successfully!')
    console.log('📧 Email:', owner.email)
    console.log('🔑 Password: Owner@M7R2024!')
    console.log('👤 Username:', owner.username)
    console.log('🔰 Role:', owner.role)
    
    // Verify the account can be found
    const verification = await User.findOne({ email: 'mark7raw@gmail.com' })
    if (verification) {
      console.log('✅ Owner account verified in database')
      const passwordTest = await bcrypt.compare('Owner@M7R2024!', verification.password)
      console.log('🔐 Password verification:', passwordTest ? 'PASS' : 'FAIL')
    }
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message)
    
    if (error.message.includes('Could not connect')) {
      console.log('🌐 Trying alternative connection string...')
      // Try with a simpler connection approach
      try {
        await mongoose.connect('mongodb+srv://achmatzaydan:Tasqeen.54321@cluster0.t5qhrvy.mongodb.net/m7rnetworking?retryWrites=true&w=majority', {
          serverSelectionTimeoutMS: 10000,
        })
        console.log('✅ Connected with alternative string')
        // Retry setup
        await forceSetupOwner()
        return
      } catch (altError) {
        console.error('❌ Alternative connection also failed:', altError.message)
      }
    }
  } finally {
    await mongoose.disconnect()
    console.log('💾 Disconnected from MongoDB')
  }
}

forceSetupOwner()
