import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'https://m7rnetwork1-production.up.railway.app/api'

export const setupAPI = {
  // Create owner account
  setupOwner: async () => {
    const response = await axios.post(`${API_URL}/setup/setup-owner`)
    return response.data
  },

  // Promote existing user to owner
  promoteToOwner: async (email) => {
    const response = await axios.post(`${API_URL}/setup/promote-to-owner`, { email })
    return response.data
  }
}
