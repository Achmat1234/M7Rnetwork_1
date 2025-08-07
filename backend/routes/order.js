const express = require('express')
const Order = require('../models/Order')
const auth = require('../middleware/auth')
const router = express.Router()

// Place order
router.post('/', auth(), async (req, res) => {
  try {
    const { seller, products, total, paymentMethod, paymentId } = req.body
    const order = await Order.create({
      buyer: req.user.id,
      seller,
      products,
      total,
      paymentMethod,
      paymentId,
      status: 'pending'
    })
    res.status(201).json(order)
  } catch (err) {
    res.status(500).json({ message: 'Failed to place order', error: err.message })
  }
})

// Get my orders
router.get('/my', auth(), async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user.id })
      .populate('products.product')
      .populate('seller', 'name username')
    res.json(orders)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders', error: err.message })
  }
})

// Seller: Get orders for my products
router.get('/sales', auth(), async (req, res) => {
  try {
    const orders = await Order.find({ seller: req.user.id })
      .populate('products.product')
      .populate('buyer', 'name username')
    res.json(orders)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch sales', error: err.message })
  }
})

// Admin/Owner: Get all orders
router.get('/', auth(['admin', 'owner']), async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('products.product')
      .populate('buyer', 'name username')
      .populate('seller', 'name username')
    res.json(orders)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch all orders', error: err.message })
  }
})

// Update order status (admin/owner)
router.put('/:id', auth(['admin', 'owner']), async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(updated)
  } catch (err) {
    res.status(500).json({ message: 'Failed to update order', error: err.message })
  }
})

module.exports = router
