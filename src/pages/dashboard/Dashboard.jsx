import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import ChangePasswordForm from '../../components/ChangePasswordForm'
import { 
  User, 
  MessageCircle, 
  ShoppingBag, 
  Store, 
  Brain,
  TrendingUp,
  Calendar,
  Bell,
  Star,
  Crown,
  Zap,
  Activity,
  DollarSign,
  Users,
  Package,
  Heart,
  ArrowRight
} from 'lucide-react'

const Dashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalSpent: 1250,
    ordersCount: 8,
    aiToolsUsed: 15,
    networkConnections: 42
  })

  const quickActions = [
    {
      icon: Brain,
      title: "AI Assistant",
      description: "Smart AI-powered help",
      link: "/ai-assistant",
      color: "from-indigo-500 to-purple-600"
    },
    {
      icon: MessageCircle,
      title: "Start Chat",
      description: "Connect with community",
      link: "/chat",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Store,
      title: "Shop MaRk7Raw",
      description: "Latest fashion drops",
      link: "/store",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: ShoppingBag,
      title: "Marketplace",
      description: "Buy & sell products",
      link: "/marketplace",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Brain,
      title: "AI Tools",
      description: "Boost productivity",
      link: "/tools",
      color: "from-green-500 to-green-600"
    }
  ]

  const recentActivity = [
    {
      icon: Package,
      title: "Order Shipped",
      description: "MaRk7Raw Signature Tee is on its way",
      time: "2 hours ago",
      type: "order"
    },
    {
      icon: Users,
      title: "New Connection",
      description: "Sarah Johnson joined your network",
      time: "5 hours ago",
      type: "network"
    },
    {
      icon: Brain,
      title: "AI Tool Used",
      description: "Content Generator - Blog post created",
      time: "1 day ago",
      type: "ai"
    },
    {
      icon: Heart,
      title: "Product Liked",
      description: "You liked 'Premium Hoodie Collection'",
      time: "2 days ago",
      type: "social"
    }
  ]

  const achievements = [
    { title: "Early Adopter", icon: "🚀", unlocked: true },
    { title: "Social Butterfly", icon: "🦋", unlocked: true },
    { title: "AI Pioneer", icon: "🤖", unlocked: false },
    { title: "Fashion Forward", icon: "👕", unlocked: true },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  Welcome back, {user?.name || 'Member'}! 👋
                </h1>
                <p className="text-blue-100 text-lg">
                  Your premium M7RNetworking experience awaits
                </p>
              </div>
              <div className="hidden md:flex items-center space-x-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold">#{user?.id || '001'}</div>
                  <div className="text-sm text-blue-100">Member ID</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  R {stats.totalSpent.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <DollarSign size={24} className="text-white" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Orders</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.ordersCount}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Package size={24} className="text-white" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">AI Tools Used</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.aiToolsUsed}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain size={24} className="text-white" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Network</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.networkConnections}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg flex items-center justify-center">
                <Users size={24} className="text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action, index) => {
                  const Icon = action.icon
                  return (
                    <Link
                      key={index}
                      to={action.link}
                      className="group p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-transparent hover:shadow-lg transition-all duration-200 hover:transform hover:scale-105"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                          <Icon size={24} className="text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {action.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {action.description}
                          </p>
                        </div>
                        <ArrowRight size={16} className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card mt-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Recent Activity
              </h2>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => {
                  const Icon = activity.icon
                  return (
                    <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200">
                      <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        <Icon size={20} className="text-gray-600 dark:text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {activity.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {activity.description}
                        </p>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-500">
                        {activity.time}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Achievements */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Achievements
              </h2>
              <div className="space-y-3">
                {achievements.map((achievement, index) => (
                  <div 
                    key={index} 
                    className={`flex items-center space-x-3 p-3 rounded-lg ${
                      achievement.unlocked 
                        ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
                        : 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <div className={`font-medium ${
                        achievement.unlocked 
                          ? 'text-green-800 dark:text-green-300' 
                          : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        {achievement.title}
                      </div>
                    </div>
                    {achievement.unlocked && (
                      <Star size={16} className="text-green-500" fill="currentColor" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Account Security */}
            <div className="mb-6">
              <ChangePasswordForm isOwner={false} title="Account Security" />
            </div>

            {/* Member Status */}
            <div className="card bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Crown size={24} className="text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Premium Member
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Enjoying all exclusive benefits
                </p>
                <div className="bg-yellow-100 dark:bg-yellow-900/40 rounded-lg p-3">
                  <div className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                    Member since: {new Date().getFullYear() - 1}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
