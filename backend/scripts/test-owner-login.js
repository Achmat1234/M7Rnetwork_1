// Test script to verify owner login and JWT token
const fetch = require('node-fetch')

async function testOwnerLogin() {
  try {
    console.log('🔐 Testing owner login...')
    
    const loginResponse = await fetch('http://localhost:5001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'mark7raw@gmail.com',
        password: 'your-password' // Replace with your actual password
      })
    })

    const loginData = await loginResponse.json()
    
    if (loginResponse.ok) {
      console.log('✅ Login successful!')
      console.log('👑 User role:', loginData.user.role)
      console.log('🔑 Token includes role:', !!loginData.token)
      
      // Test the /me endpoint
      const meResponse = await fetch('http://localhost:5001/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${loginData.token}`
        }
      })
      
      const meData = await meResponse.json()
      
      if (meResponse.ok) {
        console.log('✅ /me endpoint works!')
        console.log('👤 User data:', meData.user)
        console.log('👑 Is owner:', meData.user.role === 'owner')
      } else {
        console.log('❌ /me endpoint failed:', meData)
      }
      
    } else {
      console.log('❌ Login failed:', loginData)
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

// testOwnerLogin() // Uncomment to run the test
