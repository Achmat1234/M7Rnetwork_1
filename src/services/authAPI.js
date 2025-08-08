import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'

// Get auth token from localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const authAPI = {
  // Login
  login: async (email, password) => {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password })
    return response.data
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
