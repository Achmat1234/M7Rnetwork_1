const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    maxlength: 500
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  category: {
    type: String,
    enum: ['Classic', 'Signature', 'Limited', 'Accessories'],
    default: 'Classic'
  },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  currency: { type: String, default: 'ZAR' },
  stock: { type: Number, default: 0 },
  sold: { type: Number, default: 0 },
  sizes: [{
    type: String,
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size']
  }],
  colors: [{ type: String }],
  images: [{ type: String }],
  tags: [{ type: String }],
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviews: [reviewSchema],
  status: {
    type: String,
    enum: ['active', 'inactive', 'draft'],
    default: 'active'
  },
  featured: { type: Boolean, default: false },
  isNew: { type: Boolean, default: true },
  isBestSeller: { type: Boolean, default: false },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isStorefront: { type: Boolean, default: false }, // true = MaRk7Raw store, false = marketplace
  seo: {
    title: String,
    description: String,
    keywords: [String]
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { suppressReservedKeysWarning: true })

// Indexes
productSchema.index({ category: 1 })
productSchema.index({ price: 1 })
productSchema.index({ rating: -1 })
productSchema.index({ sold: -1 })
productSchema.index({ name: 'text', description: 'text' })

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100)
  }
  return 0
})

// Ensure virtuals are included in JSON output
productSchema.set('toJSON', { virtuals: true })

module.exports = mongoose.model('Product', productSchema)
