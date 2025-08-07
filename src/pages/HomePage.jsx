import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { 
  Crown, 
  Users, 
  MessageCircle, 
  ShoppingBag, 
  Store, 
  Brain,
  Zap,
  Shield,
  Star,
  ArrowRight,
  CheckCircle
} from 'lucide-react'

const HomePage = () => {
  const { user, isOwner } = useAuth()

  const features = [
    {
      icon: Users,
      title: "Premium Networking",
      description: "Connect with like-minded creators, entrepreneurs, and innovators in our exclusive community."
    },
    {
      icon: Brain,
      title: "AI-Powered Tools",
      description: "Access cutting-edge AI tools for content creation, business automation, and growth strategies."
    },
    {
      icon: ShoppingBag,
      title: "Marketplace",
      description: "Buy and sell products, services, and digital assets in our integrated marketplace."
    },
    {
      icon: MessageCircle,
      title: "Real-time Chat",
      description: "WhatsApp-style messaging with file sharing, groups, and professional networking features."
    },
    {
      icon: Store,
      title: "MaRk7Raw Fashion",
      description: "Exclusive access to my premium fashion collection with special member discounts."
    },
    {
      icon: Crown,
      title: "Premium Experience",
      description: "6-star platform experience with premium features and owner-curated content."
    }
  ]

  const stats = [
    { number: "1000+", label: "Active Members" },
    { number: "50+", label: "AI Tools" },
    { number: "24/7", label: "Support" },
    { number: "100%", label: "Premium" }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-8">
              <Crown size={16} />
              <span>Premium Networking Platform</span>
              <Star size={16} />
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                M7RNetworking
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Join the exclusive community where creators, entrepreneurs, and innovators connect, 
              collaborate, and build the future together. Experience premium networking like never before.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              {user ? (
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/dashboard"
                    className="btn-primary flex items-center space-x-2 px-8 py-4 text-lg"
                  >
                    <span>Go to Dashboard</span>
                    <ArrowRight size={20} />
                  </Link>
                  {isOwner && (
                    <Link
                      to="/owner-dashboard"
                      className="btn-owner flex items-center space-x-2 px-8 py-4 text-lg"
                    >
                      <Crown size={20} />
                      <span>Owner Dashboard</span>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/register"
                    className="btn-primary flex items-center space-x-2 px-8 py-4 text-lg"
                  >
                    <span>Join M7RNetworking</span>
                    <ArrowRight size={20} />
                  </Link>
                  <Link
                    to="/login"
                    className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 font-semibold py-4 px-8 rounded-lg transition-all duration-200 flex items-center space-x-2"
                  >
                    <span>Sign In</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Hero Image/Visual */}
            <div className="relative max-w-4xl mx-auto">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 shadow-2xl">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">
                        {stat.number}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Premium Features
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Everything you need to grow your network, business, and personal brand in one premium platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div 
                  key={index} 
                  className="card hover:transform hover:scale-105 transition-all duration-300 group"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Icon size={24} className="text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* MaRk7Raw Fashion Spotlight */}
      <section className="py-20 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-gray-900 dark:to-yellow-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 bg-yellow-500 text-gray-900 px-4 py-2 rounded-full text-sm font-bold mb-6">
                <Crown size={16} />
                <span>Exclusive Collection</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                MaRk7Raw Fashion
              </h2>
              <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
                Discover my exclusive fashion collection featuring premium t-shirts and streetwear. 
                As a platform member, you get special access and discounts on all items.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <CheckCircle size={20} className="text-green-500" />
                  <span className="text-gray-700 dark:text-gray-300">Premium quality materials</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle size={20} className="text-green-500" />
                  <span className="text-gray-700 dark:text-gray-300">Exclusive designs</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle size={20} className="text-green-500" />
                  <span className="text-gray-700 dark:text-gray-300">Member discounts</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle size={20} className="text-green-500" />
                  <span className="text-gray-700 dark:text-gray-300">Fast shipping</span>
                </div>
              </div>
              <Link
                to="/store"
                className="btn-owner flex items-center space-x-2 px-8 py-4 text-lg inline-flex"
              >
                <Store size={20} />
                <span>Shop Collection</span>
                <ArrowRight size={20} />
              </Link>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-yellow-200 to-orange-200 dark:from-yellow-700 dark:to-orange-700 rounded-2xl p-8 transform rotate-3 shadow-xl">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 transform -rotate-3">
                  <div className="text-center">
                    <div className="w-32 h-32 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 rounded-lg mx-auto mb-4 flex items-center justify-center">
                      <span className="text-4xl">👕</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      MaRk7Raw Signature Tee
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Premium cotton blend with exclusive design
                    </p>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      R 299
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Join the Community?
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Experience premium networking, AI-powered tools, and exclusive access to MaRk7Raw Fashion. 
            Your journey to success starts here.
          </p>
          {!user && (
            <Link
              to="/register"
              className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-lg text-lg transition-all duration-200 transform hover:scale-105 inline-flex items-center space-x-2"
            >
              <span>Start Your Journey</span>
              <ArrowRight size={20} />
            </Link>
          )}
        </div>
      </section>
    </div>
  )
}

export default HomePage
