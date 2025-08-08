import React, { useState, useEffect } from 'react'
import { 
  ShoppingCart, 
  Heart, 
  Star, 
  Plus, 
  Minus, 
  Search,
  Filter,
  Grid,
  List,
  Crown,
  Edit,
  Trash2,
  Eye,
  Loader,
  User,
  Menu,
  X
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import ProductService from '../../services/ProductService'

const MaRk7RawStore = () => {
  const { user, isOwner } = useAuth()
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [cart, setCart] = useState(ProductService.getCartItems())
  const [wishlist, setWishlist] = useState(ProductService.getWishlist())
  const [viewMode, setViewMode] = useState('grid')
  const [filterCategory, setFilterCategory] = useState('all')
  const [sortBy, setSortBy] = useState('popular')
  const [searchTerm, setSearchTerm] = useState('')
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const categories = ProductService.getCategories()

  // Get mock products from ProductService
  const mockProducts = ProductService.getMockProducts()

  useEffect(() => {
    fetchProducts()
  }, [filterCategory, sortBy, searchTerm])

  // Listen for storage changes to sync cart and wishlist
  useEffect(() => {
    const handleStorageChange = () => {
      setCart(ProductService.getCartItems())
      setWishlist(ProductService.getWishlist())
    }

    const handleWishlistUpdate = () => {
      setWishlist(ProductService.getWishlist())
    }

    // Listen for storage events from other tabs/windows
    window.addEventListener('storage', handleStorageChange)
    
    // Listen for custom wishlist events from same tab
    window.addEventListener('wishlistUpdated', handleWishlistUpdate)
    
    // Also update when component mounts
    handleStorageChange()

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate)
    }
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      // Try to fetch from API, fallback to mock data
      try {
        const filters = {
          category: filterCategory,
          sortBy: sortBy,
          search: searchTerm
        }
        
        const response = await ProductService.getProducts(filters)
        setProducts(response.products || response)
      } catch (apiError) {
        console.warn('API not available, using mock data:', apiError)
        // Use mock data and apply filters
        let filtered = mockProducts
        
        if (filterCategory !== 'all') {
          filtered = filtered.filter(p => p.category === filterCategory)
        }
        
        if (searchTerm) {
          filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.description.toLowerCase().includes(searchTerm.toLowerCase())
          )
        }
        
        setProducts(filtered)
      }
      
      setError(null)
    } catch (err) {
      setError('Failed to load products. Please try again.')
      console.error('Error fetching products:', err)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = (product, size, quantity = 1) => {
    try {
      if (!size) {
        toast.error('Please select a size')
        return
      }
      
      const updatedCart = ProductService.addToCart(product, size, quantity)
      setCart(updatedCart)
      toast.success(`${product.name} added to cart!`)
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast.error('Failed to add item to cart')
    }
  }

  const toggleWishlist = (productId) => {
    try {
      const updatedWishlist = ProductService.toggleWishlist(productId)
      setWishlist(updatedWishlist)
      
      const isAdded = ProductService.isInWishlist(productId)
      toast.success(isAdded ? 'Added to wishlist!' : 'Removed from wishlist!')
    } catch (error) {
      console.error('Error updating wishlist:', error)
      toast.error('Failed to update wishlist')
    }
  }

  const handleViewCart = () => {
    navigate('/cart')
  }

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty')
      return
    }
    navigate('/checkout')
  }

  const filteredProducts = products.filter(product => {
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return a.price - b.price
      case 'price-high': return b.price - a.price
      case 'name': return a.name.localeCompare(b.name)
      case 'rating': return b.rating - a.rating
      default: return b.isBestSeller ? 1 : -1
    }
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-12 w-12 text-blue-400 mx-auto mb-4 animate-spin" />
          <h2 className="text-xl text-white">Loading MaRk7Raw Collection...</h2>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl text-white mb-4">Oops! Something went wrong</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={fetchProducts}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      {/* Navigation Header */}
      <div className="sticky top-0 z-50 bg-black/50 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-lg">M7R</span>
              </div>
              <h1 className="text-xl font-bold text-white">MaRk7Raw Store</h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <button
                onClick={handleViewCart}
                className="relative p-2 text-gray-300 hover:text-white transition-colors"
              >
                <ShoppingCart size={24} />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </button>

              <button
                onClick={() => navigate('/wishlist')}
                className="relative p-2 text-gray-300 hover:text-white transition-colors"
              >
                <Heart size={24} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {user ? (
                <button
                  onClick={() => navigate('/profile')}
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                >
                  <User size={20} />
                  <span>{user.name}</span>
                  {isOwner && <Crown size={16} className="text-yellow-400" />}
                </button>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Sign In
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="text-gray-300 hover:text-white p-2"
              >
                {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="md:hidden py-4 border-t border-white/20">
              <div className="flex flex-col space-y-4">
                <button
                  onClick={handleViewCart}
                  className="flex items-center justify-between text-gray-300 hover:text-white transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <ShoppingCart size={20} />
                    <span>Cart</span>
                  </div>
                  {cart.length > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                      {cart.reduce((sum, item) => sum + item.quantity, 0)}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => navigate('/wishlist')}
                  className="flex items-center justify-between text-gray-300 hover:text-white transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <Heart size={20} />
                    <span>Wishlist</span>
                  </div>
                  {wishlist.length > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                      {wishlist.length}
                    </span>
                  )}
                </button>

                {user ? (
                  <button
                    onClick={() => navigate('/profile')}
                    className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                  >
                    <User size={20} />
                    <span>{user.name}</span>
                    {isOwner && <Crown size={16} className="text-yellow-400" />}
                  </button>
                ) : (
                  <button
                    onClick={() => navigate('/login')}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative bg-black/50 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-xl">M7R</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white">
                MaRk7Raw <span className="text-yellow-400">Fashion</span>
              </h1>
              {isOwner && <Crown className="h-8 w-8 text-yellow-400" />}
            </div>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Premium streetwear collection designed for the bold and the brave. 
              Express your raw style with authentic South African fashion.
            </p>
            <div className="mt-8 flex items-center justify-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span>4.9/5 Customer Rating</span>
              </div>
              <div>•</div>
              <div>Free Shipping Nationwide</div>
              <div>•</div>
              <div>30-Day Returns</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Owner Quick Actions */}
        {isOwner && (
          <div className="mb-8 bg-yellow-500/10 border border-yellow-400/30 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-yellow-400" />
                <span className="text-yellow-300 font-semibold">Store Owner Controls</span>
              </div>
              <div className="flex gap-2">
                <button className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-400/30 px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Product
                </button>
                <button className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border border-purple-400/30 px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  View Orders
                </button>
                <button 
                  onClick={() => ProductService.testWishlist()}
                  className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-400/30 px-4 py-2 rounded-lg font-semibold transition-all duration-200"
                >
                  Test Wishlist
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="mb-8 bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all" className="bg-gray-800">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category} className="bg-gray-800">
                    {category}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="popular" className="bg-gray-800">Most Popular</option>
                <option value="price-low" className="bg-gray-800">Price: Low to High</option>
                <option value="price-high" className="bg-gray-800">Price: High to Low</option>
                <option value="name" className="bg-gray-800">Name A-Z</option>
                <option value="rating" className="bg-gray-800">Highest Rated</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === 'grid' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white/10 text-gray-400 hover:text-white'
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === 'list' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white/10 text-gray-400 hover:text-white'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1'
        }`}>
          {sortedProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              isOwner={isOwner}
              viewMode={viewMode}
              isInWishlist={ProductService.isInWishlist(product._id)}
              onToggleWishlist={() => toggleWishlist(product._id)}
              onAddToCart={addToCart}
            />
          ))}
        </div>

        {/* Shopping Cart Summary */}
        {cart.length > 0 && (
          <div className="fixed bottom-6 right-6 bg-blue-500 text-white p-4 rounded-xl shadow-lg">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              <span>{cart.reduce((sum, item) => sum + item.quantity, 0)} items</span>
              <span>•</span>
              <span>R{cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const ProductCard = ({ product, isOwner, viewMode, isInWishlist, onToggleWishlist, onAddToCart }) => {
  const [selectedSize, setSelectedSize] = useState('')
  const [quantity, setQuantity] = useState(1)

  const discount = product.discountPercentage || ProductService.calculateDiscount(product.originalPrice, product.price)
  const reviewCount = product.reviewCount || product.reviews?.length || 0

  // Grid view (default)
  if (viewMode !== 'list') {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden border border-white/20 group hover:border-blue-500/50 transition-all duration-300">
        <div className="relative">
          <img
            src={product.images[0] || "https://via.placeholder.com/400x400/7c3aed/ffffff?text=M7R+Product"}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.isNew && (
              <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
                NEW
              </span>
            )}
            {product.isBestSeller && (
              <span className="bg-yellow-500 text-black px-2 py-1 rounded text-xs font-semibold">
                BESTSELLER
              </span>
            )}
          </div>

          {/* Discount badge */}
          {discount > 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
              {discount}% OFF
            </div>
          )}

          {/* Action buttons overlay */}
          <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={() => onToggleWishlist(product._id)}
              className={`p-2 rounded-full backdrop-blur-lg transition-all duration-200 ${
                isInWishlist 
                  ? 'bg-red-500 text-white' 
                  : 'bg-black/50 hover:bg-red-500/80 text-white'
              }`}
            >
              <Heart className={`h-4 w-4 ${isInWishlist ? 'fill-current' : ''}`} />
            </button>
            
            {isOwner && (
              <>
                <button className="bg-black/50 hover:bg-yellow-500/80 text-white p-2 rounded-full backdrop-blur-lg transition-all duration-200">
                  <Edit className="h-4 w-4" />
                </button>
                <button className="bg-black/50 hover:bg-red-500/80 text-white p-2 rounded-full backdrop-blur-lg transition-all duration-200">
                  <Trash2 className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
            {product.name}
          </h3>
          
          <p className="text-gray-300 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-white">R{product.price}</span>
              {product.originalPrice > product.price && (
                <span className="text-gray-400 line-through text-sm">R{product.originalPrice}</span>
              )}
            </div>
            
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-gray-300 text-sm">{product.rating}</span>
              <span className="text-gray-400 text-sm">({reviewCount})</span>
            </div>
          </div>

          <div className="space-y-3">
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" className="bg-gray-800">Select Size</option>
              {product.sizes?.map(size => (
                <option key={size} value={size} className="bg-gray-800">{size}</option>
              ))}
            </select>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="bg-white/10 hover:bg-white/20 text-white p-1 rounded"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="text-white px-3">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="bg-white/10 hover:bg-white/20 text-white p-1 rounded"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <button
                onClick={() => selectedSize && onAddToCart(product, selectedSize, quantity)}
                disabled={!selectedSize}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2"
              >
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </button>
            </div>
          </div>

          <div className="mt-3 text-xs text-gray-400">
            {product.stock} in stock • Free shipping
          </div>
        </div>
      </div>
    )
  }

  // List view
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 flex gap-6">
      <div className="relative w-48 h-48 flex-shrink-0">
        <img
          src={product.images[0] || "https://via.placeholder.com/400x400/7c3aed/ffffff?text=M7R+Product"}
          alt={product.name}
          className="w-full h-full object-cover rounded-lg"
        />
        {product.isNew && (
          <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
            NEW
          </div>
        )}
        {product.isBestSeller && (
          <div className="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-1 rounded text-xs font-semibold">
            BESTSELLER
          </div>
        )}
      </div>
      
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
          <p className="text-gray-300 mb-4">{product.description}</p>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-white">R{product.price}</span>
              <span className="text-gray-400 line-through">R{product.originalPrice}</span>
              <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                {discount}% OFF
              </span>
            </div>
            
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-gray-300">{product.rating}</span>
              <span className="text-gray-400">({reviewCount})</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <select
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" className="bg-gray-800">Select Size</option>
            {product.sizes.map(size => (
              <option key={size} value={size} className="bg-gray-800">{size}</option>
            ))}
          </select>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="bg-white/10 hover:bg-white/20 text-white p-1 rounded"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="text-white px-3">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="bg-white/10 hover:bg-white/20 text-white p-1 rounded"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <button
            onClick={() => selectedSize && onAddToCart(product, selectedSize, quantity)}
            disabled={!selectedSize}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2"
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </button>

          <button
            onClick={() => onToggleWishlist(product._id)}
            className={`p-2 rounded-lg transition-all duration-200 ${
              isInWishlist 
                ? 'bg-red-500 text-white' 
                : 'bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white'
            }`}
          >
            <Heart className={`h-4 w-4 ${isInWishlist ? 'fill-current' : ''}`} />
          </button>

          {isOwner && (
            <div className="flex gap-2">
              <button className="bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 p-2 rounded-lg transition-all duration-200">
                <Edit className="h-4 w-4" />
              </button>
              <button className="bg-red-500/20 hover:bg-red-500/30 text-red-400 p-2 rounded-lg transition-all duration-200">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MaRk7RawStore
