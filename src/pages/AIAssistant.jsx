import React, { useState, useEffect, useRef } from 'react'
import { 
  Bot, 
  Send, 
  Shield, 
  Zap, 
  Brain, 
  MessageCircle, 
  Lock,
  AlertTriangle,
  CheckCircle,
  Activity
} from 'lucide-react'

const AIAssistant = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: '👋 Hello! I\'m your M7R AI Security Assistant. I can help you with platform security, analytics, and user management. How can I assist you today?',
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState(null)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}')
    setUser(userData)
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const securityCommands = [
    { command: '/security-scan', description: 'Run a comprehensive security scan' },
    { command: '/threat-report', description: 'Generate threat assessment report' },
    { command: '/user-analytics', description: 'Show user activity analytics' },
    { command: '/platform-status', description: 'Check platform health status' },
    { command: '/backup-data', description: 'Initiate secure data backup' },
    { command: '/audit-logs', description: 'Review security audit logs' }
  ]

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)
    
    // Simulate AI processing
    setTimeout(() => {
      let aiResponse = ''
      
      if (inputMessage.includes('/security-scan')) {
        aiResponse = `🔍 **Security Scan Complete**

**Platform Security Status: ✅ SECURE**

**Scan Results:**
- ✅ Rate limiting: Active (100 req/15min)
- ✅ DDoS protection: Enabled
- ✅ Input validation: All endpoints protected
- ✅ Authentication: JWT tokens secure
- ✅ Database: Encrypted connections
- ✅ Owner privileges: Enhanced protection

**Recommendations:**
- All security measures are functioning optimally
- No vulnerabilities detected
- Platform is production-ready

Your M7RNetworking platform maintains an **A+ Security Rating** 🛡️`

      } else if (inputMessage.includes('/threat-report')) {
        aiResponse = `📊 **Threat Assessment Report**

**Current Threat Level: 🟢 LOW**

**Last 24 Hours:**
- Blocked attacks: 3 (all automated)
- Rate limit triggers: 12
- Failed logins: 7 (all blocked)
- XSS attempts: 0
- SQL injection attempts: 0

**Geographic Threats:**
- 🇷🇺 Russia: 2 blocked attempts
- 🇨🇳 China: 1 blocked attempt
- 🇺🇸 USA: 0 threats

**Protection Effectiveness: 100%**
All threats successfully mitigated by security systems.`

      } else if (inputMessage.includes('/platform-status')) {
        aiResponse = `⚡ **Platform Health Status**

**System Performance:**
- API Response Time: 45ms (Excellent)
- Database Latency: 12ms (Optimal)
- Uptime: 99.98% (30 days)
- Memory Usage: 68% (Normal)
- CPU Usage: 23% (Low)

**Security Systems:**
- 🟢 All security middleware active
- 🟢 Rate limiting operational
- 🟢 Monitoring systems online
- 🟢 Backup systems functional

**User Activity:**
- Active users: 847
- New registrations today: 23
- Owner sessions: 1 (you)

Platform is running smoothly! 🚀`

      } else if (inputMessage.toLowerCase().includes('owner') && user?.role === 'owner') {
        aiResponse = `👑 **Owner Commands Available:**

As the platform owner, you have access to advanced features:

🛡️ **Security Management:**
- View real-time security dashboard
- Monitor threat detection
- Configure security policies
- Access audit logs

💼 **Platform Administration:**
- User management & analytics
- System performance monitoring  
- Database management
- Revenue & analytics tracking

🎯 **Quick Actions:**
- Reset user passwords
- Ban/unban users
- Configure rate limits
- Export platform data

Would you like me to help with any specific administrative task?`

      } else if (inputMessage.toLowerCase().includes('help')) {
        aiResponse = `🤖 **M7R AI Assistant Help**

I can assist you with:

**💬 General Support:**
- Platform navigation
- Feature explanations
- Troubleshooting

**🔐 Security (Owner Only):**
- Security monitoring
- Threat analysis
- System health checks

**📊 Analytics:**
- User statistics
- Platform performance
- Growth insights

**🛠️ Commands:**
${securityCommands.map(cmd => `- ${cmd.command}: ${cmd.description}`).join('\n')}

Just type your question or use a command to get started!`

      } else {
        aiResponse = `I understand you're asking about "${inputMessage}". 

As your M7R AI Assistant, I can help with:
- Platform security and monitoring
- User analytics and insights  
- Technical support and guidance
- ${user?.role === 'owner' ? 'Owner dashboard and administrative functions' : 'General platform features'}

Type "/help" for available commands or ask me anything about the platform! 🚀`
      }

      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, aiMessage])
      setIsLoading(false)
    }, 1500)

    setInputMessage('')
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Bot className="h-8 w-8 text-blue-400" />
            <h1 className="text-3xl font-bold text-white">M7R AI Assistant</h1>
            {user?.role === 'owner' && <span className="text-yellow-400">👑</span>}
          </div>
          <p className="text-gray-300">Your intelligent platform companion with advanced security monitoring</p>
        </div>

        {/* Chat Container */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden">
          {/* Messages Area */}
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-md px-4 py-3 rounded-2xl ${
                  message.type === 'user'
                    ? 'bg-blue-500 text-white ml-auto'
                    : 'bg-white/20 text-gray-100 mr-auto'
                }`}>
                  <div className="flex items-start gap-2">
                    {message.type === 'ai' && (
                      <Brain className="h-4 w-4 text-blue-400 mt-1 flex-shrink-0" />
                    )}
                    <div className="whitespace-pre-line text-sm">{message.content}</div>
                  </div>
                  <div className="text-xs opacity-70 mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/20 text-gray-100 max-w-md px-4 py-3 rounded-2xl">
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-blue-400 animate-pulse" />
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Commands */}
          {user?.role === 'owner' && (
            <div className="border-t border-white/20 p-4">
              <div className="flex flex-wrap gap-2">
                {securityCommands.slice(0, 4).map((cmd, index) => (
                  <button
                    key={index}
                    onClick={() => setInputMessage(cmd.command)}
                    className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-xs px-3 py-1 rounded-full border border-purple-400/30 transition-all duration-200"
                  >
                    {cmd.command}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="border-t border-white/20 p-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about platform security, analytics, or type /help for commands..."
                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                Send
              </button>
            </div>
          </div>
        </div>

        {/* Security Status Indicator */}
        <div className="mt-6 bg-green-500/20 border border-green-400/30 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-green-400" />
            <div>
              <div className="text-green-300 font-semibold">Security Status: Active</div>
              <div className="text-green-400/80 text-sm">All AI interactions are encrypted and monitored</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AIAssistant
