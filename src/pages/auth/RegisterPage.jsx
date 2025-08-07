import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const res = await register(form)
    setLoading(false)
    if (res.success) {
      toast.success('Account created!')
      navigate('/dashboard')
    } else {
      toast.error(res.message || 'Registration failed')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-900 dark:to-blue-900">
      <div className="card w-full max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Join M7RNetworking</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            className="input-field"
            placeholder="Full Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            className="input-field"
            placeholder="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            className="input-field"
            placeholder="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            className="input-field"
            placeholder="Password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className="btn-primary w-full"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <div className="text-center mt-4">
          <a href="/login" className="nav-link">Already have an account? Sign In</a>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
