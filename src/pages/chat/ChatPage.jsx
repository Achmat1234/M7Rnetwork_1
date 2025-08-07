import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'
import { 
  Send, 
  Search, 
  Phone, 
  Video, 
  MoreVertical,
  Paperclip,
  Smile,
  Crown,
  Users,
  MessageCircle,
  Circle,
  Star,
  Camera,
  Mic,
  ArrowLeft,
  Check,
  CheckCheck
} from 'lucide-react'

const ChatPage = () => {
  const { user } = useAuth()
  const [selectedChat, setSelectedChat] = useState(null)
  const [message, setMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const messagesEndRef = useRef(null)

  const chats = [
    {
      id: 1,
      name: 'Mark (Owner)',
      lastMessage: 'Welcome to M7RNetworking! 👑',
      timestamp: '2:30 PM',
      unread: 2,
      online: true,
      isOwner: true,
      avatar: '👑',
      type: 'direct'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      lastMessage: 'Thanks for the networking tips!',
      timestamp: '1:45 PM',
      unread: 0,
      online: true,
      avatar: '👩‍💼',
      type: 'direct'
    },
    {
      id: 3,
      name: 'Tech Entrepreneurs',
      lastMessage: 'Mike: Anyone interested in a startup meetup?',
      timestamp: '12:20 PM',
      unread: 5,
      online: false,
      avatar: '💻',
      type: 'group',
      members: 24
    },
    {
      id: 4,
      name: 'Fashion Community',
      lastMessage: 'New MaRk7Raw collection drops tomorrow!',
      timestamp: '11:15 AM',
      unread: 12,
      online: false,
      avatar: '👕',
      type: 'group',
      members: 156
    },
    {
      id: 5,
      name: 'AI Tools Discussion',
      lastMessage: 'Emma: ChatGPT integration is amazing!',
      timestamp: 'Yesterday',
      unread: 0,
      online: false,
      avatar: '🤖',
      type: 'group',
      members: 67
    },
    {
      id: 6,
      name: 'Business Networking',
      lastMessage: 'Weekly meetup confirmed for Friday',
      timestamp: 'Monday',
      unread: 3,
      online: false,
      avatar: '🤝',
      type: 'group',
      members: 89
    }
  ]

  const messages = selectedChat ? [
    {
      id: 1,
      sender: selectedChat.isOwner ? 'Mark' : selectedChat.name,
      content: selectedChat.isOwner ? 
        'Welcome to M7RNetworking! I\'m excited to have you in our premium community. 👑' :
        'Hey! Thanks for connecting. Looking forward to collaborating!',
      timestamp: '2:25 PM',
      isOwn: false,
      status: 'read'
    },
    {
      id: 2,
      sender: 'You',
      content: 'Thank you! This platform is incredible. Love the premium features.',
      timestamp: '2:27 PM',
      isOwn: true,
      status: 'read'
    },
    {
      id: 3,
      sender: selectedChat.isOwner ? 'Mark' : selectedChat.name,
      content: selectedChat.isOwner ?
        'That\'s what we\'re all about! Feel free to explore the AI tools and marketplace. If you need anything, I\'m here! 🚀' :
        'Absolutely! The AI tools section is my favorite. Have you tried the content generator?',
      timestamp: '2:30 PM',
      isOwn: false,
      status: 'read'
    }
  ] : []

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = () => {
    if (message.trim()) {
      // Here you would normally send the message via Socket.IO
      console.log('Sending message:', message)
      setMessage('')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar - Chat List */}
      <div className={`${selectedChat ? 'hidden lg:block' : 'block'} w-full lg:w-1/3 xl:w-1/4 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
              <MessageCircle size={24} className="text-blue-500" />
              <span>Messages</span>
            </h1>
            <button className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              <MoreVertical size={20} />
            </button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {filteredChats.map(chat => (
            <div
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              className={`p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                selectedChat?.id === chat.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                {/* Avatar */}
                <div className="relative">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                    chat.isOwner 
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500' 
                      : chat.type === 'group'
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500'
                      : 'bg-gradient-to-r from-green-500 to-blue-500'
                  }`}>
                    {chat.avatar}
                  </div>
                  {chat.online && chat.type === 'direct' && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                  )}
                </div>

                {/* Chat Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                        {chat.name}
                      </h3>
                      {chat.isOwner && (
                        <Crown size={14} className="text-yellow-500" fill="currentColor" />
                      )}
                      {chat.type === 'group' && (
                        <Users size={14} className="text-gray-500" />
                      )}
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {chat.timestamp}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {chat.lastMessage}
                    </p>
                    {chat.unread > 0 && (
                      <div className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                        {chat.unread}
                      </div>
                    )}
                  </div>
                  
                  {chat.type === 'group' && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {chat.members} members
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`${selectedChat ? 'block' : 'hidden lg:block'} flex-1 flex flex-col`}>
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => setSelectedChat(null)}
                    className="lg:hidden p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  
                  <div className="relative">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                      selectedChat.isOwner 
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-500' 
                        : selectedChat.type === 'group'
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500'
                        : 'bg-gradient-to-r from-green-500 to-blue-500'
                    }`}>
                      {selectedChat.avatar}
                    </div>
                    {selectedChat.online && selectedChat.type === 'direct' && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                    )}
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2">
                      <h2 className="font-semibold text-gray-900 dark:text-white">
                        {selectedChat.name}
                      </h2>
                      {selectedChat.isOwner && (
                        <Crown size={16} className="text-yellow-500" fill="currentColor" />
                      )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedChat.type === 'direct' 
                        ? selectedChat.online ? 'Online' : 'Last seen recently'
                        : `${selectedChat.members} members`
                      }
                    </p>
                  </div>
                </div>

                {/* Chat Actions */}
                <div className="flex items-center space-x-2">
                  {selectedChat.type === 'direct' && (
                    <>
                      <button className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                        <Phone size={20} />
                      </button>
                      <button className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                        <Video size={20} />
                      </button>
                    </>
                  )}
                  <button className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                    <MoreVertical size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                    msg.isOwn
                      ? 'bg-blue-500 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                  }`}>
                    {!msg.isOwn && selectedChat.type === 'group' && (
                      <p className="text-xs font-medium text-blue-500 dark:text-blue-400 mb-1">
                        {msg.sender}
                      </p>
                    )}
                    <p className="text-sm">{msg.content}</p>
                    <div className={`flex items-center justify-end space-x-1 mt-1 ${
                      msg.isOwn ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      <span className="text-xs">{msg.timestamp}</span>
                      {msg.isOwn && (
                        <div className="text-blue-100">
                          {msg.status === 'read' ? (
                            <CheckCheck size={14} />
                          ) : (
                            <Check size={14} />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center space-x-3">
                <button className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Paperclip size={20} />
                </button>
                
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-full focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                  <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                    <Smile size={18} />
                  </button>
                </div>

                {message.trim() ? (
                  <button
                    onClick={sendMessage}
                    className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors"
                  >
                    <Send size={20} />
                  </button>
                ) : (
                  <button className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                    <Mic size={20} />
                  </button>
                )}
              </div>
            </div>
          </>
        ) : (
          /* Welcome Screen */
          <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle size={48} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome to M7R Chat
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
                Connect with premium members, join community groups, and network with like-minded entrepreneurs.
              </p>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Real-time messaging</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Crown size={12} className="text-yellow-500" />
                    <span>Premium features</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatPage
