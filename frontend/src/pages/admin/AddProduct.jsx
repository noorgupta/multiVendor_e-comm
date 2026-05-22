import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'

function AddProduct() {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    image: '',
    description: '',
    stock: '',
    category: 'electronics',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const { token } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/products`,
        {
          ...formData,
          price: Number(formData.price),
          stock: Number(formData.stock),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      setSuccess('✅ Product added successfully!')
      setTimeout(() => navigate('/admin/products'), 1500)
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add product!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container" style={{ minHeight: 'calc(100vh - 70px)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2rem' }}>
        <Link to='/admin/products' className="text-muted" style={{ fontWeight: '600' }}>← Back</Link>
        <h1 className="heading-2" style={{ margin: 0 }}>Add New Product</h1>
      </div>

      <div className="card" style={{ maxWidth: '700px', margin: '0 auto', padding: '2rem' }}>
        {error && <div className="mb-3 p-2 text-center" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', borderRadius: 'var(--radius-sm)' }}>{error}</div>}
        {success && <div className="mb-3 p-2 text-center" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', borderRadius: 'var(--radius-sm)' }}>{success}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Product Name</label>
            <input
              name='name'
              value={formData.name}
              onChange={handleChange}
              placeholder='Enter product name'
              className="form-input"
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
            <div className="form-group" style={{ flex: 1, minWidth: '150px', marginBottom: 0 }}>
              <label className="form-label">Price (₹)</label>
              <input
                name='price'
                type='number'
                value={formData.price}
                onChange={handleChange}
                placeholder='Enter price'
                className="form-input"
                required
              />
            </div>
            <div className="form-group" style={{ flex: 1, minWidth: '150px', marginBottom: 0 }}>
              <label className="form-label">Stock</label>
              <input
                name='stock'
                type='number'
                value={formData.stock}
                onChange={handleChange}
                placeholder='Enter stock'
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Category</label>
            <select
              name='category'
              value={formData.category}
              onChange={handleChange}
              className="form-input"
              required
            >
              <option value='electronics'>Electronics</option>
              <option value='phones'>Phones</option>
              <option value='computers'>Computers</option>
              <option value='accessories'>Accessories</option>
              <option value='clothing'>Clothing</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Image URL</label>
            <input
              name='image'
              value={formData.image}
              onChange={handleChange}
              placeholder='Enter image URL'
              className="form-input"
              required
            />
          </div>

          {formData.image && (
            <img
              src={formData.image}
              alt='preview'
              style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}
              onError={(e) => e.target.style.display = 'none'}
            />
          )}

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Description</label>
            <textarea
              name='description'
              value={formData.description}
              onChange={handleChange}
              placeholder='Enter product description'
              className="form-input"
              rows={4}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary mt-2"
            style={{ width: '100%', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? '⏳ Adding...' : '➕ Add Product'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddProduct