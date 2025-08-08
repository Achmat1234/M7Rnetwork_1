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
      sort.rating = -1
    } else if (sortBy === 'popular') {
      sort.sold = -1
    } else {
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1
    }

    // Execute query with pagination
    const products = await Product.find(filter)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('reviews.user', 'username')

    // Get total count for pagination
    const total = await Product.countDocuments(filter)

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// @route   GET /api/products/:id
// @desc    Get single product
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('reviews.user', 'username avatar')

    if (!product) {
      return res.status(404).json({ error: 'Product not found' })
    }

    res.json(product)
  } catch (error) {
    console.error('Error fetching product:', error)
    res.status(500).json({ error: 'Server error' })
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
      category,
      price,
      originalPrice,
      stock,
      sizes,
      colors,
      images,
      tags
    } = req.body

    // Validate required fields
    if (!name || !description || !category || !price || !stock) {
      return res.status(400).json({ 
        error: 'Name, description, category, price, and stock are required' 
      })
    }

    const product = new Product({
      name,
      description,
      category,
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : parseFloat(price),
      stock: parseInt(stock),
      sizes: sizes || [],
      colors: colors || [],
      images: images || [],
      tags: tags || [],
      createdBy: req.user.id
    })

    await product.save()
    res.status(201).json(product)
  } catch (error) {
    console.error('Error creating product:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// @route   PUT /api/products/:id
// @desc    Update product (Owner only)
// @access  Private (Owner)
router.put('/:id', auth, ownerRequired, async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      price,
      originalPrice,
      stock,
      sizes,
      colors,
      images,
      tags,
      status
    } = req.body

    const product = await Product.findById(req.params.id)
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' })
    }

    // Update fields
    if (name) product.name = name
    if (description) product.description = description
    if (category) product.category = category
    if (price) product.price = parseFloat(price)
    if (originalPrice) product.originalPrice = parseFloat(originalPrice)
    if (stock !== undefined) product.stock = parseInt(stock)
    if (sizes) product.sizes = sizes
    if (colors) product.colors = colors
    if (images) product.images = images
    if (tags) product.tags = tags
    if (status) product.status = status

    product.updatedAt = Date.now()

    await product.save()
    res.json(product)
  } catch (error) {
    console.error('Error updating product:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// @route   DELETE /api/products/:id
// @desc    Delete product (Owner only)
// @access  Private (Owner)
router.delete('/:id', auth, ownerRequired, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' })
    }

    await Product.findByIdAndDelete(req.params.id)
    res.json({ message: 'Product deleted successfully' })
  } catch (error) {
    console.error('Error deleting product:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// @route   POST /api/products/:id/review
// @desc    Add product review
// @access  Private
router.post('/:id/review', auth, async (req, res) => {
  try {
    const { rating, comment } = req.body

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' })
    }

    const product = await Product.findById(req.params.id)
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' })
    }

    // Check if user already reviewed this product
    const existingReview = product.reviews.find(
      review => review.user.toString() === req.user.id
    )

    if (existingReview) {
      return res.status(400).json({ error: 'You have already reviewed this product' })
    }

    // Add review
    product.reviews.push({
      user: req.user.id,
      rating: parseInt(rating),
      comment: comment || '',
      createdAt: Date.now()
    })

    // Recalculate average rating
    const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0)
    product.rating = totalRating / product.reviews.length

    await product.save()
    
    // Populate the new review for response
    await product.populate('reviews.user', 'username avatar')
    
    res.json(product)
  } catch (error) {
    console.error('Error adding review:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// @route   GET /api/products/stats/overview
// @desc    Get product statistics (Owner only)
// @access  Private (Owner)
router.get('/stats/overview', auth, ownerRequired, async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments()
    const activeProducts = await Product.countDocuments({ status: 'active' })
    const inactiveProducts = await Product.countDocuments({ status: 'inactive' })
    
    // Get revenue stats
    const revenueStats = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: { $multiply: ['$price', '$sold'] } },
          totalSold: { $sum: '$sold' },
          avgPrice: { $avg: '$price' },
          avgRating: { $avg: '$rating' }
        }
      }
    ])

    // Get category breakdown
    const categoryStats = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalSold: { $sum: '$sold' },
          revenue: { $sum: { $multiply: ['$price', '$sold'] } }
        }
      },
      { $sort: { count: -1 } }
    ])

    // Get low stock products
    const lowStockProducts = await Product.find({ 
      stock: { $lt: 10 }, 
      status: 'active' 
    }).select('name stock')

    const stats = revenueStats[0] || {
      totalRevenue: 0,
      totalSold: 0,
      avgPrice: 0,
      avgRating: 0
    }

    res.json({
      overview: {
        totalProducts,
        activeProducts,
        inactiveProducts,
        ...stats
      },
      categoryStats,
      lowStockProducts
    })
  } catch (error) {
    console.error('Error fetching product stats:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
