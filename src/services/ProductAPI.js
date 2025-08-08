// ProductAPI service for backend communication
const API_URL = import.meta.env.VITE_API_URL || 'https://m7rnetwork1-production.up.railway.app/api'

class ProductAPI {
  // Get auth token from localStorage
  getAuthToken() {
    return localStorage.getItem('token')
  }

  // Get auth headers
  getAuthHeaders() {
    const token = this.getAuthToken()
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  }

  // Get all products (public)
  async getProducts(filters = {}) {
    try {
      const queryParams = new URLSearchParams()
      
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== '') {
          queryParams.append(key, filters[key])
        }
      })

      const response = await fetch(`${API_URL}/products?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching products:', error)
      throw error
    }
  }

  // Get single product (public)
  async getProduct(id) {
    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching product:', error)
      throw error
    }
  }

  // Get all products for management (owner only)
  async getAllProductsForManagement() {
    try {
      const response = await fetch(`${API_URL}/products/manage/all`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      })

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching products for management:', error)
      throw error
    }
  }

  // Create new product (owner only)
  async createProduct(productData) {
    try {
      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(productData)
      })

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error creating product:', error)
      throw error
    }
  }

  // Update product (owner only)
  async updateProduct(id, productData) {
    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(productData)
      })

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error updating product:', error)
      throw error
    }
  }

  // Delete product (owner only)
  async deleteProduct(id) {
    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      })

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error deleting product:', error)
      throw error
    }
  }
}

export default new ProductAPI()
