import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'

function ProductList() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({})

  const { token } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetchProducts(true)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!loading) {
        fetchProducts(false)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => {
    if (!loading) {
      fetchProducts(false)
    }
  }, [category, page])

  const fetchProducts = async (isInitial = false) => {
    try {
      if (isInitial) {
        setLoading(true)
      } else {
        setSearching(true)
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/products`,
        {
          params: { search, category, page, limit: 5 },
        }
      )
      setProducts(response.data.products)
      setPagination(response.data.pagination)
    } catch (error) {
      console.log('Fetch error:', error)
    } finally {
      setLoading(false)
      setSearching(false)
    }
  }

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/products/${productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      fetchProducts()
    } catch (error) {
      console.log('Delete error:', error)
    }
  }

  const getStockColor = (stock) => {
    if (stock === 0) return '#ef4444' // Error Red
    if (stock <= 5) return '#f59e0b' // Warning Amber
    return '#10b981' // Success Emerald
  }

  return (
    <div className="container" style={{ minHeight: 'calc(100vh - 70px)' }}>
      <div className="flex-between mb-4">
        <h1 className="heading-2" style={{ margin: 0 }}>Product List</h1>
        <Link to='/admin/products/add' className="btn btn-primary">
          ➕ Add Product
        </Link>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <input
          type='text'
          placeholder='🔍 Search products...'
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
          className="form-input"
          style={{ flex: 1, minWidth: '200px' }}
        />
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value)
            setPage(1)
          }}
          className="form-input"
          style={{ width: 'auto', minWidth: '150px' }}
        >
          <option value=''>All Categories</option>
          <option value='electronics'>Electronics</option>
          <option value='phones'>Phones</option>
          <option value='computers'>Computers</option>
          <option value='accessories'>Accessories</option>
          <option value='clothing'>Clothing</option>
        </select>
      </div>

      {loading ? (
        <div className="flex-center" style={{ minHeight: '50vh' }}>
          <h2 className="heading-3 text-muted">⏳ Loading...</h2>
        </div>
      ) : (
        <>
          {searching && (
            <p className="text-muted text-center mb-2" style={{ fontSize: '0.9rem' }}>🔍 Searching...</p>
          )}
          <div className="table-container" style={{ opacity: searching ? 0.6 : 1, transition: 'opacity 0.2s' }}>
            <table>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Category</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td>
                      <img
                        src={product.image}
                        alt={product.name}
                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                        onError={(e) => {
                          e.target.src = 'https://placehold.co/50x50/151A23/4f46e5?text=No+Image'
                        }}
                      />
                    </td>
                    <td>
                      <p style={{ fontWeight: '600', color: 'var(--text-main)', margin: 0 }}>{product.name}</p>
                    </td>
                    <td>
                      <p style={{ color: 'var(--primary)', fontWeight: 'bold', margin: 0 }}>₹{product.price.toLocaleString()}</p>
                    </td>
                    <td>
                      <span style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', padding: '0.25rem 0.6rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem' }}>
                        {product.category}
                      </span>
                    </td>
                    <td>
                      <span style={{
                        color: getStockColor(product.stock),
                        border: `1px solid ${getStockColor(product.stock)}40`,
                        backgroundColor: `${getStockColor(product.stock)}10`,
                        padding: '0.25rem 0.6rem',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.75rem',
                        fontWeight: '600'
                      }}>
                        {product.stock === 0 ? '❌ Out of Stock' : `${product.stock} left`}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link
                          to={`/admin/products/edit/${product._id}`}
                          className="btn"
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.3)' }}
                        >
                          ✏️ Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="btn"
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)' }}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.25rem', marginTop: '2rem' }}>
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="btn btn-secondary"
              style={{ opacity: page === 1 ? 0.5 : 1 }}
            >
              ← Prev
            </button>
            <span className="text-muted" style={{ fontSize: '0.95rem' }}>
              Page <strong style={{ color: 'var(--text-main)' }}>{pagination.page}</strong> of <strong style={{ color: 'var(--text-main)' }}>{pagination.pages}</strong>
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === pagination.pages}
              className="btn btn-secondary"
              style={{ opacity: page === pagination.pages ? 0.5 : 1 }}
            >
              Next →
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default ProductList