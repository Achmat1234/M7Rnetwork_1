import React, { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  DollarSign, 
  Activity,
  Eye,
  Crown,
  Shield,
  BarChart3,
  PieChart,
  Calendar,
  Download
} from 'lucide-react'

const Analytics = () => {
  const [timeframe, setTimeframe] = useState('7d')
  const [analyticsData, setAnalyticsData] = useState({
    totalUsers: 1247,
    activeUsers: 342,
    newUsersToday: 23,
    totalRevenue: 15420.50,
    totalOrders: 186,
    conversionRate: 3.2,
    platformHealth: 98.5,
    securityScore: 96.8
  })
  
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}')
    setUser(userData)
  }, [])

  if (user?.role !== 'owner') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center">
          <Crown className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Owner Access Required</h2>
          <p className="text-gray-300">Advanced analytics are only accessible to platform owners.</p>
        </div>
      </div>
    )
  }

  const metricCards = [
    {
      title: 'Total Users',
      value: analyticsData.totalUsers.toLocaleString(),
      change: '+12.5%',
      changeType: 'positive',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Active Users',
      value: analyticsData.activeUsers.toLocaleString(),
      change: '+8.2%',
      changeType: 'positive',
      icon: Activity,
      color: 'green'
    },
    {
      title: 'Total Revenue',
      value: `R${analyticsData.totalRevenue.toLocaleString()}`,
      change: '+23.1%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'yellow'
    },
    {
      title: 'Total Orders',
      value: analyticsData.totalOrders.toLocaleString(),
      change: '+15.7%',
      changeType: 'positive',
      icon: ShoppingBag,
      color: 'purple'
    },
    {
      title: 'Conversion Rate',
      value: `${analyticsData.conversionRate}%`,
      change: '+0.3%',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'indigo'
    },
    {
      title: 'Platform Health',
      value: `${analyticsData.platformHealth}%`,
      change: '+0.5%',
      changeType: 'positive',
      icon: Shield,
      color: 'emerald'
    }
  ]

  const getColorClasses = (color, type = 'bg') => {
    const colors = {
      blue: type === 'bg' ? 'bg-blue-500/20 text-blue-400 border-blue-400/30' : 'text-blue-400',
      green: type === 'bg' ? 'bg-green-500/20 text-green-400 border-green-400/30' : 'text-green-400',
      yellow: type === 'bg' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30' : 'text-yellow-400',
      purple: type === 'bg' ? 'bg-purple-500/20 text-purple-400 border-purple-400/30' : 'text-purple-400',
      indigo: type === 'bg' ? 'bg-indigo-500/20 text-indigo-400 border-indigo-400/30' : 'text-indigo-400',
      emerald: type === 'bg' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-400/30' : 'text-emerald-400'
    }
    return colors[color] || colors.blue
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <BarChart3 className="h-8 w-8 text-yellow-400" />
                <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
                <Crown className="h-6 w-6 text-yellow-400" />
              </div>
              <p className="text-gray-300">Comprehensive platform insights and performance metrics</p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Timeframe Selector */}
              <select 
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="24h" className="bg-gray-800">Last 24 Hours</option>
                <option value="7d" className="bg-gray-800">Last 7 Days</option>
                <option value="30d" className="bg-gray-800">Last 30 Days</option>
                <option value="90d" className="bg-gray-800">Last 90 Days</option>
              </select>

              <button className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-400/30 px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {metricCards.map((metric, index) => {
            const Icon = metric.icon
            return (
              <div key={index} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg border ${getColorClasses(metric.color)}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className={`text-sm font-semibold px-2 py-1 rounded ${
                    metric.changeType === 'positive' ? 'text-green-400 bg-green-400/20' : 'text-red-400 bg-red-400/20'
                  }`}>
                    {metric.change}
                  </span>
                </div>
                <h3 className="text-gray-400 text-sm font-medium mb-1">{metric.title}</h3>
                <p className="text-2xl font-bold text-white">{metric.value}</p>
              </div>
            )
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* User Growth Chart */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold text-lg">User Growth</h3>
              <TrendingUp className="h-5 w-5 text-green-400" />
            </div>
            <div className="h-64 flex items-end justify-between space-x-2">
              {[65, 78, 85, 92, 88, 95, 112].map((height, index) => (
                <div key={index} className="flex-1 bg-gradient-to-t from-blue-500/50 to-purple-500/50 rounded-t" style={{ height: `${height}%` }}></div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold text-lg">Revenue Breakdown</h3>
              <PieChart className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="space-y-4">
              {[
                { category: 'MaRk7Raw Fashion', percentage: 45, amount: 'R6,939', color: 'blue' },
                { category: 'Marketplace Commission', percentage: 30, amount: 'R4,626', color: 'purple' },
                { category: 'Premium Subscriptions', percentage: 15, amount: 'R2,313', color: 'yellow' },
                { category: 'Other Services', percentage: 10, amount: 'R1,542', color: 'green' }
              ].map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">{item.category}</span>
                    <span className="text-white font-semibold">{item.amount}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getColorClasses(item.color).includes('blue') ? 'bg-blue-500' : 
                        getColorClasses(item.color).includes('purple') ? 'bg-purple-500' :
                        getColorClasses(item.color).includes('yellow') ? 'bg-yellow-500' : 'bg-green-500'}`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-white font-semibold text-lg flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Real-time Activity
            </h3>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm">Live</span>
            </div>
          </div>
          
          <div className="space-y-4 max-h-64 overflow-y-auto">
            {[
              { action: 'New user registration', user: 'john_doe@email.com', time: '2 minutes ago', type: 'success' },
              { action: 'Product purchase', user: 'sarah_m', amount: 'R299', time: '5 minutes ago', type: 'revenue' },
              { action: 'Owner dashboard access', user: 'mark7raw', time: '8 minutes ago', type: 'admin' },
              { action: 'Failed login attempt blocked', user: '192.168.1.100', time: '12 minutes ago', type: 'security' },
              { action: 'New marketplace listing', user: 'vendor_123', time: '15 minutes ago', type: 'info' },
              { action: 'Password change', user: 'user_456', time: '18 minutes ago', type: 'security' },
              { action: 'AI Assistant query', user: 'tech_user', time: '22 minutes ago', type: 'info' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-white/10 last:border-b-0">
                <div className="flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full ${
                    activity.type === 'success' ? 'bg-green-400' :
                    activity.type === 'revenue' ? 'bg-yellow-400' :
                    activity.type === 'admin' ? 'bg-purple-400' :
                    activity.type === 'security' ? 'bg-red-400' : 'bg-blue-400'
                  }`}></div>
                  <div>
                    <p className="text-gray-300 text-sm">
                      {activity.action} {activity.amount && <span className="text-yellow-400 font-semibold">({activity.amount})</span>}
                    </p>
                    <p className="text-gray-500 text-xs">by {activity.user}</p>
                  </div>
                </div>
                <span className="text-gray-400 text-xs">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics
