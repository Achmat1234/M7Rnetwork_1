import React, { useState } from 'react'
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  CreditCard,
  Lock,
  CheckCircle,
  ArrowLeft,
  Truck,
  Calendar
} from 'lucide-react'
import YocoPaymentService from '../../services/YocoPaymentService'

const YocoCheckout = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  
  const [billingInfo, setBillingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    province: '',
    postalCode: ''
  })

  const [shippingInfo, setShippingInfo] = useState({
    sameAsBilling: true,
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    province: '',
    postalCode: ''
  })

  const [paymentMethod, setPaymentMethod] = useState('card')

  // Sample order data
  const orderSummary = {
    items: [
      { name: "MaRk7Raw Classic Black Tee", size: "M", quantity: 2, price: 299 },
      { name: "MaRk7Raw Signature Logo Tee", size: "L", quantity: 1, price: 349 }
    ],
    subtotal: 947,
    shipping: 0,
    discount: 94.7,
    total: 852.3
  }

  const provinces = [
    'Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal', 
    'Limpopo', 'Mpumalanga', 'Northern Cape', 'North West', 'Western Cape'
  ]

  const handleBillingChange = (field, value) => {
    setBillingInfo(prev => ({ ...prev, [field]: value }))
  }

  const handleShippingChange = (field, value) => {
    setShippingInfo(prev => ({ ...prev, [field]: value }))
  }

  const processPayment = async () => {
    setIsProcessing(true)
    
    try {
      if (import.meta.env.DEV) {
        // Use test payment in development
        const result = await YocoPaymentService.testPayment(orderSummary.total)
        console.log('Test Payment Result:', result)
        
        // On success
        setOrderComplete(true)
        setCurrentStep(4)
      } else {
        // Use real YOCO payment in production
        const result = await YocoPaymentService.initializePayment(orderSummary.total, 'ZAR')
        console.log('YOCO Payment Result:', result)
        
        if (result.id) {
          // Process the payment token with your backend
          const paymentResult = await YocoPaymentService.processPayment({
            token: result.id,
            amount: orderSummary.total,
            currency: 'ZAR',
            billingInfo,
            shippingInfo: shippingInfo.sameAsBilling ? billingInfo : shippingInfo,
            orderItems: orderSummary.items
          })
          
          if (paymentResult.success) {
            setOrderComplete(true)
            setCurrentStep(4)
          } else {
            throw new Error('Payment processing failed')
          }
        }
      }
    } catch (error) {
      console.error('Payment failed:', error)
      alert(`Payment failed: ${error.message}. Please try again.`)
    } finally {
      setIsProcessing(false)
    }
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="max-w-md mx-auto px-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            
            <h1 className="text-2xl font-bold text-white mb-4">Order Complete!</h1>
            <p className="text-gray-300 mb-6">
              Thank you for your purchase. Your order #MR7-{Date.now().toString().slice(-6)} 
              has been confirmed and will be processed shortly.
            </p>
            
            <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 text-blue-400 text-sm">
                <Truck className="h-4 w-4" />
                <span>Estimated delivery: 3-5 business days</span>
              </div>
            </div>
            
            <button
              onClick={() => window.location.href = '/'}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold transition-all duration-200"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => window.history.back()}
            className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg transition-all duration-200"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-3xl font-bold text-white">Secure Checkout</h1>
          <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
            <Lock className="h-3 w-3" />
            SSL Secured
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  currentStep >= step 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white/10 text-gray-400'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-20 h-1 mx-4 ${
                    currentStep > step ? 'bg-blue-500' : 'bg-white/20'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between max-w-2xl mx-auto mt-2 text-sm text-gray-300">
            <span>Billing</span>
            <span>Shipping</span>
            <span>Payment</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {currentStep === 1 && (
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Billing Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="First Name"
                    value={billingInfo.firstName}
                    onChange={(e) => handleBillingChange('firstName', e.target.value)}
                    className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={billingInfo.lastName}
                    onChange={(e) => handleBillingChange('lastName', e.target.value)}
                    className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={billingInfo.email}
                    onChange={(e) => handleBillingChange('email', e.target.value)}
                    className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={billingInfo.phone}
                    onChange={(e) => handleBillingChange('phone', e.target.value)}
                    className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Street Address"
                    value={billingInfo.address}
                    onChange={(e) => handleBillingChange('address', e.target.value)}
                    className="md:col-span-2 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="City"
                    value={billingInfo.city}
                    onChange={(e) => handleBillingChange('city', e.target.value)}
                    className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <select
                    value={billingInfo.province}
                    onChange={(e) => handleBillingChange('province', e.target.value)}
                    className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="" className="bg-gray-800">Select Province</option>
                    {provinces.map(province => (
                      <option key={province} value={province} className="bg-gray-800">
                        {province}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Postal Code"
                    value={billingInfo.postalCode}
                    onChange={(e) => handleBillingChange('postalCode', e.target.value)}
                    className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  onClick={() => setCurrentStep(2)}
                  className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold transition-all duration-200"
                >
                  Continue to Shipping
                </button>
              </div>
            )}

            {currentStep === 2 && (
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Shipping Information
                </h2>
                
                <label className="flex items-center gap-3 mb-6 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={shippingInfo.sameAsBilling}
                    onChange={(e) => handleShippingChange('sameAsBilling', e.target.checked)}
                    className="w-4 h-4 text-blue-500 bg-white/10 border-white/20 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-300">Same as billing address</span>
                </label>

                {!shippingInfo.sameAsBilling && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <input
                      type="text"
                      placeholder="First Name"
                      value={shippingInfo.firstName}
                      onChange={(e) => handleShippingChange('firstName', e.target.value)}
                      className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Last Name"
                      value={shippingInfo.lastName}
                      onChange={(e) => handleShippingChange('lastName', e.target.value)}
                      className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Street Address"
                      value={shippingInfo.address}
                      onChange={(e) => handleShippingChange('address', e.target.value)}
                      className="md:col-span-2 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="City"
                      value={shippingInfo.city}
                      onChange={(e) => handleShippingChange('city', e.target.value)}
                      className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <select
                      value={shippingInfo.province}
                      onChange={(e) => handleShippingChange('province', e.target.value)}
                      className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="" className="bg-gray-800">Select Province</option>
                      {provinces.map(province => (
                        <option key={province} value={province} className="bg-gray-800">
                          {province}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="Postal Code"
                      value={shippingInfo.postalCode}
                      onChange={(e) => handleShippingChange('postalCode', e.target.value)}
                      className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                {/* Shipping Options */}
                <div className="space-y-3 mb-6">
                  <h3 className="text-lg font-semibold text-white">Shipping Options</h3>
                  <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-white">Standard Delivery</div>
                        <div className="text-sm text-gray-300">3-5 business days</div>
                      </div>
                      <div className="text-green-400 font-semibold">FREE</div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 rounded-lg font-semibold transition-all duration-200"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold transition-all duration-200"
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </h2>
                
                <div className="space-y-4 mb-6">
                  <label className="flex items-center gap-3 p-4 bg-white/10 border border-white/20 rounded-lg cursor-pointer hover:bg-white/20 transition-all duration-200">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-blue-500"
                    />
                    <CreditCard className="h-5 w-5 text-gray-300" />
                    <div>
                      <div className="text-white font-semibold">Credit/Debit Card</div>
                      <div className="text-gray-300 text-sm">Visa, Mastercard, American Express</div>
                    </div>
                  </label>
                </div>

                {/* YOCO Payment Form */}
                <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-400/30 rounded-lg p-6 mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Lock className="h-4 w-4 text-green-400" />
                    <span className="text-sm text-gray-300">Powered by YOCO - Secure Payment Processing</span>
                  </div>
                  
                  <div className="text-sm text-gray-400 mb-4">
                    Your payment will be processed securely through YOCO's payment gateway.
                    All card details are encrypted and never stored on our servers.
                  </div>

                  <div className="flex justify-center items-center gap-3 mb-4">
                    <div className="bg-white rounded px-3 py-1 text-black font-bold text-sm">YOCO</div>
                    <div className="bg-blue-600 rounded px-3 py-1 text-white font-bold text-xs">VISA</div>
                    <div className="bg-red-600 rounded px-3 py-1 text-white font-bold text-xs">MASTERCARD</div>
                    <div className="bg-green-600 rounded px-3 py-1 text-white font-bold text-xs">AMEX</div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 rounded-lg font-semibold transition-all duration-200"
                  >
                    Back
                  </button>
                  <button
                    onClick={processPayment}
                    disabled={isProcessing}
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-600 disabled:to-gray-700 text-white py-3 rounded-lg font-bold transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4" />
                        Complete Payment - R{orderSummary.total}
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 sticky top-6">
              <h3 className="text-lg font-bold text-white mb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-4">
                {orderSummary.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <div className="text-gray-300">
                      {item.name} (Size: {item.size}) × {item.quantity}
                    </div>
                    <div className="text-white">R{item.price * item.quantity}</div>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/20 pt-4 space-y-2">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal</span>
                  <span>R{orderSummary.subtotal}</span>
                </div>
                <div className="flex justify-between text-green-400">
                  <span>Discount</span>
                  <span>-R{orderSummary.discount}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Shipping</span>
                  <span>{orderSummary.shipping === 0 ? 'FREE' : `R${orderSummary.shipping}`}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-white border-t border-white/20 pt-2">
                  <span>Total</span>
                  <span>R{orderSummary.total}</span>
                </div>
              </div>

              <div className="mt-6 space-y-3 text-xs text-gray-400">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>30-day return policy</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-blue-400" />
                  <span>Free shipping nationwide</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-green-400" />
                  <span>SSL secured checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default YocoCheckout
