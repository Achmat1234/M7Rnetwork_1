import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const ProtectedRoute = ({ children, ownerOnly = false }) => {
  const { user, loading, isOwner } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (ownerOnly && !isOwner) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default ProtectedRoute
