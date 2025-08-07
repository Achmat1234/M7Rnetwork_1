// YOCO Payment Service
const YOCO_PUBLIC_KEY = import.meta.env.VITE_YOCO_PUBLIC_KEY || 'pk_test_ed3c54a6gOol69qa7f45'

class YocoPaymentService {
  constructor() {
    this.baseURL = 'https://online.yoco.com/v1'
    this.isLoaded = false
    this.loadYocoScript()
  }

  loadYocoScript() {
    return new Promise((resolve, reject) => {
      if (window.YocoSDK) {
        this.isLoaded = true
        resolve(window.YocoSDK)
        return
      }

      const script = document.createElement('script')
      script.src = 'https://js.yoco.com/sdk/v1/yoco-sdk-web.js'
      script.onload = () => {
        this.isLoaded = true
        resolve(window.YocoSDK)
      }
      script.onerror = reject
      document.head.appendChild(script)
    })
  }

  async initializePayment(amount, currency = 'ZAR') {
    try {
      await this.loadYocoScript()
      
      const yoco = new window.YocoSDK({
        publicKey: YOCO_PUBLIC_KEY
      })

      return new Promise((resolve, reject) => {
        yoco.showPopup({
          amountInCents: Math.round(amount * 100), // Convert to cents
          currency: currency,
          name: 'MaRk7Raw Fashion',
          description: 'Fashion Purchase',
          image: '/favicon.ico',
          callback: function(result) {
            if (result.error) {
              console.error('YOCO Error:', result.error)
              reject(result.error)
            } else {
              console.log('YOCO Success:', result)
              resolve(result)
            }
          }
        })
      })
    } catch (error) {
      console.error('YOCO Initialization Error:', error)
      throw error
    }
  }

  async processPayment(paymentData) {
    try {
      // This would typically go to your backend
      const response = await fetch('/api/payments/yoco', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(paymentData)
      })

      if (!response.ok) {
        throw new Error('Payment processing failed')
      }

      return await response.json()
    } catch (error) {
      console.error('Payment Processing Error:', error)
      throw error
    }
  }

  // Get payment methods
  getPaymentMethods() {
    return [
      {
        id: 'card',
        name: 'Credit/Debit Card',
        types: ['Visa', 'Mastercard', 'American Express'],
        icon: '💳'
      }
    ]
  }

  // Validate card details (basic validation)
  validateCard(cardNumber, expiryMonth, expiryYear, cvv) {
    const errors = {}

    // Basic card number validation
    if (!cardNumber || cardNumber.length < 13 || cardNumber.length > 19) {
      errors.cardNumber = 'Invalid card number'
    }

    // Expiry validation
    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth() + 1

    if (!expiryMonth || expiryMonth < 1 || expiryMonth > 12) {
      errors.expiryMonth = 'Invalid expiry month'
    }

    if (!expiryYear || expiryYear < currentYear || 
        (expiryYear === currentYear && expiryMonth < currentMonth)) {
      errors.expiryYear = 'Card has expired'
    }

    // CVV validation
    if (!cvv || cvv.length < 3 || cvv.length > 4) {
      errors.cvv = 'Invalid CVV'
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  }

  // Format card number for display
  formatCardNumber(value) {
    // Remove all non-digit characters
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    
    // Add space every 4 digits
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    
    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  // Get card type from number
  getCardType(number) {
    const patterns = {
      visa: /^4/,
      mastercard: /^5[1-5]/,
      amex: /^3[47]/,
      discover: /^6(?:011|5)/
    }

    for (const [type, pattern] of Object.entries(patterns)) {
      if (pattern.test(number)) {
        return type
      }
    }

    return 'unknown'
  }

  // Calculate processing fee
  calculateProcessingFee(amount) {
    // YOCO's standard fees (these may vary)
    const fixedFee = 0 // No fixed fee for online payments
    const percentageFee = 0.029 // 2.9% + VAT
    const vat = 0.15 // 15% VAT
    
    const baseFee = amount * percentageFee
    const totalFee = baseFee + (baseFee * vat)
    
    return Math.round(totalFee * 100) / 100 // Round to 2 decimal places
  }

  // Test payment for development
  async testPayment(amount) {
    console.log('🧪 Test Payment Mode - Amount:', amount)
    
    // Simulate payment processing
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          transactionId: `test_${Date.now()}`,
          amount: amount,
          currency: 'ZAR',
          timestamp: new Date().toISOString()
        })
      }, 2000)
    })
  }

  // Payment history
  async getPaymentHistory() {
    try {
      const response = await fetch('/api/payments/history', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch payment history')
      }

      return await response.json()
    } catch (error) {
      console.error('Payment History Error:', error)
      return []
    }
  }
}

export default new YocoPaymentService()
