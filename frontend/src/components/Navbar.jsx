import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ShoppingBag, Home, Heart, ShoppingCart, Package, Settings, LogOut, User, LogIn, UserPlus } from 'lucide-react'
import { motion } from 'framer-motion'

function Navbar({ wishlist, cartCount }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="navbar" 
      style={{ 
        borderBottom: '1px solid #444', 
        background: '#3f3f46', /* Dark gray to match screenshot */
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}
    >
      <div className="container flex-between" style={{ paddingTop: '0', paddingBottom: '0', minHeight: '70px', maxWidth: '1400px' }}>
        
        {/* LOGO */}
        <Link to="/" className="nav-brand" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.4rem', fontWeight: '700', color: '#fff', letterSpacing: '0.5px' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, #27272a, #18181b)', 
            padding: '0.4rem', 
            borderRadius: '8px', 
            display: 'flex', 
            border: '1px solid #52525b',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}>
            <ShoppingBag size={20} color="#fff" />
          </div>
          <span>ShopApp</span>
        </Link>
        
        {/* NAVIGATION LINKS */}
        <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          
          <Link to='/' className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: isActive('/') ? '#fff' : '#a1a1aa', position: 'relative' }}>
            <Home size={18} />
            <span style={{ fontWeight: isActive('/') ? '600' : '500' }}>Home</span>
            {isActive('/') && <motion.div layoutId="nav-pill" style={{ position: 'absolute', bottom: '-23px', left: 0, right: 0, height: '3px', background: '#fff', borderRadius: '3px 3px 0 0' }} />}
          </Link>

          <Link to='/wishlist' className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', position: 'relative', color: isActive('/wishlist') ? '#fff' : '#a1a1aa' }}>
            <Heart size={18} />
            <span style={{ fontWeight: isActive('/wishlist') ? '600' : '500' }}>Wishlist</span>
            {isActive('/wishlist') && <motion.div layoutId="nav-pill" style={{ position: 'absolute', bottom: '-23px', left: 0, right: 0, height: '3px', background: '#fff', borderRadius: '3px 3px 0 0' }} />}
            {wishlist.length > 0 && (
              <motion.span 
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                style={{ position: 'absolute', top: '-8px', right: '-15px', padding: '0.1rem 0.35rem', fontSize: '0.7rem', background: '#71717a', color: '#fff', borderRadius: '50%', fontWeight: 'bold' }}
              >
                {wishlist.length}
              </motion.span>
            )}
          </Link>

          {user ? (
            <>
              <Link to='/cart' className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', position: 'relative', color: isActive('/cart') ? '#fff' : '#a1a1aa' }}>
                <ShoppingCart size={18} />
                <span style={{ fontWeight: isActive('/cart') ? '600' : '500' }}>Cart</span>
                {isActive('/cart') && <motion.div layoutId="nav-pill" style={{ position: 'absolute', bottom: '-23px', left: 0, right: 0, height: '3px', background: '#fff', borderRadius: '3px 3px 0 0' }} />}
                {cartCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    style={{ position: 'absolute', top: '-8px', right: '-15px', padding: '0.1rem 0.35rem', fontSize: '0.7rem', background: '#71717a', color: '#fff', borderRadius: '50%', fontWeight: 'bold' }}
                  >
                    {cartCount}
                  </motion.span>
                )}
              </Link>
              
              <Link to='/orders' className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: isActive('/orders') ? '#fff' : '#a1a1aa', position: 'relative' }}>
                <Package size={18} />
                <span style={{ fontWeight: isActive('/orders') ? '600' : '500' }}>Orders</span>
                {isActive('/orders') && <motion.div layoutId="nav-pill" style={{ position: 'absolute', bottom: '-23px', left: 0, right: 0, height: '3px', background: '#fff', borderRadius: '3px 3px 0 0' }} />}
              </Link>

              <div style={{ width: '1px', height: '24px', background: '#52525b', margin: '0 0.5rem' }}></div>

              {user.role === 'admin' && (
                <Link to='/admin' className="btn btn-secondary nav-btn" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', color: '#fff', borderColor: '#52525b' }}>
                  <Settings size={16} />
                  Admin
                </Link>
              )}
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff', fontSize: '0.95rem', fontWeight: '500', marginLeft: '0.5rem' }}>
                <div style={{ background: '#52525b', padding: '0.4rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={16} color="#fff" />
                </div>
                {user.name}
              </div>
              
              <motion.button 
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout} 
                className="btn nav-btn" 
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', padding: '0.4rem 1rem', transition: 'all 0.2s', borderRadius: 'var(--radius-full)' }}
              >
                <LogOut size={16} />
                Logout
              </motion.button>
            </>
          ) : (
            <>
              <div style={{ width: '1px', height: '24px', background: '#52525b', margin: '0 0.5rem' }}></div>
              <Link to='/login' className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff' }}>
                <LogIn size={18} />
                <span>Login</span>
              </Link>
              <Link to='/register' className="btn btn-primary nav-btn" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', background: '#fff', color: '#000', border: 'none' }}>
                <UserPlus size={18} />
                <span>Register</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  )
}

export default Navbar