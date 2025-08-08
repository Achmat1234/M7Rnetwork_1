import { Link } from 'react-router-dom'
import { Home, ArrowLeft, Search, Crown } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const NotFoundPage = () => {
  const { user, isOwner } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* 404 Animation */}
        <div className="mb-8">
          <div className="text-8xl font-bold text-transparent bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text animate-pulse">
            404
          </div>
          <div className="mt-4 text-xl text-gray-600 dark:text-gray-400">
            Page Not Found
          </div>
        </div>

        {/* Message */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Oops! You've wandered off the path
          </h1>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            The page you're looking for doesn't exist or may have been moved. 
            {isOwner && " As the platform owner, you have access to all areas - let's get you back on track!"}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Home className="mr-2" size={20} />
              Back to Home
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft className="mr-2" size={20} />
              Go Back
            </button>
          </div>

          {/* Quick Links */}
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Quick Links:
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Link
                to="/store"
                className="px-3 py-1 text-sm bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-md hover:bg-purple-200 dark:hover:bg-purple-900/40 transition-colors"
              >
                MaRk7Raw Store
              </Link>
              <Link
                to="/marketplace"
                className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-md hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-colors"
              >
                Marketplace
              </Link>
              {user && (
                <>
                  <Link
                    to="/dashboard"
                    className="px-3 py-1 text-sm bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-md hover:bg-green-200 dark:hover:bg-green-900/40 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Profile
                  </Link>
                </>
              )}
              {isOwner && (
                <Link
                  to="/owner-dashboard"
                  className="px-3 py-1 text-sm bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 rounded-md hover:bg-yellow-200 dark:hover:bg-yellow-900/40 transition-colors flex items-center"
                >
                  <Crown size={12} className="mr-1" />
                  Owner Dashboard
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-xs text-gray-400 dark:text-gray-500">
          <p>
            If you believe this is an error, please contact support or try refreshing the page.
          </p>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage
