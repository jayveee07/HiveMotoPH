import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { collection, getDocs, doc, updateDoc, deleteDoc, query, orderBy, where } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { FiPackage, FiShoppingCart, FiUsers, FiDollarSign, FiTool, FiTag, FiTruck, FiBarChart2, FiSettings, FiDatabase, FiCheck, FiAlertCircle, FiLoader, FiPlus, FiEdit2, FiTrash2, FiShield, FiUser, FiRefreshCw, FiFilter } from 'react-icons/fi'
import { useAuth } from '../../contexts/AuthContext'
import { formatCurrency, getStatusColor } from '../../lib/helpers'
import { seedAll } from '../../lib/seedDatabase'

const tabs = [
  { id: 'overview', label: 'Overview', icon: FiBarChart2 },
  { id: 'products', label: 'Products', icon: FiPackage },
  { id: 'orders', label: 'Orders', icon: FiShoppingCart },
  { id: 'services', label: 'Services', icon: FiTool },
  { id: 'bookings', label: 'Bookings', icon: FiTool },
  { id: 'customers', label: 'Users', icon: FiUsers },
  { id: 'coupons', label: 'Coupons', icon: FiTag },
  { id: 'inventory', label: 'Inventory', icon: FiTruck },
  { id: 'settings', label: 'Settings', icon: FiSettings },
]

export default function AdminDashboard() {
  const { currentUser } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'overview')
  const [seeding, setSeeding] = useState(false)
  const [logs, setLogs] = useState([])
  const [results, setResults] = useState(null)
  const [users, setUsers] = useState([])
  const [usersLoading, setUsersLoading] = useState(false)
  const [updatingUserId, setUpdatingUserId] = useState(null)
  const [userFilter, setUserFilter] = useState('all')
  const [adminStats, setAdminStats] = useState({ revenue: 0, orders: 0, products: 0, customers: 0 })
  const [adminOrders, setAdminOrders] = useState([])
  const [adminOrdersLoading, setAdminOrdersLoading] = useState(false)
  const [adminOrdersFilter, setAdminOrdersFilter] = useState('all')
  const [adminProducts, setAdminProducts] = useState([])
  const [adminProductsLoading, setAdminProductsLoading] = useState(false)
  const [dashLoading, setDashLoading] = useState(true)

  const log = (msg) => setLogs((prev) => [...prev, { text: msg, time: new Date().toLocaleTimeString() }])

  const fetchDashboardData = async () => {
    try {
      const [orderSnap, productSnap, userSnap] = await Promise.all([
        getDocs(collection(db, 'orders')),
        getDocs(collection(db, 'products')),
        getDocs(collection(db, 'users')),
      ])
      const allOrders = orderSnap.docs.map((d) => ({ id: d.id, ...d.data() }))
      const allProducts = productSnap.docs.map((d) => ({ id: d.id, ...d.data() }))
      const revenue = allOrders.filter((o) => ['delivered', 'completed'].includes(o.status)).reduce((s, o) => s + (o.total || 0), 0)
      setAdminStats({
        revenue,
        orders: allOrders.length,
        products: allProducts.filter((p) => (p.stock || 0) > 0).length,
        customers: userSnap.docs.length,
      })
      setAdminOrders(allOrders)
      setAdminProducts(allProducts)
    } catch (err) { console.error('Failed to fetch dashboard:', err) }
    setDashLoading(false)
  }

  useEffect(() => { fetchDashboardData() }, [])

  const handleSeed = async () => {
    if (seeding) return
    setSeeding(true)
    setLogs([])
    setResults(null)
    log('Starting database seeding...')
    try {
      const res = await seedAll(currentUser, (msg) => log(msg))
      setResults(res)
      log('Seeding complete!')
    } catch (err) {
      log(`Error: ${err.message}`)
    }
    setSeeding(false)
  }

  const fetchUsers = async () => {
    setUsersLoading(true)
    try {
      const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'))
      const snap = await getDocs(q)
      setUsers(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    } catch (err) {
      console.error('Failed to fetch users:', err)
    }
    setUsersLoading(false)
  }

  const handleRoleChange = async (userId, newRole) => {
    setUpdatingUserId(userId)
    try {
      const userRef = doc(db, 'users', userId)
      await updateDoc(userRef, { role: newRole, updatedAt: new Date().toISOString() })
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)))
    } catch (err) {
      alert('Failed to update role: ' + err.message)
    }
    setUpdatingUserId(null)
  }

  const handleDeleteUser = async (userId, email) => {
    if (!window.confirm(`Delete user "${email}"? This cannot be undone.`)) return
    try {
      await deleteDoc(doc(db, 'users', userId))
      setUsers((prev) => prev.filter((u) => u.id !== userId))
    } catch (err) {
      alert('Failed to delete user: ' + err.message)
    }
  }

  const filteredUsers = users.filter((u) => {
    if (userFilter === 'all') return true
    return u.role === userFilter
  })

  const [bookings, setBookings] = useState([])
  const [bookingsLoading, setBookingsLoading] = useState(false)
  const [bookingsFilter, setBookingsFilter] = useState('all')
  const [pendingOrderCount, setPendingOrderCount] = useState(0)
  const pendingCount = bookings.filter((b) => b.status === 'pending').length

  const fetchBookings = async () => {
    setBookingsLoading(true)
    try {
      const q = query(collection(db, 'bookings'), orderBy('date', 'desc'))
      const snap = await getDocs(q)
      setBookings(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    } catch (err) {
      console.error('Failed to fetch bookings:', err)
    }
    setBookingsLoading(false)
  }

  const filteredBookings = bookings.filter((b) => {
    if (bookingsFilter === 'all') return true
    return b.status === bookingsFilter
  })

  const handleBookingStatus = async (bookingId, status) => {
    try {
      const ref = doc(db, 'bookings', bookingId)
      await updateDoc(ref, { status, updatedAt: new Date().toISOString() })
      setBookings((prev) => prev.map((b) => (b.id === bookingId ? { ...b, status } : b)))
    } catch (err) {
      alert('Failed to update status: ' + err.message)
    }
  }

  const filteredAdminOrders = adminOrders.filter((o) => {
    if (adminOrdersFilter === 'all') return true
    return o.status === adminOrdersFilter
  })

  useEffect(() => {
    setPendingOrderCount(adminOrders.filter((o) => ['pending', 'processing'].includes(o.status)).length)
  }, [adminOrders])

  useEffect(() => {
    if (activeTab === 'customers') fetchUsers()
    if (activeTab === 'bookings') fetchBookings()
  }, [activeTab])

  const totalSeeded = results ? Object.values(results).reduce((a, b) => a + b, 0) : 0

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-hive-black dark:text-white">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage your HiveMoto PH store</p>
        </div>
        <div className="flex gap-2">
          <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-sm">
            <option>Today</option>
            <option>This Week</option>
            <option>This Month</option>
            <option>This Year</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-56 flex-shrink-0">
          <div className="card p-2 sticky top-24">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setSearchParams({ tab: tab.id }) }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-hive-yellow text-hive-black' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
              >
                <tab.icon /> {tab.label}
                {tab.id === 'orders' && pendingOrderCount > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                    {pendingOrderCount}
                  </span>
                )}
                {tab.id === 'bookings' && pendingCount > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                    {pendingCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {dashLoading ? (
                <div className="flex items-center justify-center py-16"><FiLoader className="animate-spin text-2xl text-gray-400" /></div>
              ) : (
                <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Total Revenue', value: formatCurrency(adminStats.revenue), icon: FiDollarSign, color: 'bg-green-100 text-green-600' },
                  { label: 'Total Orders', value: String(adminStats.orders), icon: FiShoppingCart, color: 'bg-blue-100 text-blue-600' },
                  { label: 'Active Products', value: String(adminStats.products), icon: FiPackage, color: 'bg-hive-yellow/20 text-hive-yellow' },
                  { label: 'Total Customers', value: String(adminStats.customers), icon: FiUsers, color: 'bg-purple-100 text-purple-600' },
                ].map((stat, i) => (
                  <div key={i} className="card p-5">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${stat.color}`}>
                      <stat.icon />
                    </div>
                    <p className="text-2xl font-bold text-hive-black dark:text-white">{stat.value}</p>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading text-lg font-bold text-hive-black dark:text-white">Recent Orders</h3>
                  <button onClick={() => setActiveTab('orders')} className="text-sm text-hive-yellow hover:underline">View All</button>
                </div>
                {adminOrders.length === 0 ? (
                  <p className="text-gray-500 text-sm py-4">No orders yet.</p>
                ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 font-medium text-gray-500">Order</th>
                        <th className="text-left py-3 font-medium text-gray-500">Customer</th>
                        <th className="text-left py-3 font-medium text-gray-500">Date</th>
                        <th className="text-left py-3 font-medium text-gray-500">Status</th>
                        <th className="text-right py-3 font-medium text-gray-500">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adminOrders.slice(0, 5).map((order) => (
                        <tr key={order.id} className="border-b border-gray-100 dark:border-gray-800">
                          <td className="py-3 font-medium text-hive-black dark:text-white">{order.orderNumber || order.id}</td>
                          <td className="py-3 text-gray-600 dark:text-gray-400">{order.shippingAddress?.firstName} {order.shippingAddress?.lastName || order.userEmail || '—'}</td>
                          <td className="py-3 text-gray-600 dark:text-gray-400">{order.createdAt?.toDate?.()?.toLocaleDateString?.() || order.createdAt?.split?.('T')[0] || '—'}</td>
                          <td className="py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>{order.status}</span>
                          </td>
                          <td className="py-3 text-right font-medium">{formatCurrency(order.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                )}
              </div>
              </>
            )}

            </div>
          )}

          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-2xl font-bold text-hive-black dark:text-white">Products</h2>
                <button className="btn-primary text-sm flex items-center gap-2" onClick={fetchDashboardData}><FiRefreshCw className={dashLoading ? 'animate-spin' : ''} /> Refresh</button>
              </div>
              <div className="card overflow-hidden">
                {adminProductsLoading || dashLoading ? (
                  <div className="flex items-center justify-center py-16"><FiLoader className="animate-spin text-2xl text-gray-400" /></div>
                ) : adminProducts.length === 0 ? (
                  <div className="text-center py-16 text-gray-500"><FiPackage className="text-4xl mx-auto mb-3 text-gray-300" /><p>No products yet. Run "Seed Database" in Settings.</p></div>
                ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Product</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Category</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-500">Price</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-500">Stock</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-500">Sales</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adminProducts.map((p) => (
                        <tr key={p.id} className="border-b border-gray-100 dark:border-gray-800">
                          <td className="py-3 px-4 font-medium text-hive-black dark:text-white">{p.name}</td>
                          <td className="py-3 px-4 text-gray-600 capitalize">{p.category}</td>
                          <td className="py-3 px-4 text-right">{formatCurrency(p.discountedPrice || p.price)}</td>
                          <td className="py-3 px-4 text-right">
                            <span className={(p.stock || 0) < 11 ? 'text-red-500 font-medium' : ''}>{p.stock || 0}</span>
                          </td>
                          <td className="py-3 px-4 text-right">{p.salesCount || 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-2xl font-bold text-hive-black dark:text-white">Order Management</h2>
                <button onClick={fetchDashboardData} className="btn-secondary text-sm flex items-center gap-2"><FiRefreshCw className={dashLoading ? 'animate-spin' : ''} /> Refresh</button>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <FiFilter className="text-gray-400" size={16} />
                {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((f) => (
                  <button key={f} onClick={() => setAdminOrdersFilter(f)}
                    className={`px-3 py-1.5 text-sm rounded-lg border transition-colors capitalize ${adminOrdersFilter === f ? 'bg-hive-yellow border-hive-yellow text-hive-black' : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                    {f === 'all' ? 'All' : f}
                  </button>
                ))}
                <span className="text-xs text-gray-400 ml-auto">{filteredAdminOrders.length} of {adminOrders.length} orders</span>
              </div>
              <div className="card overflow-hidden">
                {dashLoading ? (
                  <div className="flex items-center justify-center py-16"><FiLoader className="animate-spin text-2xl text-gray-400" /></div>
                ) : filteredAdminOrders.length === 0 ? (
                  <div className="text-center py-16 text-gray-500"><FiShoppingCart className="text-4xl mx-auto mb-3 text-gray-300" /><p>No orders found</p></div>
                ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Order</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Customer</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Date</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-500">Total</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-500">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAdminOrders.map((order) => (
                        <tr key={order.id} className="border-b border-gray-100 dark:border-gray-800">
                          <td className="py-3 px-4 font-medium text-xs">{order.orderNumber || order.id}</td>
                          <td className="py-3 px-4 text-gray-600 text-sm">
                            <span>{order.shippingAddress?.firstName} {order.shippingAddress?.lastName || order.userEmail || '—'}</span>
                          </td>
                          <td className="py-3 px-4 text-gray-500 text-xs">{order.createdAt?.toDate?.()?.toLocaleDateString?.() || order.createdAt?.split?.('T')[0] || '—'}</td>
                          <td className="py-3 px-4">
                            <select
                              value={order.status || 'pending'}
                              onChange={(e) => {
                                const ref = doc(db, 'orders', order.id)
                                updateDoc(ref, { status: e.target.value, updatedAt: new Date().toISOString() })
                                setAdminOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status: e.target.value } : o)))
                              }}
                              className="text-xs border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 bg-white dark:bg-gray-800"
                            >
                              <option value="pending">Pending</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="py-3 px-4 text-right font-medium">{formatCurrency(order.total || 0)}</td>
                          <td className="py-3 px-4 text-right">
                            <button onClick={async () => {
                              if (window.confirm(`Delete order ${order.orderNumber || order.id}?`)) {
                                await deleteDoc(doc(db, 'orders', order.id))
                                setAdminOrders((prev) => prev.filter((o) => o.id !== order.id))
                              }
                            }} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded" title="Delete order">
                              <FiTrash2 className="text-red-500" size={15} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="card p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-hive-yellow/10 rounded-xl flex items-center justify-center">
                  <FiDatabase className="text-2xl text-hive-yellow" />
                </div>
                <div>
                  <h2 className="font-heading text-2xl font-bold text-hive-black dark:text-white">Database Setup</h2>
                  <p className="text-gray-500 text-sm mt-1">Seed Firestore with initial app data</p>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <FiAlertCircle className="text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-yellow-700 dark:text-yellow-300">
                    <p className="font-medium mb-1">This action will write seed data to Firestore.</p>
                    <p>Collections that already have documents will be skipped. Run this only once during initial setup.</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSeed}
                disabled={seeding}
                className="btn-primary flex items-center gap-2 disabled:opacity-50"
              >
                {seeding ? (
                  <><FiLoader className="animate-spin" /> Seeding in progress...</>
                ) : (
                  <><FiDatabase /> Seed Database</>
                )}
              </button>

              {results && (
                <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-400 font-medium mb-2">
                    <FiCheck /> {totalSeeded} documents written
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-green-600 dark:text-green-500">
                    {Object.entries(results).map(([col, count]) => (
                      <div key={col} className="flex items-center gap-2">
                        <FiCheck className="flex-shrink-0" size={12} />
                        <span className="capitalize">{col.replace(/-/g, ' ')}</span>
                        <span className="ml-auto font-medium">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {logs.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold text-hive-black dark:text-white mb-2">Log</h3>
                  <div className="bg-gray-900 text-gray-100 rounded-xl p-4 max-h-64 overflow-y-auto font-mono text-xs leading-relaxed">
                    {logs.map((entry, i) => (
                      <div key={i} className="flex gap-2">
                        <span className="text-gray-500 flex-shrink-0">[{entry.time}]</span>
                        <span>{entry.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'customers' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-2xl font-bold text-hive-black dark:text-white">User Management</h2>
                <button onClick={fetchUsers} className="btn-secondary text-sm flex items-center gap-2">
                  <FiRefreshCw className={usersLoading ? 'animate-spin' : ''} /> Refresh
                </button>
              </div>

              <div className="flex items-center gap-2">
                <FiFilter className="text-gray-400" size={16} />
                {['all', 'admin', 'customer'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setUserFilter(f)}
                    className={`px-3 py-1.5 text-sm rounded-lg border transition-colors capitalize ${userFilter === f ? 'bg-hive-yellow border-hive-yellow text-hive-black' : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                  >
                    {f === 'all' ? 'All Users' : `${f}s`}
                  </button>
                ))}
                <span className="text-xs text-gray-400 ml-auto">
                  {filteredUsers.length} of {users.length} users
                </span>
              </div>

              <div className="card overflow-hidden">
                {usersLoading ? (
                  <div className="flex items-center justify-center py-16">
                    <FiLoader className="animate-spin text-2xl text-gray-400" />
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="text-center py-16 text-gray-500">
                    <FiUsers className="text-4xl mx-auto mb-3 text-gray-300" />
                    <p>No {userFilter === 'all' ? '' : userFilter + ' '}users found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                          <th className="text-left py-3 px-4 font-medium text-gray-500">User</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-500">Email</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-500">Role</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-500">Joined</th>
                          <th className="text-right py-3 px-4 font-medium text-gray-500">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((u) => (
                          <tr key={u.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-hive-yellow/20 flex items-center justify-center text-sm font-bold text-hive-yellow">
                                  {(u.displayName || u.email || '?')[0].toUpperCase()}
                                </div>
                                <span className="font-medium text-hive-black dark:text-white">{u.displayName || '—'}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{u.email}</td>
                            <td className="py-3 px-4">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${u.role === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
                                {u.role === 'admin' ? <FiShield size={12} /> : <FiUser size={12} />}
                                {u.role || 'customer'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-gray-500 text-xs">
                              {u.createdAt ? new Date(u.createdAt?.toDate?.() || u.createdAt).toLocaleDateString() : '—'}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                {u.id === currentUser?.uid ? (
                                  <span className="text-xs text-gray-400 italic">You</span>
                                ) : (
                                  <>
                                    <button
                                      onClick={() => handleRoleChange(u.id, u.role === 'admin' ? 'customer' : 'admin')}
                                      disabled={updatingUserId === u.id}
                                      className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors disabled:opacity-50 ${u.role === 'admin' ? 'border-orange-300 text-orange-600 hover:bg-orange-50 dark:border-orange-700 dark:text-orange-400 dark:hover:bg-orange-900/20' : 'border-purple-300 text-purple-600 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-400 dark:hover:bg-purple-900/20'}`}
                                    >
                                      {updatingUserId === u.id ? (
                                        <FiLoader className="animate-spin inline" />
                                      ) : u.role === 'admin' ? (
                                        'Remove Admin'
                                      ) : (
                                        'Make Admin'
                                      )}
                                    </button>
                                    <button
                                      onClick={() => handleDeleteUser(u.id, u.email)}
                                      className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                                      title="Delete user"
                                    >
                                      <FiTrash2 className="text-red-500" size={15} />
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-2xl font-bold text-hive-black dark:text-white">Booking Management</h2>
                <button onClick={fetchBookings} className="btn-secondary text-sm flex items-center gap-2">
                  <FiRefreshCw className={bookingsLoading ? 'animate-spin' : ''} /> Refresh
                </button>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <FiFilter className="text-gray-400" size={16} />
                {['all', 'pending', 'confirmed', 'in-progress', 'completed', 'cancelled'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setBookingsFilter(f)}
                    className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${bookingsFilter === f ? 'bg-hive-yellow border-hive-yellow text-hive-black' : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                  >
                    {f === 'all' ? 'All' : f === 'in-progress' ? 'In Progress' : f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
                <span className="text-xs text-gray-400 ml-auto">
                  {filteredBookings.length} of {bookings.length} bookings
                </span>
              </div>

              <div className="card overflow-hidden">
                {bookingsLoading ? (
                  <div className="flex items-center justify-center py-16">
                    <FiLoader className="animate-spin text-2xl text-gray-400" />
                  </div>
                ) : filteredBookings.length === 0 ? (
                  <div className="text-center py-16 text-gray-500">
                    <FiTool className="text-4xl mx-auto mb-3 text-gray-300" />
                    <p>No {bookingsFilter === 'all' ? '' : bookingsFilter + ' '}bookings found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                          <th className="text-left py-3 px-4 font-medium text-gray-500">Booking</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-500">Customer</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-500">Service</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-500">Date / Time</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-500">Motorcycle</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredBookings.map((b) => (
                          <tr key={b.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50">
                            <td className="py-3 px-4 font-medium text-hive-black dark:text-white text-xs">{b.bookingNumber || b.id}</td>
                            <td className="py-3 px-4">
                              <div>
                                <p className="font-medium text-hive-black dark:text-white">{b.customerName}</p>
                                <p className="text-xs text-gray-500">{b.email}</p>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{b.serviceName}</td>
                            <td className="py-3 px-4">
                              <p className="text-hive-black dark:text-white">{b.date}</p>
                              <p className="text-xs text-gray-500">{b.time}</p>
                            </td>
                            <td className="py-3 px-4 text-gray-600 dark:text-gray-400 text-xs">{b.motorcycleModel} ({b.motorcycleYear})</td>
                            <td className="py-3 px-4">
                              <select
                                value={b.status || 'pending'}
                                onChange={(e) => handleBookingStatus(b.id, e.target.value)}
                                className="text-xs border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 bg-white dark:bg-gray-800 text-hive-black dark:text-white"
                              >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {(activeTab === 'services' || activeTab === 'coupons' || activeTab === 'inventory') && (
            <div className="card p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiPackage className="text-2xl text-gray-400" />
              </div>
              <h3 className="font-heading text-xl font-bold text-hive-black dark:text-white mb-2 capitalize">{activeTab} Management</h3>
              <p className="text-gray-500">This section is ready for Firebase integration.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
