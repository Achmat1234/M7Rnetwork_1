// Profile data persistence service
const PROFILE_STORAGE_KEY = 'm7r_user_profile'
const FOLLOW_STORAGE_KEY = 'm7r_user_follows'

export const profileService = {
  // Save profile data to localStorage
  saveProfile: (profileData) => {
    try {
      const dataToSave = {
        ...profileData,
        lastUpdated: new Date().toISOString()
      }
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(dataToSave))
      return true
    } catch (error) {
      console.error('Failed to save profile:', error)
      return false
    }
  },

  // Load profile data from localStorage
  loadProfile: () => {
    try {
      const saved = localStorage.getItem(PROFILE_STORAGE_KEY)
      if (saved) {
        return JSON.parse(saved)
      }
      return null
    } catch (error) {
      console.error('Failed to load profile:', error)
      return null
    }
  },

  // Save uploaded files as base64 in localStorage (temporary solution)
  saveProfileImage: (imageFile, type = 'profile') => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const imageData = {
            data: e.target.result,
            type: imageFile.type,
            size: imageFile.size,
            name: imageFile.name,
            uploadedAt: new Date().toISOString()
          }
          
          const key = type === 'cover' ? 'm7r_cover_photo' : 'm7r_profile_picture'
          localStorage.setItem(key, JSON.stringify(imageData))
          resolve(e.target.result)
        } catch (error) {
          reject(error)
        }
      }
      reader.onerror = reject
      reader.readAsDataURL(imageFile)
    })
  },

  // Load saved images
  loadProfileImage: (type = 'profile') => {
    try {
      const key = type === 'cover' ? 'm7r_cover_photo' : 'm7r_profile_picture'
      const saved = localStorage.getItem(key)
      if (saved) {
        const imageData = JSON.parse(saved)
        return imageData.data
      }
      return null
    } catch (error) {
      console.error('Failed to load profile image:', error)
      return null
    }
  },

  // Follow/Unfollow functionality
  toggleFollow: (userId, action = 'follow') => {
    try {
      const follows = JSON.parse(localStorage.getItem(FOLLOW_STORAGE_KEY) || '[]')
      
      if (action === 'follow' && !follows.includes(userId)) {
        follows.push(userId)
      } else if (action === 'unfollow') {
        const index = follows.indexOf(userId)
        if (index > -1) follows.splice(index, 1)
      }
      
      localStorage.setItem(FOLLOW_STORAGE_KEY, JSON.stringify(follows))
      return follows
    } catch (error) {
      console.error('Failed to update follow status:', error)
      return []
    }
  },

  // Get follow status
  getFollowStatus: (userId) => {
    try {
      const follows = JSON.parse(localStorage.getItem(FOLLOW_STORAGE_KEY) || '[]')
      return follows.includes(userId)
    } catch (error) {
      return false
    }
  },

  // Get followers count (mock data for now)
  getFollowersCount: () => {
    try {
      const follows = JSON.parse(localStorage.getItem(FOLLOW_STORAGE_KEY) || '[]')
      return follows.length
    } catch (error) {
      return 0
    }
  },

  // Clear all profile data
  clearProfile: () => {
    try {
      localStorage.removeItem(PROFILE_STORAGE_KEY)
      localStorage.removeItem('m7r_cover_photo')
      localStorage.removeItem('m7r_profile_picture')
      localStorage.removeItem(FOLLOW_STORAGE_KEY)
      return true
    } catch (error) {
      console.error('Failed to clear profile:', error)
      return false
    }
  }
}

// API service for backend integration (when ready)
export const profileAPI = {
  // Future: Save profile to backend
  saveToServer: async (profileData) => {
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(profileData)
      })
      return await response.json()
    } catch (error) {
      console.error('API save failed:', error)
      throw error
    }
  },

  // Future: Load profile from backend
  loadFromServer: async () => {
    try {
      const response = await fetch('/api/profile', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      })
      return await response.json()
    } catch (error) {
      console.error('API load failed:', error)
      throw error
    }
  },

  // Future: Upload images to server
  uploadImage: async (imageFile, type) => {
    try {
      const formData = new FormData()
      formData.append('image', imageFile)
      formData.append('type', type)
      
      const response = await fetch('/api/profile/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: formData
      })
      return await response.json()
    } catch (error) {
      console.error('Image upload failed:', error)
      throw error
    }
  }
}
