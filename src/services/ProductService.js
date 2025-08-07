// API service for products
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://your-api-domain.com/api' 
  : 'http://localhost:5001/api'

class ProductService {
  async getProducts(filters = {}) {
    try {
      const queryParams = new URLSearchParams()
      
      // Add filters to query params
      Object.keys(filters).forEach(key => {
        if (filters[key] && filters[key] !== 'all') {
          queryParams.append(key, filters[key])
        }
      })

      const response = await fetch(`${API_BASE_URL}/products?${queryParams}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching products:', error)
      throw error
    }
  }

  async getProduct(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch product')
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching product:', error)
      throw error
    }
  }

  async createProduct(productData) {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      })

      if (!response.ok) {
        throw new Error('Failed to create product')
      }

      return await response.json()
    } catch (error) {
      console.error('Error creating product:', error)
      throw error
    }
  }

  async updateProduct(id, productData) {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      })

      if (!response.ok) {
        throw new Error('Failed to update product')
      }

      return await response.json()
    } catch (error) {
      console.error('Error updating product:', error)
      throw error
    }
  }

  async deleteProduct(id) {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to delete product')
      }

      return await response.json()
    } catch (error) {
      console.error('Error deleting product:', error)
      throw error
    }
  }

  async addReview(productId, reviewData) {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_BASE_URL}/products/${productId}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(reviewData)
      })

      if (!response.ok) {
        throw new Error('Failed to add review')
      }

      return await response.json()
    } catch (error) {
      console.error('Error adding review:', error)
      throw error
    }
  }

  async getProductStats() {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_BASE_URL}/products/stats/overview`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch product stats')
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching product stats:', error)
      throw error
    }
  }

  // Helper methods for categories
  getCategories() {
    return ['Classic', 'Signature', 'Limited', 'Accessories']
  }

  getSizes() {
    return ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size']
  }

  getColors() {
    return ['Black', 'White', 'Grey', 'Navy', 'Burgundy', 'Gold', 'Cream', 'Off-White']
  }

  // Format currency
  formatPrice(price, currency = 'ZAR') {
    return `R${price.toFixed(2)}`
  }

  // Calculate discount percentage
  calculateDiscount(originalPrice, currentPrice) {
    if (!originalPrice || originalPrice <= currentPrice) return 0
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
  }

  // Local storage helpers for cart and wishlist
  getCartItems() {
    try {
      return JSON.parse(localStorage.getItem('cart') || '[]')
    } catch {
      return []
    }
  }

  saveCartItems(items) {
    localStorage.setItem('cart', JSON.stringify(items))
  }

  addToCart(product, size, quantity = 1) {
    const cart = this.getCartItems()
    const cartId = `${product._id}-${size}`
    
    const existingItem = cart.find(item => item.cartId === cartId)
    
    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cart.push({
        ...product,
        selectedSize: size,
        quantity,
        cartId
      })
    }
    
    this.saveCartItems(cart)
    return cart
  }

  removeFromCart(cartId) {
    const cart = this.getCartItems()
    const updatedCart = cart.filter(item => item.cartId !== cartId)
    this.saveCartItems(updatedCart)
    return updatedCart
  }

  updateCartQuantity(cartId, quantity) {
    const cart = this.getCartItems()
    const updatedCart = cart.map(item => 
      item.cartId === cartId ? { ...item, quantity } : item
    )
    this.saveCartItems(updatedCart)
    return updatedCart
  }

  getWishlist() {
    try {
      return JSON.parse(localStorage.getItem('wishlist') || '[]')
    } catch {
      return []
    }
  }

  saveWishlist(items) {
    localStorage.setItem('wishlist', JSON.stringify(items))
  }

  addToWishlist(product) {
    const wishlist = this.getWishlist()
    const existingItem = wishlist.find(item => item._id === product._id)
    
    if (!existingItem) {
      wishlist.push({
        ...product,
        dateAdded: new Date().toISOString()
      })
      this.saveWishlist(wishlist)
      
      // Dispatch custom event for same-tab updates
      window.dispatchEvent(new CustomEvent('wishlistUpdated', { 
        detail: { wishlist, productId: product._id, action: 'added' }
      }))
    }
    
    return wishlist
  }

  removeFromWishlist(productId) {
    const wishlist = this.getWishlist()
    const updatedWishlist = wishlist.filter(item => item._id !== productId)
    this.saveWishlist(updatedWishlist)
    
    // Dispatch custom event for same-tab updates
    window.dispatchEvent(new CustomEvent('wishlistUpdated', { 
      detail: { wishlist: updatedWishlist, productId, action: 'removed' }
    }))
    
    return updatedWishlist
  }

  toggleWishlist(productId) {
    const wishlist = this.getWishlist()
    const existingItem = wishlist.find(item => item._id === productId)
    
    if (existingItem) {
      return this.removeFromWishlist(productId)
    } else {
      // Find the product in mock data to add it
      const products = this.getMockProducts()
      const product = products.find(p => p._id === productId)
      if (product) {
        return this.addToWishlist(product)
      }
    }
    
    return wishlist
  }

  isInWishlist(productId) {
    const wishlist = this.getWishlist()
    return wishlist.some(item => item._id === productId)
  }

  // Clear methods for testing/reset
  clearCart() {
    localStorage.removeItem('cart')
    return []
  }

  clearWishlist() {
    localStorage.removeItem('wishlist')
    console.log('Wishlist cleared')
    return []
  }

  // Utility methods
  calculateDiscount(originalPrice, price) {
    if (!originalPrice || !price) return 0
    return Math.round(((originalPrice - price) / originalPrice) * 100)
  }

  getCategories() {
    return ['t-shirts', 'hoodies', 'jackets', 'pants', 'accessories']
  }

  // Mock data for when API is not available
  getMockProducts() {
    return [
      {
        _id: "1",
        id: 1,
        name: "MaRk7Raw Classic Black Tee",
        description: "Premium cotton blend with signature MaRk7Raw logo. Comfort meets style.",
        price: 299,
        originalPrice: 399,
        images: ["/api/placeholder/400/400"],
        category: "t-shirts",
        sizes: ["XS", "S", "M", "L", "XL", "XXL"],
        colors: ["Black", "White"],
        rating: 4.8,
        reviews: 124,
        stock: 50,
        isBestSeller: true,
        isNew: false
      },
      {
        _id: "2",
        id: 2,
        name: "MaRk7Raw Signature Logo Hoodie",
        description: "Soft fleece hoodie with embroidered logo. Perfect for layering.",
        price: 549,
        originalPrice: 699,
        images: ["/api/placeholder/400/400"],
        category: "hoodies",
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["Black", "Grey", "Navy"],
        rating: 4.9,
        reviews: 89,
        stock: 30,
        isBestSeller: true,
        isNew: false
      },
      {
        _id: "3",
        id: 3,
        name: "MaRk7Raw Denim Jacket",
        description: "Premium denim with unique distressing. A statement piece.",
        price: 899,
        originalPrice: 1199,
        images: ["/api/placeholder/400/400"],
        category: "jackets",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Blue", "Black"],
        rating: 4.7,
        reviews: 67,
        stock: 25,
        isBestSeller: false,
        isNew: true
      },
      {
        _id: "4",
        id: 4,
        name: "MaRk7Raw Cargo Pants",
        description: "Tactical-inspired design with multiple pockets. Function meets fashion.",
        price: 649,
        originalPrice: 849,
        images: ["/api/placeholder/400/400"],
        category: "pants",
        sizes: ["28", "30", "32", "34", "36", "38"],
        colors: ["Olive", "Black", "Khaki"],
        rating: 4.6,
        reviews: 95,
        stock: 40,
        isBestSeller: false,
        isNew: true
      },
      {
        _id: "5",
        id: 5,
        name: "MaRk7Raw Snapback Cap",
        description: "Classic snapback with embroidered logo. Complete your look.",
        price: 199,
        originalPrice: 299,
        images: ["/api/placeholder/400/400"],
        category: "accessories",
        sizes: ["One Size"],
        colors: ["Black", "White", "Grey"],
        rating: 4.5,
        reviews: 156,
        stock: 75,
        isBestSeller: true,
        isNew: false
      },
      {
        _id: "6",
        id: 6,
        name: "MaRk7Raw Graphic Tee - Limited Edition",
        description: "Exclusive design featuring original artwork. Limited quantities available.",
        price: 349,
        originalPrice: 449,
        images: ["/api/placeholder/400/400"],
        category: "t-shirts",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Black", "White"],
        rating: 4.9,
        reviews: 78,
        stock: 15,
        isBestSeller: false,
        isNew: true
      }
    ]
  }

  // Clear cart after successful checkout
  clearCart() {
    localStorage.removeItem('cart')
  }
}

export default new ProductService()
