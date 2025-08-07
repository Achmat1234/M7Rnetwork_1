// Update owner details script
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

async function updateOwner() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    console.log('✅ Connected to MongoDB')

    const owner = await User.findOne({ email: 'mark7raw@gmail.com' })
    
    if (owner) {
      // Update owner details to your exact preferences
      owner.name = 'Achmat Armien'
      owner.username = 'MaRk7RaW'
      owner.role = 'owner'
      owner.avatar = '👑'
      
      await owner.save()
      
      console.log('🎉 Updated owner account:')
      console.log({
        id: owner._id,
        name: owner.name,
        username: owner.username,
        email: owner.email,
        role: owner.role,
        avatar: owner.avatar
      })
      
      console.log('\n👑 M7RNetworking Owner Access Granted!')
      console.log('🔑 Login Details:')
      console.log('📧 Email: mark7raw@gmail.com')
      console.log('👤 Name: Achmat Armien')
      console.log('🎯 Username: MaRk7RaW')
      console.log('🌟 Role: owner (COMPLETE PLATFORM CONTROL)')
      console.log('👑 Avatar: Crown (Owner Status)')
      
    } else {
      console.log('❌ Owner account not found')
    }
    
  } catch (error) {
    console.error('❌ Update failed:', error.message)
  } finally {
    await mongoose.disconnect()
    console.log('💾 Disconnected from MongoDB')
    process.exit(0)
  }
}

updateOwner()
