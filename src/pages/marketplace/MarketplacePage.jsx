import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import { 
  ShoppingBag, 
  Plus, 
  Filter,
  Search,
  MapPin,
  Clock,
  Star,
  Heart,
  MessageCircle,
  TrendingUp,
  Users,
  Award,
  Zap,
  Eye,
  RefreshCw
} from 'lucide-react'
import toast from 'react-hot-toast'

const MarketplacePage = () => {
  const { user } = useAuth()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedLocation, setSelectedLocation] = useState('all')
  const [priceRange, setPriceRange] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  const categories = [
    { id: 'all', name: 'All Categories', icon: '🛒', count: 245 },
    { id: 'electronics', name: 'Electronics', icon: '📱', count: 67 },
    { id: 'fashion', name: 'Fashion & Beauty', icon: '👕', count: 89 },
    { id: 'services', name: 'Services', icon: '🔧', count: 45 },
    { id: 'digital', name: 'Digital Products', icon: '💻', count: 23 },
    { id: 'home', name: 'Home & Garden', icon: '🏠', count: 21 },
  ]

  const locations = [
    { id: 'all', name: 'All Locations' },
    { id: 'johannesburg', name: 'Johannesburg' },
    { id: 'cape-town', name: 'Cape Town' },
    { id: 'durban', name: 'Durban' },
    { id: 'pretoria', name: 'Pretoria' },
    { id: 'online', name: 'Online Only' },
  ]

  const priceRanges = [
    { id: 'all', name: 'All Prices' },
    { id: '0-100', name: 'Under R100' },
    { id: '100-500', name: 'R100 - R500' },
    { id: '500-1000', name: 'R500 - R1,000' },
    { id: '1000-5000', name: 'R1,000 - R5,000' },
    { id: '5000+', name: 'R5,000+' },
  ]

  // Mock marketplace products
  const mockProducts = [
    {
      _id: '1',
      name: 'iPhone 14 Pro Max',
      description: 'Excellent condition, barely used. Includes original box and accessories.',
      price: 15999,
      category: 'electronics',
      location: 'johannesburg',
      seller: { name: 'TechGuru_SA', rating: 4.9, verified: true },
      images: ['/api/placeholder/400/400'],
      timePosted: '2 hours ago',
      views: 45,
      likes: 12,
      featured: true,
      condition: 'Like New'
    },
    {
      _id: '2',
      name: 'Web Development Services',
      description: 'Professional website development for small businesses. Portfolio available.',
      price: 2500,
      category: 'services',
      location: 'online',
      seller: { name: 'WebMaster_Pro', rating: 4.8, verified: true },
      images: ['/api/placeholder/400/400'],
      timePosted: '5 hours ago',
      views: 23,
      likes: 8,
      featured: false,
      condition: 'Service'
    },
    {
      _id: '3',
      name: 'Nike Air Jordan Retro',
      description: 'Size 9 UK, authentic sneakers in good condition. No box.',
      price: 1200,
      category: 'fashion',
      location: 'cape-town',
      seller: { name: 'SneakerHead_CT', rating: 4.7, verified: false },
      images: ['/api/placeholder/400/400'],
      timePosted: '1 day ago',
      views: 89,
      likes: 34,
      featured: false,
      condition: 'Good'
    },
    {
      _id: '4',
      name: 'Social Media Marketing Package',
      description: 'Complete social media management for 3 months. Includes content creation.',
      price: 3500,
      category: 'services',
      location: 'online',
      seller: { name: 'SocialBoost_Agency', rating: 4.9, verified: true },
      images: ['/api/placeholder/400/400'],
      timePosted: '3 hours ago',
      views: 67,
      likes: 19,
      featured: true,
      condition: 'Service'
    },
    {
      _id: '5',
      name: 'Gaming Laptop - RTX 3070',
      description: 'High-performance gaming laptop perfect for streaming and content creation.',
      price: 18500,
      category: 'electronics',
      location: 'durban',
      seller: { name: 'GamerZone_KZN', rating: 4.6, verified: true },
      images: ['/api/placeholder/400/400'],
      timePosted: '6 hours ago',
      views: 156,
      likes: 42,
      featured: true,
      condition: 'Excellent'
    },
    {
      _id: '6',
      name: 'Digital Marketing Course',
      description: 'Complete digital marketing course with certificates. Lifetime access.',
      price: 899,
      category: 'digital',
      location: 'online',
      seller: { name: 'EduMaster_Online', rating: 4.8, verified: true },
      images: ['/api/placeholder/400/400'],
      timePosted: '2 days ago',
      views: 234,
      likes: 67,
      featured: false,
      condition: 'Digital'
    }
  ]

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        // const response = await axios.get('/api/marketplace')
        // setProducts(response.data)
        
        // Using mock data for now
        setTimeout(() => {
          setProducts(mockProducts)
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error('Error fetching marketplace products:', error)
        setProducts(mockProducts)
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    const matchesLocation = selectedLocation === 'all' || product.location === selectedLocation
    
    let matchesPrice = true
    if (priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(p => p.replace('+', ''))
      if (max) {
        matchesPrice = product.price >= parseInt(min) && product.price <= parseInt(max)
      } else {
        matchesPrice = product.price >= parseInt(min)
      }
    }
    
    return matchesSearch && matchesCategory && matchesLocation && matchesPrice
  })

  const sortedProducts = filteredProducts.sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return a.price - b.price
      case 'price-high': return b.price - a.price
      case 'popular': return b.views - a.views
      case 'rating': return b.seller.rating - a.seller.rating
      default: return new Date(b.timePosted) - new Date(a.timePosted) // Newest first
    }
  })

  const handleContactSeller = (product) => {
    toast.success(`Opening chat with ${product.seller.name}`)
    // Redirect to chat or open modal
  }

  const toggleLike = (productId) => {
    // Update likes in state
    toast.success('Added to favorites!')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw size={48} className="text-purple-500 animate-spin mx-auto mb-4" />
          <div className="text-xl font-semibold text-gray-900 dark:text-white">Loading Marketplace...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              M7R Marketplace
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 mb-8 max-w-3xl mx-auto">
              Buy and sell products, services, and digital assets within our trusted community network.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/marketplace/sell"
                className="bg-white text-purple-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg text-lg transition-all duration-200 transform hover:scale-105 inline-flex items-center space-x-2"
              >
                <Plus size={20} />
                <span>Sell Something</span>
              </Link>
              <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg">
                <div className="text-lg font-semibold">245+ Active Listings</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="card mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Filters</h3>
              
              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Search
                </label>
                <div className="relative">
                  <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <div className="space-y-2">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span>{category.icon}</span>
                          <span className="text-sm">{category.name}</span>
                        </div>
                        <span className="text-xs text-gray-500">{category.count}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Location
                </label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  {locations.map(location => (
                    <option key={location.id} value={location.id}>
                      {location.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Price Range
                </label>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  {priceRanges.map(range => (
                    <option key={range.id} value={range.id}>
                      {range.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Marketplace Stats
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Active Listings</span>
                  <span className="font-medium text-gray-900 dark:text-white">245</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Verified Sellers</span>
                  <span className="font-medium text-green-600 dark:text-green-400">89%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Avg Response</span>
                  <span className="font-medium text-blue-600 dark:text-blue-400">2.3h</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Sort and View Options */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <div className="mb-4 sm:mb-0">
                <p className="text-gray-600 dark:text-gray-400">
                  Showing {sortedProducts.length} of {products.length} listings
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="popular">Most Popular</option>
                  <option value="rating">Best Rated Sellers</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {sortedProducts.map(product => (
                <div key={product._id} className="card group hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105 relative">
                  {product.featured && (
                    <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                      <Star size={12} fill="currentColor" />
                      <span>Featured</span>
                    </div>
                  )}

                  {/* Product Image */}
                  <div className="relative overflow-hidden rounded-lg mb-4 h-48">
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center">
                      <span className="text-4xl">
                        {product.category === 'electronics' ? '📱' : 
                         product.category === 'fashion' ? '👕' : 
                         product.category === 'services' ? '🔧' : 
                         product.category === 'digital' ? '💻' : '🛒'}
                      </span>
                    </div>
                    
                    {/* Overlay with stats */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                      <div className="flex items-center justify-between text-white text-xs">
                        <div className="flex items-center space-x-2">
                          <Eye size={12} />
                          <span>{product.views}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Heart size={12} />
                          <span>{product.likes}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {product.name}
                      </h3>
                      <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded text-xs font-medium">
                        {product.condition}
                      </span>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>

                    {/* Seller Info */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">
                            {product.seller.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center space-x-1">
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {product.seller.name}
                            </span>
                            {product.seller.verified && (
                              <Award size={12} className="text-blue-500" fill="currentColor" />
                            )}
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star size={12} className="text-yellow-500" fill="currentColor" />
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              {product.seller.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <MapPin size={12} />
                          <span>{product.location}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <Clock size={12} />
                          <span>{product.timePosted}</span>
                        </div>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-4">
                      R {product.price.toLocaleString()}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleContactSeller(product)}
                        className="flex-1 btn-primary flex items-center justify-center space-x-2"
                      >
                        <MessageCircle size={16} />
                        <span>Contact Seller</span>
                      </button>
                      <button
                        onClick={() => toggleLike(product._id)}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:border-purple-500 dark:hover:border-purple-400 transition-colors"
                      >
                        <Heart size={16} className="text-gray-600 dark:text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {sortedProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No listings found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Try adjusting your search or filter criteria
                </p>
                <Link
                  to="/marketplace/sell"
                  className="btn-primary inline-flex items-center space-x-2"
                >
                  <Plus size={16} />
                  <span>Be the first to sell</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MarketplacePage
