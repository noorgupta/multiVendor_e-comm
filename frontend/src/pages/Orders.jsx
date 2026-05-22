import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const { token, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user || !token) {
      navigate('/login')
      return
    }
    fetchOrders()
  }, [user, token])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/orders`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setOrders(response.data.orders || [])
    } catch (error) {
      setError('Failed to load orders!')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#f59e0b' // Amber
      case 'processing': return '#3b82f6' // Blue
      case 'shipped': return '#8b5cf6' // Purple
      case 'delivered': return '#10b981' // Emerald
      case 'cancelled': return '#ef4444' // Red
      default: return '#9ca3af' // Gray
    }
  }

  const getStatusEmoji = (status) => {
    switch (status) {
      case 'pending': return '⏳'
      case 'processing': return '⚙️'
      case 'shipped': return '🚚'
      case 'delivered': return '✅'
      case 'cancelled': return '❌'
      default: return '📦'
    }
  }

  if (loading) {
    return (
      <div className="page-center">
        <h2 className="heading-2 text-muted">⏳ Loading orders...</h2>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page-center">
        <h2 className="heading-2 text-error">{error}</h2>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="page-center">
        <div className="form-container" style={{ margin: '0', textAlign: 'center', maxWidth: '500px' }}>
          <p style={{ fontSize: '4rem', marginBottom: '1rem' }}>📦</p>
          <h2 className="heading-2" style={{ marginBottom: '0.5rem' }}>No Orders Yet!</h2>
          <p className="text-muted mb-4">
            You haven't placed any orders yet.
          </p>
          <Link to='/' className="btn btn-primary" style={{ display: 'inline-block' }}>
            🛍️ Start Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container" style={{ minHeight: 'calc(100vh - 70px)' }}>
      <h1 className="heading-1 text-center" style={{ marginBottom: '3rem' }}>
        My Orders ({orders.length})
      </h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>
        {orders.map((order) => (
          <div key={order._id} className="card">

            <div className="flex-between" style={{ marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                  Order ID: <span style={{ color: 'var(--text-main)', fontWeight: '600', fontFamily: 'monospace', letterSpacing: '1px' }}>
                    #{order._id.slice(-8).toUpperCase()}
                  </span>
                </p>
                <p className="text-muted" style={{ fontSize: '0.85rem' }}>
                  📅 {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <span style={{
                padding: '0.35rem 0.8rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                fontWeight: '700',
                letterSpacing: '0.05em',
                backgroundColor: getStatusColor(order.orderStatus) + '20',
                color: getStatusColor(order.orderStatus),
                border: `1px solid ${getStatusColor(order.orderStatus)}40`,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}>
                {getStatusEmoji(order.orderStatus)} {order.orderStatus.toUpperCase()}
              </span>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '1rem 0' }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {order.products.map((item, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {item.product ? (
                    <>
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                        onError={(e) => {
                          e.target.src = 'https://placehold.co/60x60/151A23/4f46e5?text=No+Image'
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', fontWeight: '600', marginBottom: '0.15rem' }}>{item.product.name}</p>
                        <p className="text-muted" style={{ fontSize: '0.85rem' }}>
                          Qty: {item.quantity} × ₹{item.price.toLocaleString()}
                        </p>
                      </div>
                      <p style={{ color: 'var(--text-main)', fontSize: '1rem', fontWeight: '700' }}>
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </>
                  ) : (
                    <p className="text-muted" style={{ fontStyle: 'italic', fontSize: '0.9rem' }}>Product no longer available</p>
                  )}
                </div>
              ))}
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '1rem 0' }} />

            <div className="flex-between">
              <p className="text-muted" style={{ fontSize: '0.9rem' }}>
                {order.products.length} item{order.products.length > 1 ? 's' : ''}
              </p>
              <p className="text-muted" style={{ fontSize: '1rem' }}>
                Total: <span style={{ color: 'var(--primary)', fontSize: '1.25rem', fontWeight: '700', marginLeft: '0.5rem' }}>
                  ₹{order.totalAmount.toLocaleString()}
                </span>
              </p>
            </div>

          </div>
        ))}
      </div>
    </div>
  )
}

export default Orders