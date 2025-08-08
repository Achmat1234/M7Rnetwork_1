const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const { ownerRequired } = require('../middleware/ownership')

// In-memory products storage (for development)
let products = [
  {
    id: 1,
    name: 'MaRk7Raw Signature Tee',
    description: 'Premium cotton blend with exclusive M7R design. Comfortable fit with bold graphics.',
    price: 299,
    category: 'clothing',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'White', 'Gray'],
    images: ['/api/placeholder/400/400'],
    stock: 50,
    tags: ['signature', 'premium', 'cotton'],
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 2,
    name: 'M7R Premium Hoodie',
    description: 'Ultra-soft fleece hoodie with embroidered logo. Perfect for casual wear.',
    price: 599,
    category: 'clothing',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Navy', 'Gray'],
    images: ['/api/placeholder/400/400'],
    stock: 25,
    tags: ['hoodie', 'premium', 'fleece'],
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

let nextId = 3

// @route   GET /api/products
// @desc    Get all products with filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { 
      category, 
      priceMin, 
      priceMax, 
      sortBy = 'createdAt', 
      sortOrder = 'desc',
      page = 1,
      limit = 12,
      search
    } = req.query

    let filteredProducts = products.filter(product => product.status === 'active')
    
    // Apply filters
    if (category && category !== 'all') {
      filteredProducts = filteredProducts.filter(product => product.category === category)
    }
    
    if (priceMin || priceMax) {
      filteredProducts = filteredProducts.filter(product => {
        const price = product.price
        if (priceMin && price < parseFloat(priceMin)) return false
        if (priceMax && price > parseFloat(priceMax)) return false
        return true
      })
    }

    if (search) {
      const searchLower = search.toLowerCase()
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchLower))
      )
    }

    // Apply sorting
    filteredProducts.sort((a, b) => {
      let aValue, bValue
      
      switch (sortBy) {
        case 'price-low':
        case 'price':
          aValue = a.price
          bValue = b.price
          break
        case 'price-high':
          aValue = b.price
          bValue = a.price
          break
        case 'name':
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        default:
          aValue = new Date(a.createdAt)
          bValue = new Date(b.createdAt)
      }
      
      if (sortBy === 'price-high') {
        return aValue - bValue
      }
      
      if (sortOrder === 'desc') {
        return aValue > bValue ? -1 : 1
      } else {
        return aValue < bValue ? -1 : 1
      }
    })

    // Apply pagination
    const startIndex = (parseInt(page) - 1) * parseInt(limit)
    const endIndex = startIndex + parseInt(limit)
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

    res.json({
      success: true,
      data: paginatedProducts,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(filteredProducts.length / parseInt(limit)),
        totalProducts: filteredProducts.length,
        hasNextPage: endIndex < filteredProducts.length,
        hasPrevPage: startIndex > 0
      }
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products'
    })
  }
})

// @route   GET /api/products/manage/all
// @desc    Get all products for management (including inactive) (Owner only)
// @access  Private (Owner)
router.get('/manage/all', auth, ownerRequired, async (req, res) => {
  try {
    res.json({
      success: true,
      data: products
    })
  } catch (error) {
    console.error('Error fetching products for management:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products'
    })
  }
})

// @route   GET /api/products/:id
// @desc    Get single product
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = products.find(p => p.id === parseInt(req.params.id))
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      })
    }

    res.json({
      success: true,
      data: product
    })
  } catch (error) {
    console.error('Error fetching product:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product'
    })
  }
})

// @route   POST /api/products
// @desc    Create new product (Owner only)
// @access  Private (Owner)
router.post('/', auth, ownerRequired, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      sizes,
      colors,
      images,
      stock,
      tags,
      status = 'active'
    } = req.body

    // Validation
    if (!name || !description || !price || !category) {
      return res.status(400).json({
        success: false,
        message: 'Name, description, price, and category are required'
      })
    }

    const newProduct = {
      id: nextId++,
      name,
      description,
      price: parseFloat(price),
      category,
      sizes: sizes || [],
      colors: colors || [],
      images: images || [],
      stock: parseInt(stock) || 0,
      tags: Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim()),
      status,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    products.push(newProduct)

    res.status(201).json({
      success: true,
      data: newProduct,
      message: 'Product created successfully'
    })
  } catch (error) {
    console.error('Error creating product:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create product'
    })
  }
})

// @route   PUT /api/products/:id
// @desc    Update product (Owner only)
// @access  Private (Owner)
router.put('/:id', auth, ownerRequired, async (req, res) => {
  try {
    const productIndex = products.findIndex(p => p.id === parseInt(req.params.id))
    
    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      })
    }

    const {
      name,
      description,
      price,
      category,
      sizes,
      colors,
      images,
      stock,
      tags,
      status
    } = req.body

    // Update product
    const updatedProduct = {
      ...products[productIndex],
      ...(name && { name }),
      ...(description && { description }),
      ...(price && { price: parseFloat(price) }),
      ...(category && { category }),
      ...(sizes && { sizes }),
      ...(colors && { colors }),
      ...(images && { images }),
      ...(stock !== undefined && { stock: parseInt(stock) }),
      ...(tags && { tags: Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim()) }),
      ...(status && { status }),
      updatedAt: new Date()
    }

    products[productIndex] = updatedProduct

    res.json({
      success: true,
      data: updatedProduct,
      message: 'Product updated successfully'
    })
  } catch (error) {
    console.error('Error updating product:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update product'
    })
  }
})

// @route   DELETE /api/products/:id
// @desc    Delete product (Owner only)
// @access  Private (Owner)
router.delete('/:id', auth, ownerRequired, async (req, res) => {
  try {
    const productIndex = products.findIndex(p => p.id === parseInt(req.params.id))
    
    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      })
    }

    products.splice(productIndex, 1)

    res.json({
      success: true,
      message: 'Product deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting product:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete product'
    })
  }
})

module.exports = router
