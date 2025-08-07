// Test the password change functionality
const axios = require('axios')

const testPasswordChange = async () => {
  try {
    console.log('Testing password change functionality...')
    
    // First login to get a token
    const loginResponse = await axios.post('http://localhost:5001/api/auth/login', {
      email: 'mark7raw@gmail.com',
      password: 'admin123'
    })
    
    const token = loginResponse.data.token
    console.log('✅ Login successful, got token')
    
    // Try to change password
    const changeResponse = await axios.put('http://localhost:5001/api/auth/change-password', {
      currentPassword: 'admin123',
      newPassword: 'newpass123'
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    console.log('✅ Password change response:', changeResponse.data.message)
    
    // Test login with new password
    const newLoginResponse = await axios.post('http://localhost:5001/api/auth/login', {
      email: 'mark7raw@gmail.com',
      password: 'newpass123'
    })
    
    console.log('✅ Login with new password successful!')
    
    // Change back to original password
    const revertResponse = await axios.put('http://localhost:5001/api/auth/change-password', {
      currentPassword: 'newpass123',
      newPassword: 'admin123'
    }, {
      headers: {
        'Authorization': `Bearer ${newLoginResponse.data.token}`
      }
    })
    
    console.log('✅ Password reverted back to admin123')
    console.log('🎉 Password change functionality is working perfectly!')
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data?.message || error.message)
  }
}

testPasswordChange()
