const express = require('express')
const Product = require('../models/Product')
const auth = require('../middleware/auth')
const { ownerRequired } = require('../middleware/ownership')
const router = express.Router()

// Get all store products (MaRk7Raw Fashion)
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({ isStorefront: true })
    res.json(products)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch products', error: err.message })
  }
})

// Owner: Add product to store
router.post('/', auth, ownerRequired, async (req, res) => {
  try {
    const { name, description, price, images, seo } = req.body
    const product = await Product.create({
      name,
      description,
      price,
      images,
      seo,
      owner: req.user.id,
      isStorefront: true
    })
    res.status(201).json(product)
  } catch (err) {
    res.status(500).json({ message: 'Failed to add product', error: err.message })
  }
})

// Owner: Remove product from store
router.delete('/:id', auth, ownerRequired, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id)
    res.json({ message: 'Product removed' })
  } catch (err) {
    res.status(500).json({ message: 'Failed to remove product', error: err.message })
  }
})

// Owner: Update product (SEO, price, images, etc.)
router.put('/:id', auth, ownerRequired, async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(updated)
  } catch (err) {
    res.status(500).json({ message: 'Failed to update product', error: err.message })
  }
})

module.exports = router
