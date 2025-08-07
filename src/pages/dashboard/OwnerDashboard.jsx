import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-hot-toast'
import ChangePasswordForm from '../../components/ChangePasswordForm'
import { 
  Crown, 
  TrendingUp,
  DollarSign,
  Users,
  Package,
  ShoppingBag,
  MessageSquare,
  Brain,
  Settings,
  BarChart3,
  Star,
  Zap,
  Target,
  Globe,
  Calendar,
  ArrowUp,
  ArrowDown,
  Activity,
  Bell,
  RefreshCw,
  Shield,
  Store,
  User
} from 'lucide-react'

const OwnerDashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [timeframe, setTimeframe] = useState('30d')
  const [isLoading, setIsLoading] = useState(false)
  const [realTimeData, setRealTimeData] = useState({
    activeUsers: 0,
    revenue: 0,
    orders: 0,
    messages: 0
  })
  
  // Real-time metrics with localStorage persistence
  const [metrics, setMetrics] = useState(() => {
    const saved = localStorage.getItem('m7r_owner_metrics')
    return saved ? JSON.parse(saved) : {
      revenue: {
        current: 15750,
        previous: 12300,
        change: 28.0,
        daily: [450, 520, 380, 650, 720, 590, 840],
        monthly: 47250
      },
      orders: {
        current: 124,
        previous: 98,
        change: 26.5,
        daily: [12, 15, 8, 20, 18, 14, 25],
        processing: 8,
        completed: 116
      },
      users: {
        current: 1247,
        previous: 1180,
        change: 5.7,
        online: 89,
        newToday: 23,
        premium: 245
      },
      conversion: {
        current: 3.2,
        previous: 2.8,
        change: 14.3
      },
      engagement: {
        current: 78.5,
        previous: 72.1,
        change: 8.9,
        chatMessages: 1520,
        aiInteractions: 856
      }
    }
  })

  // Real-time data simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        activeUsers: Math.floor(Math.random() * 20) + 80,
        revenue: prev.revenue + Math.floor(Math.random() * 100),
        orders: prev.orders + Math.floor(Math.random() * 3),
        messages: prev.messages + Math.floor(Math.random() * 5)
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Save metrics to localStorage
  useEffect(() => {
    localStorage.setItem('m7r_owner_metrics', JSON.stringify(metrics))
  }, [metrics])

  // Platform management actions
  const handleUserManagement = () => {
    navigate('/admin/users')
    toast.success('Opening user management...')
  }

  const handleContentModeration = () => {
    navigate('/admin/moderation')
    toast.success('Opening content moderation...')
  }

  const handleSystemSettings = () => {
    navigate('/admin/settings')
    toast.success('Opening system settings...')
  }

  const handleBackup = async () => {
    setIsLoading(true)
    try {
      // Simulate backup process
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success('System backup completed successfully!')
    } catch (error) {
      toast.error('Backup failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmergencyBroadcast = () => {
    const message = prompt('Enter emergency message to broadcast to all users:')
    if (message) {
      toast.success(`Emergency broadcast sent: "${message}"`)
      // In real app, this would send to all connected users via WebSocket
    }
  }

  const refreshMetrics = async () => {
    setIsLoading(true)
    try {
      // Simulate API call to refresh data
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Update metrics with slight variations
      setMetrics(prev => ({
        ...prev,
        revenue: {
          ...prev.revenue,
          current: prev.revenue.current + Math.floor(Math.random() * 1000),
          change: (Math.random() * 40 - 20) // -20% to +20%
        },
        orders: {
          ...prev.orders,
          current: prev.orders.current + Math.floor(Math.random() * 10),
          change: (Math.random() * 30 - 15)
        },
        users: {
          ...prev.users,
          current: prev.users.current + Math.floor(Math.random() * 50),
          online: Math.floor(Math.random() * 30) + 70,
          newToday: Math.floor(Math.random() * 20) + 10
        }
      }))
      
      toast.success('Metrics refreshed successfully!')
    } catch (error) {
      toast.error('Failed to refresh metrics')
    } finally {
      setIsLoading(false)
    }
  }

  const recentOrders = [
    { id: '#M001', customer: 'Sarah Johnson', amount: 299, status: 'completed', product: 'Signature Tee' },
    { id: '#M002', customer: 'Mike Chen', amount: 149, status: 'processing', product: 'Basic Hoodie' },
    { id: '#M003', customer: 'Emma Wilson', amount: 199, status: 'shipped', product: 'Premium Cap' },
    { id: '#M004', customer: 'David Brown', amount: 399, status: 'completed', product: 'Deluxe Pack' },
  ]

  const topProducts = [
    { name: 'MaRk7Raw Signature Tee', sales: 45, revenue: 13455 },
    { name: 'Premium Hoodie Black', sales: 23, revenue: 6900 },
    { name: 'Exclusive Cap Collection', sales: 18, revenue: 3582 },
    { name: 'Limited Edition Pack', sales: 12, revenue: 4788 },
  ]

  const adminActions = [
    {
      icon: User,
      title: "User Dashboard",
      description: "Access your personal user dashboard",
      link: "/dashboard",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Brain,
      title: "AI Assistant",
      description: "Advanced AI-powered business insights",
      link: "/ai-assistant",
      color: "from-indigo-500 to-purple-600"
    },
    {
      icon: Store,
      title: "Product Management",
      description: "Manage MaRk7Raw Fashion store products",
      link: "/product-management",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Shield,
      title: "Security Center",
      description: "Platform security and protection",
      link: "/security-dashboard",
      color: "from-red-500 to-red-600"
    },
    {
      icon: Activity,
      title: "Analytics",
      description: "Business insights and reports",
      link: "/analytics",
      color: "from-green-500 to-green-600"
    },
    {
      icon: Users,
      title: "User Management",
      description: "View and manage platform users",
      link: "/admin/users",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Settings,
      title: "Platform Settings",
      description: "Configure platform features",
      link: "/admin/settings",
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: Package,
      title: "Inventory Control",
      description: "Stock management and tracking",
      link: "/admin/inventory",
      color: "from-indigo-500 to-indigo-600"
    }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
      case 'processing': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
      case 'shipped': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 dark:from-gray-900 dark:via-yellow-900/10 dark:to-orange-900/10 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Crown Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4">
              <div className="w-32 h-32 bg-white/10 rounded-full"></div>
            </div>
            <div className="absolute bottom-0 left-0 transform -translate-x-4 translate-y-4">
              <div className="w-24 h-24 bg-white/10 rounded-full"></div>
            </div>
            <div className="relative">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <Crown size={32} className="text-white" />
                    </div>
                    <div>
                      <h1 className="text-4xl md:text-5xl font-bold">
                        Owner 6⭐ Dashboard
                      </h1>
                      <p className="text-yellow-100 text-lg">
                        Supreme platform control center
                      </p>
                    </div>
                  </div>
                  <p className="text-yellow-100 text-xl">
                    Welcome back, {user?.name || 'Mark'}! Your empire awaits your command. 👑
                  </p>
                </div>
                <div className="hidden lg:block text-right">
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                    <div className="text-3xl font-bold">R {metrics.revenue.current.toLocaleString()}</div>
                    <div className="text-yellow-100">This Month</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 dark:text-green-400 font-medium">Revenue</p>
                <p className="text-3xl font-bold text-green-800 dark:text-green-300">
                  R {metrics.revenue.current.toLocaleString()}
                </p>
                <div className="flex items-center mt-2 text-sm">
                  <ArrowUp size={16} className="text-green-500 mr-1" />
                  <span className="text-green-600 dark:text-green-400 font-medium">
                    +{metrics.revenue.change}%
                  </span>
                  <span className="text-gray-600 dark:text-gray-400 ml-1">vs last month</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <DollarSign size={24} className="text-white" />
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Orders</p>
                <p className="text-3xl font-bold text-blue-800 dark:text-blue-300">
                  {metrics.orders.current}
                </p>
                <div className="flex items-center mt-2 text-sm">
                  <ArrowUp size={16} className="text-blue-500 mr-1" />
                  <span className="text-blue-600 dark:text-blue-400 font-medium">
                    +{metrics.orders.change}%
                  </span>
                  <span className="text-gray-600 dark:text-gray-400 ml-1">vs last month</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Package size={24} className="text-white" />
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Users</p>
                <p className="text-3xl font-bold text-purple-800 dark:text-purple-300">
                  {metrics.users.current.toLocaleString()}
                </p>
                <div className="flex items-center mt-2 text-sm">
                  <ArrowUp size={16} className="text-purple-500 mr-1" />
                  <span className="text-purple-600 dark:text-purple-400 font-medium">
                    +{metrics.users.change}%
                  </span>
                  <span className="text-gray-600 dark:text-gray-400 ml-1">vs last month</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Users size={24} className="text-white" />
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200 dark:border-orange-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">Conversion</p>
                <p className="text-3xl font-bold text-orange-800 dark:text-orange-300">
                  {metrics.conversion.current}%
                </p>
                <div className="flex items-center mt-2 text-sm">
                  <ArrowUp size={16} className="text-orange-500 mr-1" />
                  <span className="text-orange-600 dark:text-orange-400 font-medium">
                    +{metrics.conversion.change}%
                  </span>
                  <span className="text-gray-600 dark:text-gray-400 ml-1">vs last month</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <Target size={24} className="text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Real-Time Admin Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="card bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-red-200 dark:border-red-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-red-800 dark:text-red-300">System Controls</h3>
              <Shield size={20} className="text-red-600" />
            </div>
            <div className="space-y-3">
              <button 
                onClick={refreshMetrics}
                disabled={isLoading}
                className="w-full btn-secondary flex items-center justify-center space-x-2"
              >
                <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
                <span>{isLoading ? 'Refreshing...' : 'Refresh Data'}</span>
              </button>
              <button 
                onClick={handleBackup}
                disabled={isLoading}
                className="w-full btn-primary flex items-center justify-center space-x-2"
              >
                <Activity size={16} />
                <span>Backup System</span>
              </button>
              <button 
                onClick={handleEmergencyBroadcast}
                className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors"
              >
                <Bell size={16} />
                <span>Emergency Broadcast</span>
              </button>
            </div>
          </div>

          <div className="card bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300">Real-Time Data</h3>
              <Activity size={20} className="text-blue-600" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Active Users</span>
                <span className="font-semibold text-blue-600">{realTimeData.activeUsers + metrics.users.online}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Revenue Today</span>
                <span className="font-semibold text-green-600">R {(realTimeData.revenue + 5420).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">New Orders</span>
                <span className="font-semibold text-purple-600">{realTimeData.orders + 12}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Messages Today</span>
                <span className="font-semibold text-orange-600">{realTimeData.messages + 347}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Management Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <button 
            onClick={handleUserManagement}
            className="card hover:shadow-lg transition-all duration-300 cursor-pointer bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <Users size={24} className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-green-800 dark:text-green-300">User Management</h3>
                <p className="text-sm text-green-600 dark:text-green-400">Manage all platform users</p>
              </div>
            </div>
          </button>

          <button 
            onClick={handleContentModeration}
            className="card hover:shadow-lg transition-all duration-300 cursor-pointer bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 border-purple-200 dark:border-purple-800"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl flex items-center justify-center">
                <MessageSquare size={24} className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-purple-800 dark:text-purple-300">Content Moderation</h3>
                <p className="text-sm text-purple-600 dark:text-purple-400">Review and moderate content</p>
              </div>
            </div>
          </button>

          <button 
            onClick={handleSystemSettings}
            className="card hover:shadow-lg transition-all duration-300 cursor-pointer bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20 border-gray-200 dark:border-gray-800"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-gray-500 to-slate-500 rounded-xl flex items-center justify-center">
                <Settings size={24} className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-300">System Settings</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Configure platform settings</p>
              </div>
            </div>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Admin Actions */}
          <div className="lg:col-span-2">
            <div className="card mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <Zap size={24} className="text-yellow-500 mr-2" />
                Admin Controls
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {adminActions.map((action, index) => {
                  const Icon = action.icon
                  return (
                    <Link
                      key={index}
                      to={action.link}
                      className="group p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-transparent hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-14 h-14 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-lg`}>
                          <Icon size={28} className="text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                            {action.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400">
                            {action.description}
                          </p>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Owner Security Section */}
            <div className="card mb-8">
              <ChangePasswordForm isOwner={true} title="Owner Security Settings" />
            </div>

            {/* Recent Orders */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Recent Orders
                </h2>
                <Link 
                  to="/admin/orders" 
                  className="text-yellow-600 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300 font-medium"
                >
                  View All
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 text-sm font-medium text-gray-600 dark:text-gray-400">Order</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600 dark:text-gray-400">Customer</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600 dark:text-gray-400">Product</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600 dark:text-gray-400">Amount</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600 dark:text-gray-400">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order, index) => (
                      <tr key={index} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="py-4 font-medium text-gray-900 dark:text-white">{order.id}</td>
                        <td className="py-4 text-gray-600 dark:text-gray-400">{order.customer}</td>
                        <td className="py-4 text-gray-600 dark:text-gray-400">{order.product}</td>
                        <td className="py-4 font-medium text-gray-900 dark:text-white">R {order.amount}</td>
                        <td className="py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Top Products */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Top Products
              </h2>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-white text-sm">
                        {product.name}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {product.sales} sales
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600 dark:text-green-400">
                        R {product.revenue.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Owner Status */}
            <div className="card bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 text-white">
              <div className="text-center">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                  <Crown size={32} className="text-white" />
                </div>
                <h3 className="font-bold text-xl mb-2">
                  Platform Owner
                </h3>
                <p className="text-yellow-100 mb-4">
                  Supreme access to all features
                </p>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                  <div className="text-sm font-medium">
                    All systems operational ✨
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="card">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Active Users</span>
                  <span className="font-medium text-gray-900 dark:text-white">892</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Pending Orders</span>
                  <span className="font-medium text-orange-600 dark:text-orange-400">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Support Tickets</span>
                  <span className="font-medium text-blue-600 dark:text-blue-400">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Server Health</span>
                  <span className="font-medium text-green-600 dark:text-green-400">98.9%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OwnerDashboard
