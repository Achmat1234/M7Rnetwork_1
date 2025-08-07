import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { 
  Brain, 
  Zap, 
  Wand2, 
  FileText, 
  Image, 
  MessageSquare,
  TrendingUp,
  Search,
  Filter,
  Star,
  Crown,
  Play,
  Bookmark,
  ExternalLink,
  Clock,
  Users,
  ArrowRight,
  Sparkles,
  Camera,
  Code,
  BarChart3,
  Mail,
  Globe,
  Palette
} from 'lucide-react'

const ToolsPage = () => {
  const { user } = useAuth()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [favorites, setFavorites] = useState(['1', '3', '7'])

  const categories = [
    { id: 'all', name: 'All Tools', icon: Brain, count: 50 },
    { id: 'content', name: 'Content Creation', icon: FileText, count: 12 },
    { id: 'design', name: 'Design & Visual', icon: Image, count: 8 },
    { id: 'business', name: 'Business & Analytics', icon: TrendingUp, count: 10 },
    { id: 'communication', name: 'Communication', icon: MessageSquare, count: 7 },
    { id: 'productivity', name: 'Productivity', icon: Zap, count: 9 },
    { id: 'development', name: 'Development', icon: Code, count: 4 }
  ]

  const tools = [
    {
      id: '1',
      name: 'AI Content Generator',
      description: 'Generate high-quality blog posts, social media content, and marketing copy using advanced AI.',
      category: 'content',
      icon: FileText,
      color: 'from-blue-500 to-blue-600',
      isPremium: false,
      isPopular: true,
      rating: 4.9,
      users: 1247,
      timeToComplete: '2-5 min',
      features: ['Blog posts', 'Social media', 'Email templates', 'SEO optimized']
    },
    {
      id: '2',
      name: 'Business Plan Assistant',
      description: 'Create comprehensive business plans with AI-powered market analysis and financial projections.',
      category: 'business',
      icon: BarChart3,
      color: 'from-green-500 to-green-600',
      isPremium: true,
      isPopular: false,
      rating: 4.8,
      users: 567,
      timeToComplete: '15-30 min',
      features: ['Market analysis', 'Financial projections', 'SWOT analysis', 'Export to PDF']
    },
    {
      id: '3',
      name: 'Logo & Brand Designer',
      description: 'Generate professional logos and brand assets for your business in minutes.',
      category: 'design',
      icon: Palette,
      color: 'from-purple-500 to-purple-600',
      isPremium: false,
      isPopular: true,
      rating: 4.7,
      users: 892,
      timeToComplete: '3-8 min',
      features: ['Logo generation', 'Color palettes', 'Font suggestions', 'Brand guidelines']
    },
    {
      id: '4',
      name: 'Email Marketing Optimizer',
      description: 'Optimize your email campaigns with AI-powered subject lines and content suggestions.',
      category: 'communication',
      icon: Mail,
      color: 'from-orange-500 to-orange-600',
      isPremium: true,
      isPopular: false,
      rating: 4.6,
      users: 334,
      timeToComplete: '5-10 min',
      features: ['Subject line optimization', 'Content suggestions', 'A/B testing', 'Analytics']
    },
    {
      id: '5',
      name: 'Social Media Scheduler',
      description: 'Plan, create, and schedule social media content across all platforms with AI assistance.',
      category: 'productivity',
      icon: Globe,
      color: 'from-pink-500 to-pink-600',
      isPremium: false,
      isPopular: true,
      rating: 4.8,
      users: 1156,
      timeToComplete: '10-20 min',
      features: ['Multi-platform posting', 'Content calendar', 'Hashtag suggestions', 'Analytics']
    },
    {
      id: '6',
      name: 'Image Enhancement Suite',
      description: 'Enhance, upscale, and edit images using AI-powered tools for professional results.',
      category: 'design',
      icon: Camera,
      color: 'from-teal-500 to-teal-600',
      isPremium: true,
      isPopular: false,
      rating: 4.9,
      users: 678,
      timeToComplete: '2-5 min',
      features: ['Image upscaling', 'Background removal', 'Color correction', 'Style transfer']
    },
    {
      id: '7',
      name: 'Market Research Analyzer',
      description: 'Analyze market trends, competitor data, and customer insights with AI-powered research.',
      category: 'business',
      icon: TrendingUp,
      color: 'from-indigo-500 to-indigo-600',
      isPremium: true,
      isPopular: true,
      rating: 4.8,
      users: 445,
      timeToComplete: '20-45 min',
      features: ['Competitor analysis', 'Market trends', 'Customer insights', 'Report generation']
    },
    {
      id: '8',
      name: 'Code Assistant Pro',
      description: 'Generate, review, and optimize code with AI assistance for multiple programming languages.',
      category: 'development',
      icon: Code,
      color: 'from-gray-600 to-gray-700',
      isPremium: true,
      isPopular: false,
      rating: 4.7,
      users: 234,
      timeToComplete: '5-15 min',
      features: ['Code generation', 'Bug detection', 'Optimization', 'Documentation']
    }
  ]

  const filteredTools = tools.filter(tool => {
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const toggleFavorite = (toolId) => {
    if (favorites.includes(toolId)) {
      setFavorites(favorites.filter(id => id !== toolId))
    } else {
      setFavorites([...favorites, toolId])
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Brain size={20} />
              <span className="font-semibold">50+ AI-Powered Tools</span>
              <Sparkles size={16} />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              AI Tools Library
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Supercharge your productivity with curated AI tools for content creation, business growth, and creative projects.
            </p>
            {user && (
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3 inline-block">
                <div className="text-lg font-semibold flex items-center space-x-2">
                  <Crown size={20} className="text-yellow-300" />
                  <span>Premium Member Access Unlocked</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map(category => {
                  const Icon = category.icon
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Icon size={16} />
                          <span className="text-sm font-medium">{category.name}</span>
                        </div>
                        <span className="text-xs text-gray-500">{category.count}</span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Usage</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Tools Used</span>
                  <span className="font-medium text-gray-900 dark:text-white">15</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Favorites</span>
                  <span className="font-medium text-gray-900 dark:text-white">{favorites.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Time Saved</span>
                  <span className="font-medium text-green-600 dark:text-green-400">47h</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <div className="mb-4 sm:mb-0 flex-1 max-w-md">
                <div className="relative">
                  <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search AI tools..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                Showing {filteredTools.length} of {tools.length} tools
              </div>
            </div>

            {/* Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredTools.map(tool => {
                const Icon = tool.icon
                return (
                  <div 
                    key={tool.id} 
                    className="card group hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105 relative"
                  >
                    {/* Premium Badge */}
                    {tool.isPremium && (
                      <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                        <Crown size={12} />
                        <span>Premium</span>
                      </div>
                    )}

                    {/* Popular Badge */}
                    {tool.isPopular && (
                      <div className="absolute top-4 right-4 z-10 bg-gradient-to-r from-pink-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                        <Star size={12} fill="currentColor" />
                        <span>Popular</span>
                      </div>
                    )}

                    {/* Favorite Button */}
                    <button
                      onClick={() => toggleFavorite(tool.id)}
                      className="absolute top-4 right-4 z-20 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
                      style={{ top: tool.isPopular ? '3rem' : '1rem' }}
                    >
                      <Bookmark 
                        size={16} 
                        className={favorites.includes(tool.id) ? 'text-blue-500 fill-current' : 'text-gray-600'} 
                      />
                    </button>

                    {/* Tool Icon */}
                    <div className="mb-6">
                      <div className={`w-16 h-16 bg-gradient-to-r ${tool.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                        <Icon size={32} className="text-white" />
                      </div>
                    </div>

                    {/* Tool Info */}
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {tool.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                        {tool.description}
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between mb-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Star size={14} className="text-yellow-500" fill="currentColor" />
                        <span>{tool.rating}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users size={14} />
                        <span>{tool.users.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock size={14} />
                        <span>{tool.timeToComplete}</span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="mb-6">
                      <div className="flex flex-wrap gap-2">
                        {tool.features.slice(0, 3).map((feature, index) => (
                          <span 
                            key={index}
                            className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-xs"
                          >
                            {feature}
                          </span>
                        ))}
                        {tool.features.length > 3 && (
                          <span className="text-gray-500 dark:text-gray-400 px-3 py-1 text-xs">
                            +{tool.features.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <button 
                        className="flex-1 btn-primary flex items-center justify-center space-x-2"
                        disabled={tool.isPremium && !user}
                      >
                        <Play size={16} />
                        <span>{tool.isPremium && !user ? 'Premium Only' : 'Launch Tool'}</span>
                      </button>
                      <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
                        <ExternalLink size={16} className="text-gray-600 dark:text-gray-400" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            {filteredTools.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No tools found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Try adjusting your search or category filter
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Coming Soon Section */}
      <div className="bg-white dark:bg-gray-800 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            More AI Tools Coming Soon
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            We're constantly adding new AI-powered tools to help you grow your business and boost productivity.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <Wand2 size={16} className="text-purple-500" />
              <span>Video Generation</span>
            </div>
            <div className="flex items-center space-x-2">
              <MessageSquare size={16} className="text-blue-500" />
              <span>Voice Assistant</span>
            </div>
            <div className="flex items-center space-x-2">
              <BarChart3 size={16} className="text-green-500" />
              <span>Predictive Analytics</span>
            </div>
            <div className="flex items-center space-x-2">
              <Code size={16} className="text-orange-500" />
              <span>No-Code Builder</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ToolsPage
