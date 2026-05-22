import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

function Cart({ setCartCount }) {
  const [cartItems, setCartItems] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [placingOrder, setPlacingOrder] = useState(false)
  const [orderMessage, setOrderMessage] = useState(null)

  const { token, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user || !token) {
      navigate('/login')
      return
    }
    fetchCart()
  }, [user, token])

  const fetchCart = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/cart`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setCartItems(response.data.cartItems || [])
      setTotal(response.data.total || 0)
      setCartCount(response.data.itemCount || 0)
      setLoading(false)
    } catch (error) {
      setError('Failed to load cart!')
      setLoading(false)
    }
  }

  const updateQuantity = (cartItemId, action) => {
    const updatedItems = cartItems.map((item) => {
      if (item._id === cartItemId) {
        const newQuantity = action === 'increase' ? item.quantity + 1 : Math.max(1, item.quantity - 1)
        return { ...item, quantity: newQuantity }
      }
      return item
    })

    setCartItems(updatedItems)

    const newTotal = updatedItems.reduce((acc, item) => {
      return acc + item.product.price * item.quantity
    }, 0)
    setTotal(newTotal)
    setCartCount(updatedItems.length)

    axios.patch(
      `${import.meta.env.VITE_API_URL}/api/cart/${cartItemId}`,
      { action },
      { headers: { Authorization: `Bearer ${token}` } }
    ).catch(() => fetchCart())
  }

  const removeItem = (cartItemId) => {
    const updatedItems = cartItems.filter((item) => item._id !== cartItemId)
    setCartItems(updatedItems)

    const newTotal = updatedItems.reduce((acc, item) => {
      return acc + item.product.price * item.quantity
    }, 0)
    setTotal(newTotal)
    setCartCount(updatedItems.length)

    axios.delete(
      `${import.meta.env.VITE_API_URL}/api/cart/${cartItemId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    ).catch(() => fetchCart())
  }

  const handlePlaceOrder = async () => {
    try {
      setPlacingOrder(true)
      setOrderMessage(null)

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/orders`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )

      setOrderMessage('✅ Order placed successfully!')
      setCartItems([])
      setTotal(0)
      setCartCount(0)

      setTimeout(() => {
        navigate('/orders')
      }, 1500)

    } catch (error) {
      setOrderMessage(`❌ ${error.response?.data?.message || 'Failed to place order!'}`)
    } finally {
      setPlacingOrder(false)
    }
  }

  if (loading) {
    return (
      <div className="page-center">
        <h2 className="heading-2 text-muted">⏳ Loading cart...</h2>
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

  if (cartItems.length === 0) {
    return (
      <div className="page-center">
        <div className="form-container" style={{ margin: '0', textAlign: 'center', maxWidth: '500px' }}>
          <p style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</p>
          <h2 className="heading-2" style={{ marginBottom: '0.5rem' }}>Your Cart is Empty!</h2>
          <p className="text-muted mb-4">Add some products to your cart</p>
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
        My Cart ({cartItems.length} items)
      </h1>
      
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap', justifyContent: 'center' }}>
        
        <div style={{ flex: '1', minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {cartItems.map((item) => {
            if (!item.product) return null

            return (
              <div key={item._id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap', padding: '1.25rem' }}>
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                  onError={(e) => { e.target.src = 'https://placehold.co/80x80/151A23/4f46e5?text=No+Image' }}
                />
                
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.25rem' }}>{item.product.name}</h3>
                  <p className="text-muted" style={{ fontSize: '0.9rem' }}>
                    ₹{item.product.price.toLocaleString()}
                  </p>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--bg-gray)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                  <button
                    onClick={() => updateQuantity(item._id, 'decrease')}
                    style={{ background: 'transparent', color: 'var(--text-main)', border: 'none', fontSize: '1.25rem', cursor: 'pointer', padding: '0 0.5rem' }}
                  >
                    −
                  </button>
                  <span style={{ fontWeight: 'bold', minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item._id, 'increase')}
                    style={{ background: 'transparent', color: 'var(--text-main)', border: 'none', fontSize: '1.25rem', cursor: 'pointer', padding: '0 0.5rem' }}
                  >
                    +
                  </button>
                </div>
                
                <p style={{ color: 'var(--primary)', fontSize: '1.1rem', fontWeight: '700', minWidth: '100px', textAlign: 'right' }}>
                  ₹{(item.product.price * item.quantity).toLocaleString()}
                </p>
                
                <button
                  onClick={() => removeItem(item._id)}
                  style={{ background: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer', padding: '0.5rem' }}
                >
                  🗑️
                </button>
              </div>
            )
          })}
        </div>

        <div className="card" style={{ width: '320px', padding: '1.75rem', position: 'sticky', top: '100px' }}>
          <h2 className="heading-3" style={{ marginBottom: '1.5rem' }}>Order Summary</h2>
          <div className="flex-between mb-3">
            <span className="text-muted">Items:</span>
            <span style={{ fontWeight: '600' }}>{cartItems.length}</span>
          </div>
          <div className="flex-between mb-4">
            <span className="text-muted">Total:</span>
            <span style={{ color: 'var(--primary)', fontSize: '1.5rem', fontWeight: '700' }}>
              ₹{total.toLocaleString()}
            </span>
          </div>
          <button                                    
            onClick={handlePlaceOrder}
            disabled={placingOrder}
            className="btn btn-primary"
            style={{ width: '100%', opacity: placingOrder ? 0.7 : 1, padding: '1rem' }}
          >
            {placingOrder ? '⏳ Placing Order...' : '🛒 Place Order'}
          </button>
          {orderMessage && (
            <p className="text-center mt-3" style={{ color: orderMessage.includes('❌') ? 'var(--error)' : 'var(--success)', fontWeight: '600', fontSize: '0.9rem' }}>
              {orderMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Cart