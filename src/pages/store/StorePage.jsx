import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import { 
  Crown, 
  Star, 
  Heart, 
  ShoppingCart, 
  Zap, 
  Filter,
  Search,
  Grid,
  List,
  TrendingUp,
  Award,
  Truck,
  Shield,
  RefreshCw
} from 'lucide-react'
import toast from 'react-hot-toast'
import ProductService from '../../services/ProductService'

const StorePage = () => {
  const { user } = useAuth()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('featured')
  const [viewMode, setViewMode] = useState('grid')
  const [cart, setCart] = useState([])
  const [wishlist, setWishlist] = useState([])

  const categories = [
    { id: 'all', name: 'All Products', count: 24 },
    { id: 'tees', name: 'T-Shirts', count: 12 },
    { id: 'hoodies', name: 'Hoodies', count: 8 },
    { id: 'accessories', name: 'Accessories', count: 4 },
  ]

  const features = [
    { icon: Crown, text: "Premium Quality" },
    { icon: Truck, text: "Free Shipping" },
    { icon: Shield, text: "Member Warranty" },
    { icon: Award, text: "Exclusive Designs" }
  ]

  // Mock products with real MaRk7Raw fashion items
  const mockProducts = [
    {
      _id: '1',
      name: 'MaRk7Raw Signature Tee',
      description: 'Premium cotton blend with exclusive M7R logo design. Comfortable fit for everyday wear.',
      price: 299,
      originalPrice: 399,
      category: 'tees',
      images: ['https://via.placeholder.com/400x400/7c3aed/ffffff?text=M7R+Tee'],
      rating: 4.9,
      reviews: 124,
      inStock: true,
      featured: true,
      colors: ['Black', 'White', 'Navy'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL']
    },
    {
      _id: '2',
      name: 'Limited Edition Hoodie',
      description: 'Ultra-soft fleece hoodie with embroidered crown logo. Limited production run.',
      price: 649,
      originalPrice: 799,
      category: 'hoodies',
      images: ['https://via.placeholder.com/400x400/059669/ffffff?text=M7R+Hoodie'],
      rating: 4.8,
      reviews: 89,
      inStock: true,
      featured: true,
      colors: ['Black', 'Gray', 'Burgundy'],
      sizes: ['S', 'M', 'L', 'XL']
    },
    {
      _id: '3',
      name: 'Premium Cap Collection',
      description: 'Adjustable snapback cap with 3D embroidered M7R logo. One size fits all.',
      price: 199,
      originalPrice: 249,
      category: 'accessories',
      images: ['https://via.placeholder.com/400x400/dc2626/ffffff?text=M7R+Cap'],
      rating: 4.7,
      reviews: 156,
      inStock: true,
      featured: false,
      colors: ['Black', 'White', 'Red'],
      sizes: ['One Size']
    },
    {
      _id: '4',
      name: 'Executive Business Tee',
      description: 'Professional cut t-shirt perfect for networking events and business casual.',
      price: 399,
      originalPrice: 499,
      category: 'tees',
      images: ['https://via.placeholder.com/400x400/2563eb/ffffff?text=Business+Tee'],
      rating: 4.9,
      reviews: 203,
      inStock: true,
      featured: true,
      colors: ['Navy', 'Charcoal', 'White'],
      sizes: ['S', 'M', 'L', 'XL']
    },
    {
      _id: '5',
      name: 'Deluxe Member Pack',
      description: 'Exclusive bundle: Signature tee + premium cap + member sticker pack.',
      price: 449,
      originalPrice: 599,
      category: 'bundles',
      images: ['https://via.placeholder.com/400x400/ea580c/ffffff?text=Bundle+Pack'],
      rating: 5.0,
      reviews: 67,
      inStock: true,
      featured: true,
      colors: ['Mixed'],
      sizes: ['S', 'M', 'L', 'XL']
    },
    {
      _id: '6',
      name: 'Streetwear Hoodie Pro',
      description: 'Heavy-weight cotton hoodie with premium construction and lifetime warranty.',
      price: 799,
      originalPrice: 999,
      category: 'hoodies',
      images: ['https://via.placeholder.com/400x400/7c2d12/ffffff?text=Pro+Hoodie'],
      rating: 4.8,
      reviews: 145,
      inStock: true,
      featured: false,
      colors: ['Black', 'Olive', 'Cream'],
      sizes: ['M', 'L', 'XL', 'XXL']
    }
  ]

  useEffect(() => {
    // Simulate API call
    const fetchProducts = async () => {
      setLoading(true)
      try {
        // const response = await axios.get('/api/store')
        // setProducts(response.data)
        
        // Using mock data for now
        setTimeout(() => {
          setProducts(mockProducts)
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error('Error fetching products:', error)
        setProducts(mockProducts) // Fallback to mock data
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const addToCart = (product) => {
    setCart([...cart, product._id])
    toast.success(`${product.name} added to cart!`)
  }

  const toggleWishlist = (productId) => {
    const updatedWishlist = ProductService.toggleWishlist(productId)
    setWishlist(updatedWishlist)
    
    const isAdded = ProductService.isInWishlist(productId)
    toast.success(isAdded ? 'Added to wishlist!' : 'Removed from wishlist!')
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const sortedProducts = filteredProducts.sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return a.price - b.price
      case 'price-high': return b.price - a.price
      case 'rating': return b.rating - a.rating
      case 'newest': return new Date(b.createdAt) - new Date(a.createdAt)
      default: return b.featured - a.featured // Featured first
    }
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw size={48} className="text-yellow-500 animate-spin mx-auto mb-4" />
          <div className="text-xl font-semibold text-gray-900 dark:text-white">Loading MaRk7Raw Collection...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Crown size={20} />
              <span className="font-semibold">Exclusive Fashion Collection</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              MaRk7Raw Fashion
            </h1>
            <p className="text-xl md:text-2xl text-yellow-100 mb-8 max-w-3xl mx-auto">
              Premium streetwear and business casual clothing designed for creators, entrepreneurs, and visionaries.
            </p>
            {user && (
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3 inline-block">
                <div className="text-lg font-semibold">Member Discount Active: 25% OFF</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Features Bar */}
      <div className="bg-white dark:bg-gray-800 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center md:justify-between items-center space-y-2 md:space-y-0">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="flex items-center space-x-2 px-4">
                  <Icon size={16} className="text-yellow-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {feature.text}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="mb-8 space-y-4 lg:space-y-0 lg:flex lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center space-x-4">
            {/* Search */}
            <div className="relative min-w-64">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name} ({category.count})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-4">
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>

            {/* View Mode */}
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white dark:bg-gray-600 shadow-sm' : ''}`}
              >
                <Grid size={16} className="text-gray-600 dark:text-gray-400" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-white dark:bg-gray-600 shadow-sm' : ''}`}
              >
                <List size={16} className="text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {sortedProducts.map(product => (
            <div 
              key={product._id} 
              className={`card group hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105 relative ${
                viewMode === 'list' ? 'flex space-x-6' : 'flex flex-col'
              }`}
            >
              {product.featured && (
                <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                  <Star size={12} fill="currentColor" />
                  <span>Featured</span>
                </div>
              )}

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product._id)}
                className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
              >
                <Heart 
                  size={16} 
                  className={ProductService.isInWishlist(product._id) ? 'text-red-500 fill-current' : 'text-gray-600'} 
                />
              </button>

              {/* Product Image */}
              <div className={`relative overflow-hidden rounded-lg ${
                viewMode === 'list' ? 'w-48 h-48 flex-shrink-0' : 'w-full h-64 mb-4'
              }`}>
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center">
                  <span className="text-6xl">👕</span>
                </div>
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-bold">Out of Stock</span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className={viewMode === 'list' ? 'flex-1' : ''}>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
                    {product.name}
                  </h3>
                  {product.originalPrice > product.price && (
                    <div className="bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-2 py-1 rounded text-xs font-bold">
                      SALE
                    </div>
                  )}
                </div>

                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                  {product.description}
                </p>

                {/* Rating */}
                <div className="flex items-center space-x-2 mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={14} 
                        className={i < Math.floor(product.rating) ? 'text-yellow-500 fill-current' : 'text-gray-300 dark:text-gray-600'} 
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                    R {product.price}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-lg text-gray-500 dark:text-gray-400 line-through">
                      R {product.originalPrice}
                    </span>
                  )}
                  {user && (
                    <span className="bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 px-2 py-1 rounded text-xs font-bold">
                      Member Price
                    </span>
                  )}
                </div>

                {/* Colors */}
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Colors:</span>
                  <div className="flex space-x-1">
                    {product.colors.slice(0, 3).map((color, index) => (
                      <div 
                        key={index}
                        className="w-4 h-4 rounded-full border-2 border-gray-300 dark:border-gray-600"
                        style={{ backgroundColor: color.toLowerCase() === 'black' ? '#000' : color.toLowerCase() === 'white' ? '#fff' : color.toLowerCase() }}
                      />
                    ))}
                    {product.colors.length > 3 && (
                      <span className="text-xs text-gray-500">+{product.colors.length - 3}</span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => addToCart(product)}
                    disabled={!product.inStock}
                    className="flex-1 btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart size={16} />
                    <span>Add to Cart</span>
                  </button>
                  <Link
                    to={`/store/product/${product._id}`}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:border-yellow-500 dark:hover:border-yellow-400 transition-colors text-center"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {sortedProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No products found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default StorePage
