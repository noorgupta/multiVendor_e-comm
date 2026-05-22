import { useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { ShoppingCart, Heart } from 'lucide-react'

function ProductCard({ product, toggleWishlist, isWishlisted, setCartCount }) {
  const [addingToCart, setAddingToCart] = useState(false)

  const { token, user } = useAuth()
  const navigate = useNavigate()

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login')
      return
    }

    setAddingToCart(true)

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/cart`,
        { productId: product._id },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (setCartCount) {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setCartCount(response.data.itemCount)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setAddingToCart(false)
    }
  }

  return (
    <div className="card-minimal">
      <div className="product-img-wrapper-minimal">
        <img
          src={product.image}
          alt={product.name}
          className="product-img-minimal"
          onError={(e) => {
            e.target.src = 'https://placehold.co/300x400/f3f4f6/111827?text=No+Image'
          }}
        />
        <button
          onClick={() => toggleWishlist(product)}
          style={{
            position: 'absolute',
            top: '0.75rem',
            right: '0.75rem',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            zIndex: 10
          }}
        >
          <Heart size={20} color={isWishlisted ? '#ef4444' : '#111827'} fill={isWishlisted ? '#ef4444' : 'none'} />
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '0 0.5rem' }}>
        <div style={{ flex: 1, paddingRight: '1rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.2rem' }}>
            {product.name}
          </h3>
          <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>
            ₹{product.price.toLocaleString()}
          </p>
        </div>
        
        <button
          onClick={handleAddToCart}
          disabled={addingToCart || product.stock === 0}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: addingToCart || product.stock === 0 ? 'not-allowed' : 'pointer',
            opacity: addingToCart || product.stock === 0 ? 0.5 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0.5rem'
          }}
          title={product.stock === 0 ? "Out of stock" : "Add to cart"}
        >
          {addingToCart ? (
            <div style={{ width: 18, height: 18, border: '2px solid var(--text-main)', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          ) : (
            <ShoppingCart size={22} color="var(--text-main)" />
          )}
        </button>
      </div>
      
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}

export default ProductCard