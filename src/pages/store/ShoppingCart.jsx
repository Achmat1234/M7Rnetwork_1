import React, { useState, useEffect } from 'react'
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  X, 
  Heart,
  CreditCard,
  Truck,
  Shield,
  ArrowLeft,
  CheckCircle
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import ProductService from '../../services/ProductService'

const ShoppingCartPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState(ProductService.getCartItems())
  const [promoCode, setPromoCode] = useState('')
  const [appliedPromo, setAppliedPromo] = useState(null)
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  // Update cart when component mounts
  useEffect(() => {
    setCartItems(ProductService.getCartItems())
  }, [])

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shipping = subtotal > 500 ? 0 : 65 // Free shipping over R500
  const promoDiscount = appliedPromo ? subtotal * 0.1 : 0 // 10% discount example
  const total = subtotal + shipping - promoDiscount

  const updateQuantity = (cartId, newQuantity) => {
    if (newQuantity === 0) {
      removeItem(cartId)
      return
    }
    
    const updatedCart = ProductService.updateCartQuantity(cartId, newQuantity)
    setCartItems(updatedCart)
  }

  const removeItem = (cartId) => {
    const updatedCart = ProductService.removeFromCart(cartId)
    setCartItems(updatedCart)
    toast.success('Item removed from cart')
  }

  const applyPromoCode = () => {
    // Example promo codes
    const promoCodes = {
      'MARK7RAW10': { discount: 0.1, description: '10% off your order' },
      'WELCOME15': { discount: 0.15, description: '15% off for new customers' },
      'FREESHIP': { shipping: true, description: 'Free shipping' }
    }

    if (promoCodes[promoCode.toUpperCase()]) {
      setAppliedPromo(promoCodes[promoCode.toUpperCase()])
      setPromoCode('')
    }
  }

  const proceedToCheckout = () => {
    setIsCheckingOut(true)
    // Here we'll integrate with YOCO payment gateway
    setTimeout(() => {
      // Simulate checkout process
      alert('Redirecting to YOCO payment gateway...')
      setIsCheckingOut(false)
    }, 2000)
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="text-center">
            <ShoppingCart className="h-24 w-24 text-gray-400 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-white mb-4">Your cart is empty</h1>
            <p className="text-gray-300 mb-8">
              Looks like you haven't added anything to your cart yet. 
              Start shopping to fill it up!
            </p>
            <button
              onClick={() => navigate('/store')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 mx-auto"
            >
              <ArrowLeft className="h-5 w-5" />
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => window.history.back()}
            className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg transition-all duration-200"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-3xl font-bold text-white">Shopping Cart</h1>
          <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {cartItems.reduce((sum, item) => sum + item.quantity, 0)} items
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.cartId} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <div className="flex items-center gap-6">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">{item.name}</h3>
                    <p className="text-gray-300 text-sm mb-2">Size: {item.selectedSize}</p>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-white">R{item.price}</span>
                        <span className="text-gray-400 line-through text-sm">R{item.originalPrice}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                          className="bg-white/10 hover:bg-white/20 text-white p-1 rounded"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="text-white px-3 py-1 bg-white/10 rounded min-w-[3rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          className="bg-white/10 hover:bg-white/20 disabled:bg-gray-600 text-white p-1 rounded"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-4">
                    <span className="text-xl font-bold text-white">
                      R{item.price * item.quantity}
                    </span>
                    <button
                      onClick={() => removeItem(item.cartId)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {item.quantity >= item.stock && (
                  <div className="mt-4 text-sm text-yellow-400 bg-yellow-500/10 border border-yellow-400/30 rounded-lg p-2">
                    ⚠️ Maximum stock reached ({item.stock} available)
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 sticky top-6">
              <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>
              
              {/* Promo Code */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Promo Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter code"
                    className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={applyPromoCode}
                    disabled={!promoCode}
                    className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200"
                  >
                    Apply
                  </button>
                </div>
                
                {appliedPromo && (
                  <div className="mt-2 text-sm text-green-400 bg-green-500/10 border border-green-400/30 rounded-lg p-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    {appliedPromo.description}
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal</span>
                  <span>R{subtotal}</span>
                </div>
                
                {appliedPromo && appliedPromo.discount && (
                  <div className="flex justify-between text-green-400">
                    <span>Promo Discount</span>
                    <span>-R{promoDiscount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-gray-300">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-green-400">FREE</span>
                    ) : (
                      `R${shipping}`
                    )}
                  </span>
                </div>
                
                <div className="border-t border-white/20 pt-3">
                  <div className="flex justify-between text-xl font-bold text-white">
                    <span>Total</span>
                    <span>R{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-3 mb-6 text-xs text-gray-300">
                <div className="text-center">
                  <Shield className="h-6 w-6 mx-auto mb-1 text-green-400" />
                  <div>Secure Payment</div>
                </div>
                <div className="text-center">
                  <Truck className="h-6 w-6 mx-auto mb-1 text-blue-400" />
                  <div>Fast Delivery</div>
                </div>
                <div className="text-center">
                  <Heart className="h-6 w-6 mx-auto mb-1 text-red-400" />
                  <div>30-Day Returns</div>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={proceedToCheckout}
                disabled={isCheckingOut}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white py-3 rounded-lg font-bold transition-all duration-200 flex items-center justify-center gap-2"
              >
                {isCheckingOut ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5" />
                    Proceed to Checkout
                  </>
                )}
              </button>

              {/* Free Shipping Notice */}
              {subtotal < 500 && (
                <div className="mt-4 text-sm text-yellow-400 bg-yellow-500/10 border border-yellow-400/30 rounded-lg p-3">
                  💡 Add R{(500 - subtotal).toFixed(2)} more for FREE shipping!
                </div>
              )}

              {/* Payment Methods */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-400 mb-3">Secure payment with</p>
                <div className="flex justify-center items-center gap-3">
                  <div className="bg-white rounded px-3 py-1 text-black font-bold text-xs">YOCO</div>
                  <div className="bg-blue-600 rounded px-3 py-1 text-white font-bold text-xs">VISA</div>
                  <div className="bg-red-600 rounded px-3 py-1 text-white font-bold text-xs">MASTERCARD</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShoppingCartPage
