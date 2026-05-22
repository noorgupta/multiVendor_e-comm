import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockProducts: 0,
    outOfStockProducts: 0,
    totalOrders: 0,
  })
  const [loading, setLoading] = useState(true)
  const { token } = useAuth()

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [productsRes, lowStockRes, ordersRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/api/products`),
        axios.get(`${import.meta.env.VITE_API_URL}/api/products/low-stock`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${import.meta.env.VITE_API_URL}/api/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])

      setStats({
        totalProducts: productsRes.data.pagination.total,
        lowStockProducts: lowStockRes.data.products.filter(p => p.stock > 0).length,
        outOfStockProducts: lowStockRes.data.products.filter(p => p.stock === 0).length,
        totalOrders: ordersRes.data.count,
      })
    } catch (error) {
      console.log('Stats error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="page-center">
        <h2 className="heading-2 text-muted">⏳ Loading dashboard...</h2>
      </div>
    )
  }

  return (
    <div className="container" style={{ minHeight: 'calc(100vh - 70px)' }}>
      <h1 className="heading-1 text-center" style={{ marginBottom: '3rem' }}>Admin Dashboard</h1>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '3rem' }}>
        <div className="card" style={{ borderTop: '4px solid #3b82f6', minWidth: '200px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-main)', fontSize: '2.5rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>{stats.totalProducts}</p>
          <p className="text-muted" style={{ margin: 0, fontSize: '0.9rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Products</p>
        </div>
        <div className="card" style={{ borderTop: '4px solid #f59e0b', minWidth: '200px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-main)', fontSize: '2.5rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>{stats.lowStockProducts}</p>
          <p className="text-muted" style={{ margin: 0, fontSize: '0.9rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Low Stock</p>
        </div>
        <div className="card" style={{ borderTop: '4px solid #ef4444', minWidth: '200px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-main)', fontSize: '2.5rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>{stats.outOfStockProducts}</p>
          <p className="text-muted" style={{ margin: 0, fontSize: '0.9rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Out of Stock</p>
        </div>
        <div className="card" style={{ borderTop: '4px solid #10b981', minWidth: '200px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-main)', fontSize: '2.5rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>{stats.totalOrders}</p>
          <p className="text-muted" style={{ margin: 0, fontSize: '0.9rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Orders</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to='/admin/products' className="card" style={{ width: '220px', textAlign: 'center', transition: 'var(--transition)' }}>
          <p style={{ fontSize: '2.5rem', margin: '0 0 0.75rem 0' }}>📦</p>
          <h3 className="heading-3" style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Manage Products</h3>
          <p className="text-muted" style={{ fontSize: '0.85rem' }}>View, edit and delete products</p>
        </Link>
        <Link to='/admin/products/add' className="card" style={{ width: '220px', textAlign: 'center', transition: 'var(--transition)' }}>
          <p style={{ fontSize: '2.5rem', margin: '0 0 0.75rem 0' }}>➕</p>
          <h3 className="heading-3" style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Add Product</h3>
          <p className="text-muted" style={{ fontSize: '0.85rem' }}>Add new product to store</p>
        </Link>
        <Link to='/admin/products/low-stock' className="card" style={{ width: '220px', textAlign: 'center', transition: 'var(--transition)' }}>
          <p style={{ fontSize: '2.5rem', margin: '0 0 0.75rem 0' }}>⚠️</p>
          <h3 className="heading-3" style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Low Stock</h3>
          <p className="text-muted" style={{ fontSize: '0.85rem' }}>Products running low</p>
        </Link>
      </div>
    </div>
  )
}

export default AdminDashboard
