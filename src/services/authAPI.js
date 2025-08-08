import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'https://m7rnetwork1-production.up.railway.app/api'

// Debug logging
console.log('🔍 API_URL:', API_URL)
console.log('🔍 Environment:', import.meta.env.MODE)
console.log('🔍 VITE_API_URL:', import.meta.env.VITE_API_URL)

// Alert for debugging - remove this later
if (API_URL.includes('localhost')) {
  alert('⚠️ Still using localhost! Environment variable not working.')
} else {
  console.log('✅ Using Railway backend:', API_URL)
}

// Get auth token from localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const authAPI = {
  // Login
  login: async (email, password) => {
    try {
      console.log('🚀 Attempting login to:', `${API_URL}/auth/login`)
      const response = await axios.post(`${API_URL}/auth/login`, { email, password })
      console.log('✅ Login response:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Login error:', error.response?.data || error.message)
      console.error('❌ Full error:', error)
      throw error
    }
  },

  // Register
  register: async (userData) => {
    const response = await axios.post(`${API_URL}/auth/register`, userData)
    return response.data
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await axios.get(`${API_URL}/auth/me`, {
      headers: getAuthHeader()
    })
    return response.data
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    const response = await axios.put(`${API_URL}/auth/change-password`, {
      currentPassword,
      newPassword
    }, {
      headers: getAuthHeader()
    })
    return response.data
  },

  // Admin/Owner: Reset user password
  resetUserPassword: async (userId, newPassword) => {
    const response = await axios.put(`${API_URL}/auth/reset-password/${userId}`, {
      newPassword
    }, {
      headers: getAuthHeader()
    })
    return response.data
  }
}
