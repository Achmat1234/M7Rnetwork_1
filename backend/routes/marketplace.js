const express = require('express')
const Product = require('../models/Product')
const auth = require('../middleware/auth')
const router = express.Router()

// Get all marketplace products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({ isStorefront: false })
    res.json(products)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch products', error: err.message })
  }
})

// User: Add product to marketplace
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, price, images, seo } = req.body
    const product = await Product.create({
      name,
      description,
      price,
      images,
      seo,
      owner: req.user.id,
      isStorefront: false
    })
    res.status(201).json(product)
  } catch (err) {
    res.status(500).json({ message: 'Failed to add product', error: err.message })
  }
})

// User: Remove own product
router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ message: 'Product not found' })
    if (product.owner.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' })
    await product.remove()
    res.json({ message: 'Product removed' })
  } catch (err) {
    res.status(500).json({ message: 'Failed to remove product', error: err.message })
  }
})

// User: Update own product
router.put('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ message: 'Product not found' })
    if (product.owner.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' })
    Object.assign(product, req.body)
    await product.save()
    res.json(product)
  } catch (err) {
    res.status(500).json({ message: 'Failed to update product', error: err.message })
  }
})

module.exports = router
