import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        name,
        email,
        password,
      })

      login(
        {
          _id: response.data._id,
          name: response.data.name,
          email: response.data.email,
          role: response.data.role,
        },
        response.data.token
      )

      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-center">
      <div className="form-container" style={{ margin: '0' }}>
        <h2 className="heading-2 text-center" style={{ marginBottom: '0.5rem' }}>🚀 Create Account</h2>
        <p className="text-center text-muted mb-3">Register to start shopping</p>

        {error && (
          <div className="mb-3 p-2 text-center" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', borderRadius: 'var(--radius-sm)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Name</label>
            <input
              type='text'
              placeholder='Enter your name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type='email'
              placeholder='Enter your email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type='password'
              placeholder='Minimum 6 characters'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary mt-2"
            style={{ width: '100%', opacity: loading ? 0.7 : 1 }}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p className="text-center text-muted mt-4" style={{ fontSize: '0.9rem' }}>
          Already have an account?{' '}
          <Link to='/login' style={{ color: 'var(--primary)', fontWeight: '600' }}>
            Login here
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register