import React from 'react'
import { Users, MessageCircle, Calendar, Trophy, Star, Globe } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const CommunityPage = () => {
  const { user, isOwner } = useAuth()

  const communityStats = [
    { label: 'Total Members', value: '1,247', icon: Users, color: 'text-blue-600' },
    { label: 'Active Discussions', value: '89', icon: MessageCircle, color: 'text-green-600' },
    { label: 'Events This Month', value: '12', icon: Calendar, color: 'text-purple-600' },
    { label: 'Success Stories', value: '156', icon: Trophy, color: 'text-yellow-600' }
  ]

  const featuredGroups = [
    {
      name: 'Fashion Entrepreneurs',
      members: 234,
      description: 'Connect with fashion industry leaders and creators',
      image: 'https://via.placeholder.com/80x80/7c3aed/ffffff?text=👗',
      isJoined: true
    },
    {
      name: 'Tech Innovators',
      members: 189,
      description: 'Discuss latest tech trends and startup ideas',
      image: 'https://via.placeholder.com/80x80/2563eb/ffffff?text=💻',
      isJoined: false
    },
    {
      name: 'MaRk7Raw Supporters',
      members: 567,
      description: 'Official fan community for MaRk7Raw brand',
      image: 'https://via.placeholder.com/80x80/059669/ffffff?text=M7R',
      isJoined: true
    }
  ]

  const recentPosts = [
    {
      author: 'Sarah Chen',
      avatar: 'https://via.placeholder.com/40x40/dc2626/ffffff?text=SC',
      content: 'Just launched my new sustainable fashion line! Thanks to everyone in this community for the support and feedback. 🌿👗',
      timestamp: '2 hours ago',
      likes: 24,
      comments: 8,
      group: 'Fashion Entrepreneurs'
    },
    {
      author: 'Mike Rodriguez',
      avatar: 'https://via.placeholder.com/40x40/ea580c/ffffff?text=MR',
      content: 'Looking for a co-founder for my AI startup. Anyone interested in revolutionizing customer service?',
      timestamp: '4 hours ago',
      likes: 18,
      comments: 12,
      group: 'Tech Innovators'
    },
    {
      author: 'Emma Thompson',
      avatar: 'https://via.placeholder.com/40x40/7c2d12/ffffff?text=ET',
      content: 'MaRk7Raw\'s latest collection is absolutely stunning! The attention to detail is incredible. 🔥',
      timestamp: '6 hours ago',
      likes: 45,
      comments: 15,
      group: 'MaRk7Raw Supporters'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center justify-center gap-3">
              <Users size={36} className="text-blue-500" />
              M7RNetworking Community
              {isOwner && <span className="text-2xl">👑</span>}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Connect with like-minded creators, entrepreneurs, and innovators. Share ideas, collaborate, and grow together.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Community Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {communityStats.map((stat, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                </div>
                <stat.icon size={32} className={stat.color} />
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Featured Groups */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Globe size={24} className="text-blue-500" />
              Featured Groups
            </h2>
            <div className="space-y-4">
              {featuredGroups.map((group, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
                  <div className="flex items-start gap-3">
                    <img
                      src={group.image}
                      alt={group.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{group.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{group.description}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">{group.members} members</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <button
                      className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                        group.isJoined
                          ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-400'
                      }`}
                    >
                      {group.isJoined ? 'Joined' : 'Join Group'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Posts */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <MessageCircle size={24} className="text-green-500" />
              Recent Posts
            </h2>
            <div className="space-y-6">
              {recentPosts.map((post, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                  <div className="flex items-start gap-3">
                    <img
                      src={post.avatar}
                      alt={post.author}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{post.author}</h3>
                        <span className="text-xs text-gray-500 dark:text-gray-500">•</span>
                        <span className="text-xs text-gray-500 dark:text-gray-500">{post.timestamp}</span>
                        <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 px-2 py-1 rounded-full">
                          {post.group}
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 mb-3">{post.content}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
                        <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
                          <Star size={16} />
                          {post.likes}
                        </button>
                        <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                          <MessageCircle size={16} />
                          {post.comments}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Call to Action */}
            <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Ready to Share Your Story?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Join the conversation and connect with amazing entrepreneurs and creators.
              </p>
              <button className="btn-primary px-6 py-3">
                Create Your First Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CommunityPage
