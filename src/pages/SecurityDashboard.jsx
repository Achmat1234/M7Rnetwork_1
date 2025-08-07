import React, { useState, useEffect } from 'react'
import { Shield, Eye, AlertTriangle, Activity, Users, Lock, Clock } from 'lucide-react'

const SecurityDashboard = () => {
  const [securityStats, setSecurityStats] = useState({
    totalRequests: 0,
    blockedRequests: 0,
    activeUsers: 0,
    threatLevel: 'LOW',
    lastIncident: null,
    rateLimitHits: 0
  })

  const [recentActivity, setRecentActivity] = useState([])
  const [isOwner, setIsOwner] = useState(false)

  useEffect(() => {
    // Check if user is owner
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    setIsOwner(user.role === 'owner')

    // Simulate real-time security monitoring
    const interval = setInterval(() => {
      setSecurityStats(prev => ({
        ...prev,
        totalRequests: prev.totalRequests + Math.floor(Math.random() * 5),
        activeUsers: 25 + Math.floor(Math.random() * 10),
        rateLimitHits: prev.rateLimitHits + (Math.random() > 0.8 ? 1 : 0)
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  if (!isOwner) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center">
          <Shield className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Owner Access Required</h2>
          <p className="text-gray-300">This security dashboard is only accessible to platform owners.</p>
        </div>
      </div>
    )
  }

  const getThreatLevelColor = (level) => {
    switch (level) {
      case 'LOW': return 'text-green-400 bg-green-400/20'
      case 'MEDIUM': return 'text-yellow-400 bg-yellow-400/20'
      case 'HIGH': return 'text-red-400 bg-red-400/20'
      default: return 'text-gray-400 bg-gray-400/20'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8 text-yellow-400" />
            <h1 className="text-3xl font-bold text-white">
              M7R Security Command Center
            </h1>
            <span className="text-yellow-400">👑</span>
          </div>
          <p className="text-gray-300">Real-time platform security monitoring and threat detection</p>
        </div>

        {/* Security Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <Activity className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold text-white">{securityStats.totalRequests}</span>
            </div>
            <h3 className="text-white font-semibold">Total Requests</h3>
            <p className="text-gray-400 text-sm">Last 24 hours</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <AlertTriangle className="h-8 w-8 text-red-400" />
              <span className="text-2xl font-bold text-white">{securityStats.blockedRequests}</span>
            </div>
            <h3 className="text-white font-semibold">Blocked Threats</h3>
            <p className="text-gray-400 text-sm">Security incidents prevented</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <Users className="h-8 w-8 text-green-400" />
              <span className="text-2xl font-bold text-white">{securityStats.activeUsers}</span>
            </div>
            <h3 className="text-white font-semibold">Active Users</h3>
            <p className="text-gray-400 text-sm">Currently online</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <Lock className="h-8 w-8 text-purple-400" />
              <span className="text-2xl font-bold text-white">{securityStats.rateLimitHits}</span>
            </div>
            <h3 className="text-white font-semibold">Rate Limit Hits</h3>
            <p className="text-gray-400 text-sm">Requests throttled</p>
          </div>
        </div>

        {/* Threat Level Indicator */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="h-4 w-4 bg-green-400 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 h-4 w-4 bg-green-400 rounded-full animate-ping opacity-75"></div>
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">Platform Security Status</h3>
                <p className="text-gray-400">All systems operational</p>
              </div>
            </div>
            <div className={`px-4 py-2 rounded-full font-semibold ${getThreatLevelColor(securityStats.threatLevel)}`}>
              {securityStats.threatLevel} THREAT
            </div>
          </div>
        </div>

        {/* Security Features Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Active Security Features
            </h3>
            <div className="space-y-3">
              {[
                { name: 'Rate Limiting', status: 'Active', color: 'green' },
                { name: 'DDoS Protection', status: 'Active', color: 'green' },
                { name: 'XSS Prevention', status: 'Active', color: 'green' },
                { name: 'Input Validation', status: 'Active', color: 'green' },
                { name: 'Owner Protection', status: 'Enhanced', color: 'yellow' },
                { name: 'Security Headers', status: 'Active', color: 'green' }
              ].map((feature, index) => (
                <div key={index} className="flex items-center justify-between py-2">
                  <span className="text-gray-300">{feature.name}</span>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    feature.color === 'green' ? 'bg-green-400/20 text-green-400' : 
                    'bg-yellow-400/20 text-yellow-400'
                  }`}>
                    {feature.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Security Events
            </h3>
            <div className="space-y-3">
              {[
                { event: 'Owner login detected', time: '2 minutes ago', type: 'info' },
                { event: 'Rate limit applied to IP 192.168.1.100', time: '5 minutes ago', type: 'warning' },
                { event: 'Password change request', time: '8 minutes ago', type: 'info' },
                { event: 'Security scan completed', time: '15 minutes ago', type: 'success' },
                { event: 'Failed login attempt blocked', time: '23 minutes ago', type: 'warning' }
              ].map((event, index) => (
                <div key={index} className="flex items-start gap-3 py-2">
                  <div className={`h-2 w-2 rounded-full mt-2 ${
                    event.type === 'success' ? 'bg-green-400' :
                    event.type === 'warning' ? 'bg-yellow-400' :
                    event.type === 'error' ? 'bg-red-400' : 'bg-blue-400'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-gray-300 text-sm">{event.event}</p>
                    <p className="text-gray-500 text-xs">{event.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h3 className="text-white font-semibold text-lg mb-4">Security Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-400/30 px-4 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2">
              <Eye className="h-4 w-4" />
              View Audit Logs
            </button>
            <button className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border border-purple-400/30 px-4 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Update Security Rules
            </button>
            <button className="bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 border border-yellow-400/30 px-4 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Run Security Scan
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SecurityDashboard
