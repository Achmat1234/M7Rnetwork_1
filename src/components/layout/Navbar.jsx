import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { 
  Menu, 
  X, 
  Sun, 
  Moon, 
  Crown, 
  User, 
  Store, 
  MessageCircle, 
  Settings, 
  LogOut,
  ShoppingBag,
  Users,
  Package,
  BarChart3,
  ChevronDown
} from 'lucide-react'

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const [isOwnerDropdownOpen, setIsOwnerDropdownOpen] = useState(false)
  const { user, logout, isOwner } = useAuth()
  const { darkMode, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const profileDropdownRef = useRef(null)
  const ownerDropdownRef = useRef(null)

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsProfileDropdownOpen(false)
    setIsMobileMenuOpen(false)
  }

  const isActivePage = (path) => {
    return location.pathname === path
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false)
      }
      if (ownerDropdownRef.current && !ownerDropdownRef.current.contains(event.target)) {
        setIsOwnerDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const publicNavItems = [
    { name: 'Home', path: '/', icon: null },
    { name: 'Store', path: '/store', icon: Store },
    { name: 'Marketplace', path: '/marketplace', icon: ShoppingBag },
  ]

  const userNavItems = [
    { name: 'Dashboard', path: '/dashboard', icon: User },
    { name: 'Tools', path: '/tools', icon: Settings },
    { name: 'Chat', path: '/chat', icon: MessageCircle },
    { name: 'Community', path: '/community', icon: Users },
  ]

  const ownerNavItems = [
    { name: 'Owner Dashboard', path: '/owner-dashboard', icon: Crown },
    { name: 'Store Manager', path: '/store/manage', icon: Package },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  ]

  const NavLink = ({ item, onClick }) => {
    const Icon = item.icon
    return (
      <Link
        to={item.path}
        onClick={onClick}
        className={`nav-link flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 ${
          isActivePage(item.path) 
            ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 font-medium' 
            : 'text-gray-700 dark:text-gray-300'
        }`}
      >
        {Icon && <Icon size={18} />}
        <span>{item.name}</span>
      </Link>
    )
  }



  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">M7R</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                M7RNetworking
              </span>
              {isOwner && (
                <div className="flex items-center text-xs text-yellow-600 dark:text-yellow-400 font-medium">
                  <Crown size={12} className="mr-1" />
                  Owner Access
                </div>
              )}
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {/* Public Navigation */}
            <div className="flex items-center space-x-1">
              {publicNavItems.map((item) => (
                <NavLink key={item.name} item={item} />
              ))}
            </div>

            {/* Divider */}
            {user && (
              <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-4"></div>
            )}

            {/* User Navigation */}
            {user && !isOwner && (
              <div className="flex items-center space-x-1">
                {userNavItems.map((item) => (
                  <NavLink key={item.name} item={item} />
                ))}
              </div>
            )}

            {/* Owner Navigation */}
            {isOwner && (
              <div className="relative" ref={ownerDropdownRef}>
                <button
                  onClick={() => setIsOwnerDropdownOpen(!isOwnerDropdownOpen)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-purple-50 dark:hover:bg-purple-900/20 text-purple-600 dark:text-purple-400"
                >
                  <Crown size={18} />
                  <span className="font-medium">Owner Panel</span>
                  <ChevronDown size={16} className={`transition-transform ${isOwnerDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isOwnerDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2">
                    {ownerNavItems.map((item) => {
                      const Icon = item.icon
                      return (
                        <Link
                          key={item.name}
                          to={item.path}
                          onClick={() => setIsOwnerDropdownOpen(false)}
                          className={`flex items-center space-x-3 px-4 py-2 text-sm transition-colors hover:bg-purple-50 dark:hover:bg-purple-900/20 ${
                            isActivePage(item.path)
                              ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20'
                              : 'text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          <Icon size={16} />
                          <span>{item.name}</span>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {user ? (
              /* User Profile Dropdown */
              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full text-white font-bold text-sm">
                    {isOwner ? '👑' : user.avatar || user.name?.charAt(0) || 'U'}
                  </div>
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {user.name || user.username}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                      {user.role}
                    </div>
                  </div>
                  <ChevronDown size={16} className={`hidden md:block text-gray-400 transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2">
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.name || user.username}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {user.email}
                      </div>
                    </div>
                    
                    <Link
                      to="/profile"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <User size={16} />
                      <span>Profile Settings</span>
                    </Link>
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full text-left"
                    >
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Login/Register Buttons */
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 px-3 py-2 rounded-lg transition-colors font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all font-medium shadow-md"
                >
                  Join M7R
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 dark:border-gray-700 py-4">
            <div className="space-y-2">
              {/* Public Navigation */}
              {publicNavItems.map((item) => (
                <NavLink key={item.name} item={item} onClick={() => setIsMobileMenuOpen(false)} />
              ))}
              
              {/* User Navigation */}
              {user && !isOwner && (
                <>
                  <div className="my-4 border-t border-gray-200 dark:border-gray-700"></div>
                  {userNavItems.map((item) => (
                    <NavLink key={item.name} item={item} onClick={() => setIsMobileMenuOpen(false)} />
                  ))}
                </>
              )}

              {/* Owner Navigation */}
              {isOwner && (
                <>
                  <div className="my-4 border-t border-gray-200 dark:border-gray-700"></div>
                  <div className="px-3 py-2 text-sm font-medium text-purple-600 dark:text-purple-400 flex items-center">
                    <Crown size={16} className="mr-2" />
                    Owner Panel
                  </div>
                  {ownerNavItems.map((item) => (
                    <div key={item.name} className="ml-4">
                      <NavLink item={item} onClick={() => setIsMobileMenuOpen(false)} />
                    </div>
                  ))}
                </>
              )}

              {/* Mobile User Actions */}
              {user && (
                <>
                  <div className="my-4 border-t border-gray-200 dark:border-gray-700"></div>
                  <Link
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center space-x-2 px-3 py-2 text-gray-700 dark:text-gray-300 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <User size={18} />
                    <span>Profile Settings</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-3 py-2 text-red-600 dark:text-red-400 rounded-lg transition-colors hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-left"
                  >
                    <LogOut size={18} />
                    <span>Sign Out</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
                  {Icon && <Icon size={18} />}
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </div>

          {/* Right Side Items */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {darkMode ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} className="text-gray-600" />}
            </button>

            {user ? (
              <>
                {/* Owner Dashboard Link (only for owner) */}
                {isOwner && (
                  <Link
                    to="/owner-dashboard"
                    className="btn-owner flex items-center space-x-1 px-3 py-2"
                  >
                    <Crown size={18} />
                    <span className="hidden sm:inline">Owner</span>
                  </Link>
                )}

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    {user.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                          {user.name?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                    )}
                    <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {user.name}
                    </span>
                    {isOwner && <Crown size={16} className="text-yellow-500" />}
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                      <Link
                        to={`/profile/${user.username || user._id}`}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <User size={16} />
                        <span>Profile</span>
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <Settings size={16} />
                        <span>Settings</span>
                      </Link>
                      <hr className="my-1 border-gray-200 dark:border-gray-700" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <LogOut size={16} />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Login/Register Buttons */
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary"
                >
                  Join M7R
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="px-4 py-3 space-y-3">
            {/* Public Nav Items */}
            {publicNavItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    isActivePage(item.path) ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-700 dark:text-gray-300'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {Icon && <Icon size={18} />}
                  <span>{item.name}</span>
                </Link>
              )
            })}

            {/* Private Nav Items (only if logged in) */}
            {user && privateNavItems.filter(item => {
              // Hide Dashboard for owners since they have their own dashboard
              if (isOwner && item.path === '/dashboard') return false
              return true
            }).map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    isActivePage(item.path) ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-700 dark:text-gray-300'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {Icon && <Icon size={18} />}
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
