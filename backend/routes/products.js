const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const { ownerRequired } = require('../middleware/ownership')
const Product = require('../models/Product')

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

    // Build filter object
    const filter = { status: 'active' }
    
    if (category && category !== 'all') {
      filter.category = category
    }
    
    if (priceMin || priceMax) {
      filter.price = {}
      if (priceMin) filter.price.$gte = parseFloat(priceMin)
      if (priceMax) filter.price.$lte = parseFloat(priceMax)
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ]
    }

    // Build sort object
    const sort = {}
    if (sortBy === 'price-low') {
      sort.price = 1
    } else if (sortBy === 'price-high') {
      sort.price = -1
    } else if (sortBy === 'rating') {
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
