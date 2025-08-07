import React, { useState, useEffect } from 'react'
import { 
  Heart, 
  ShoppingCart, 
  ArrowLeft, 
  X,
  Star,
  Trash2
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import ProductService from '../../services/ProductService'

const WishlistPage = () => {
  const { user, isOwner } = useAuth()
  const navigate = useNavigate()
  const [wishlistItems, setWishlistItems] = useState(ProductService.getWishlist())
  const [loading, setLoading] = useState(false)

  // Update wishlist when component mounts
  useEffect(() => {
    setWishlistItems(ProductService.getWishlist())
  }, [])

  // Refresh wishlist when page becomes visible (when user navigates to this page)
  useEffect(() => {
    const handleFocus = () => {
      setWishlistItems(ProductService.getWishlist())
    }

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        setWishlistItems(ProductService.getWishlist())
      }
    }

    window.addEventListener('focus', handleFocus)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('focus', handleFocus)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  // Listen for storage changes to sync wishlist from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'wishlist') {
        setWishlistItems(ProductService.getWishlist())
      }
    }

    const handleWishlistUpdate = () => {
      setWishlistItems(ProductService.getWishlist())
    }

    // Listen for storage events from other tabs/windows
    window.addEventListener('storage', handleStorageChange)
    
    // Listen for custom events from same tab
    window.addEventListener('wishlistUpdated', handleWishlistUpdate)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate)
    }
  }, [])

  const removeFromWishlist = (productId) => {
    try {
      const updatedWishlist = ProductService.removeFromWishlist(productId)
      setWishlistItems(updatedWishlist)
      toast.success('Removed from wishlist')
    } catch (error) {
      console.error('Error removing from wishlist:', error)
      toast.error('Failed to remove from wishlist')
    }
  }

  const addToCart = (product) => {
    try {
      // For items without size selection, use default size
      const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'M'
      ProductService.addToCart(product, defaultSize, 1)
      toast.success(`${product.name} added to cart!`)
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast.error('Failed to add to cart')
    }
  }

  const clearWishlist = () => {
    if (window.confirm('Are you sure you want to clear your entire wishlist?')) {
      try {
        ProductService.clearWishlist()
        setWishlistItems([])
        toast.success('Wishlist cleared')
      } catch (error) {
        console.error('Error clearing wishlist:', error)
        toast.error('Failed to clear wishlist')
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/store')}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Heart size={28} className="text-red-500" />
                  My Wishlist
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
                </p>
              </div>
            </div>
            
            {wishlistItems.length > 0 && (
              <button
                onClick={clearWishlist}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <Trash2 size={16} />
                Clear All
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {wishlistItems.length === 0 ? (
          <div className="text-center py-16">
            <Heart size={64} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Start adding items you love to keep track of them
            </p>
            <button
              onClick={() => navigate('/store')}
              className="btn-primary px-6 py-3"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((product) => (
              <div
                key={product._id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden"
              >
                {/* Product Image */}
                <div className="relative">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <button
                    onClick={() => removeFromWishlist(product._id)}
                    className="absolute top-2 right-2 p-2 bg-white/90 hover:bg-red-500 text-gray-600 hover:text-white rounded-full transition-all duration-200"
                  >
                    <X size={16} />
                  </button>
                  
                  {/* Product Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {product.isNew && (
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        New
                      </span>
                    )}
                    {product.isBestSeller && (
                      <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                        Best Seller
                      </span>
                    )}
                    {product.originalPrice > product.price && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        -{ProductService.calculateDiscount(product.originalPrice, product.price)}%
                      </span>
                    )}
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                    {product.description}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={`${
                            i < Math.floor(product.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      ({product.reviews})
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      R{product.price}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-sm text-gray-500 line-through">
                        R{product.originalPrice}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => addToCart(product)}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <ShoppingCart size={16} />
                      Add to Cart
                    </button>
                    <button
                      onClick={() => removeFromWishlist(product._id)}
                      className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                    >
                      <Heart size={16} className="fill-current" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default WishlistPage
