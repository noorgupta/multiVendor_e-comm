import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'

function LowStock() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const { token } = useAuth()

  useEffect(() => {
    fetchLowStock()
  }, [])

  const fetchLowStock = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/products/low-stock`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setProducts(response.data.products)
    } catch (error) {
      console.log('Low stock error:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStockColor = (stock) => {
    if (stock === 0) return '#ef4444' // Error Red
    if (stock <= 3) return '#f59e0b' // Warning Amber
    return '#10b981' // Success Emerald
  }

  if (loading) {
    return (
      <div className="page-center">
        <h2 className="heading-2 text-muted">⏳ Loading...</h2>
      </div>
    )
  }

  return (
    <div className="container" style={{ minHeight: 'calc(100vh - 70px)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2rem' }}>
        <Link to='/admin' className="text-muted" style={{ fontWeight: '600' }}>← Back to Dashboard</Link>
        <h1 className="heading-2" style={{ margin: 0 }}>Low Stock Products</h1>
      </div>

      {products.length === 0 ? (
        <div className="form-container" style={{ textAlign: 'center', maxWidth: '500px' }}>
          <p style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</p>
          <h2 className="heading-3">All products are well stocked!</h2>
        </div>
      ) : (
        <div className="grid-auto-fit">
          {products.map((product) => (
            <div key={product._id} className="card" style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
              <img
                src={product.image}
                alt={product.name}
                style={{ width: '100%', height: '180px', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.src = 'https://placehold.co/150x150/151A23/4f46e5?text=No+Image'
                }}
              />
              <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
                <h3 className="product-title" style={{ margin: 0 }}>{product.name}</h3>
                <p className="text-muted" style={{ fontSize: '0.85rem', margin: 0 }}>{product.category}</p>
                <p style={{ color: 'var(--primary)', fontSize: '1.2rem', fontWeight: 'bold', margin: 0 }}>₹{product.price.toLocaleString()}</p>
                
                <div style={{
                  padding: '0.5rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  textAlign: 'center',
                  backgroundColor: getStockColor(product.stock) + '15',
                  color: getStockColor(product.stock),
                  border: `1px solid ${getStockColor(product.stock)}40`,
                  marginTop: 'auto'
                }}>
                  {product.stock === 0
                    ? '❌ Out of Stock'
                    : `⚠️ Only ${product.stock} left!`}
                </div>
                
                <Link
                  to={`/admin/products/edit/${product._id}`}
                  className="btn btn-primary"
                  style={{ width: '100%', textAlign: 'center', marginTop: '0.5rem' }}
                >
                  ✏️ Update Stock
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default LowStock