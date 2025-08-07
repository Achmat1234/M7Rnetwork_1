import { useState } from 'react'
import { Crown, Settings, Shield } from 'lucide-react'
import { setupAPI } from '../services/setupAPI'
import toast from 'react-hot-toast'

const OwnerSetup = () => {
  const [loading, setLoading] = useState(false)

  const handleSetupOwner = async () => {
    try {
      setLoading(true)
      const result = await setupAPI.setupOwner()
      toast.success('👑 Owner account created successfully!')
      console.log('Owner setup result:', result)
    } catch (error) {
      if (error.response?.data?.message === 'Owner already exists') {
        toast.error('Owner account already exists!')
      } else {
        toast.error('Failed to create owner account')
      }
      console.error('Setup error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePromoteToOwner = async () => {
    try {
      setLoading(true)
      const result = await setupAPI.promoteToOwner('mark7raw@gmail.com')
      toast.success('👑 Successfully promoted to owner!')
      console.log('Promotion result:', result)
      // Reload page to update user context
      setTimeout(() => window.location.reload(), 1500)
    } catch (error) {
      if (error.response?.data?.message === 'User not found') {
        toast.error('Please register with mark7raw@gmail.com first')
      } else if (error.response?.data?.message === 'Owner already exists') {
        toast.error('Owner account already exists!')
      } else {
        toast.error('Failed to promote to owner')
      }
      console.error('Promotion error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full border border-white/20">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-4">
            <Crown className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">M7RNetworking</h1>
          <p className="text-gray-300">Owner Setup Panel</p>
        </div>

        <div className="space-y-4">
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <h3 className="text-white font-semibold mb-2 flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Create Owner Account
            </h3>
            <p className="text-gray-300 text-sm mb-4">
              Create a new owner account for Achmat Armien (mark7raw@gmail.com)
            </p>
            <button
              onClick={handleSetupOwner}
              disabled={loading}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-2 px-4 rounded-lg font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all disabled:opacity-50"
            >
              {loading ? 'Creating...' : '👑 Create Owner Account'}
            </button>
          </div>

          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <h3 className="text-white font-semibold mb-2 flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Promote Existing User
            </h3>
            <p className="text-gray-300 text-sm mb-4">
              If you already have an account with mark7raw@gmail.com, promote it to owner
            </p>
            <button
              onClick={handlePromoteToOwner}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-2 px-4 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition-all disabled:opacity-50"
            >
              {loading ? 'Promoting...' : '⬆️ Promote to Owner'}
            </button>
          </div>
        </div>

        <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <p className="text-yellow-300 text-sm">
            <strong>Note:</strong> Owner credentials will be:
            <br />• Name: Achmat Armien
            <br />• Username: MaRk7RaW  
            <br />• Email: mark7raw@gmail.com
            <br />• Default Password: Owner@M7R2024!
          </p>
        </div>
      </div>
    </div>
  )
}

export default OwnerSetup
