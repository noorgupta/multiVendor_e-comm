import ProductCard from '../components/ProductCard'
import { Link } from 'react-router-dom'

function Wishlist({ wishlist, toggleWishlist, isWishlisted }) {
  if (wishlist.length === 0) {
    return (
      <div className="page-center">
        <div className="form-container" style={{ margin: '0', textAlign: 'center', maxWidth: '500px' }}>
          <p style={{ fontSize: '4rem', marginBottom: '1rem' }}>💔</p>
          <h2 className="heading-2" style={{ marginBottom: '0.5rem' }}>Your Wishlist is Empty!</h2>
          <p className="text-muted mb-4">
            Looks like you haven't added anything yet.
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
        My Wishlist ({wishlist.length} items)
      </h1>
      <div className="grid-auto-fit">
      {wishlist.map((product) => (
        <ProductCard
        key={product._id}
        product={product}
        toggleWishlist={toggleWishlist}
        isWishlisted={isWishlisted(product._id)}
        />
        ))}
      </div>
    </div>
  )
}

export default Wishlist