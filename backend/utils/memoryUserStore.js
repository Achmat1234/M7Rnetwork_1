// Temporary in-memory user storage for when database is unavailable
// This is only for development purposes

const bcrypt = require('bcryptjs')

class MemoryUserStore {
  constructor() {
    this.users = new Map()
    this.initializeOwner()
  }

  async initializeOwner() {
    // Add the owner account with simple test password that we know works
    const ownerHash = await bcrypt.hash('testpass123', 10)
    this.users.set('mark7raw@gmail.com', {
      _id: '507f1f77bcf86cd799439011',
      name: 'Achmat Armien',
      username: 'MaRk7RaW',
      email: 'mark7raw@gmail.com',
      password: ownerHash,
      role: 'owner',
      avatar: '👑',
      createdAt: new Date()
    })
    console.log('👑 Owner account initialized with simple password: testpass123')
  }

  async findUserByEmail(email) {
    return this.users.get(email) || null
  }

  async findUserByUsername(username) {
    for (const user of this.users.values()) {
      if (user.username === username) {
        return user
      }
    }
    return null
  }

  async findUserById(id) {
    for (const user of this.users.values()) {
      if (user._id === id) {
        return user
      }
    }
    return null
  }

  async createUser(userData) {
    const { name, username, email, password } = userData
    
    // Check if user already exists
    if (this.users.has(email)) {
      throw new Error('User with this email already exists')
    }
    
    for (const user of this.users.values()) {
      if (user.username === username) {
        throw new Error('User with this username already exists')
      }
    }
    
    const newUser = {
      _id: Date.now().toString(), // Simple ID generation
      name,
      username,
      email,
      password,
      role: 'user',
      avatar: '👤',
      createdAt: new Date()
    }
    
    this.users.set(email, newUser)
    return newUser
  }

  async updateUserPassword(userId, newPasswordHash) {
    for (const [email, user] of this.users.entries()) {
      if (user._id === userId) {
        user.password = newPasswordHash
        this.users.set(email, user)
        return user
      }
    }
    throw new Error('User not found')
  }

  getAllUsers() {
    return Array.from(this.users.values())
  }

  getUserCount() {
    return this.users.size
  }
}

// Create singleton instance
const memoryStore = new MemoryUserStore()

module.exports = memoryStore
