import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { collection, getDocs, query, where, orderBy, doc, updateDoc } from 'firebase/firestore'
import { updatePassword } from 'firebase/auth'
import { db, auth } from '../../lib/firebase'
import { FiUser, FiShoppingBag, FiTool, FiHeart, FiStar, FiLogOut, FiMapPin, FiPackage, FiClock, FiSettings, FiChevronDown, FiCheck } from 'react-icons/fi'
import { useAuth } from '../../contexts/AuthContext'
import { useWishlist } from '../../contexts/WishlistContext'
import { formatCurrency, formatDate, getStatusColor } from '../../lib/helpers'
import toast from 'react-hot-toast'

const tabs = [
  { id: 'overview', label: 'Overview', icon: FiPackage },
  { id: 'orders', label: 'Orders', icon: FiShoppingBag },
  { id: 'bookings', label: 'Bookings', icon: FiTool },
  { id: 'wishlist', label: 'Wishlist', icon: FiHeart },
  { id: 'reviews', label: 'Reviews', icon: FiStar },
  { id: 'addresses', label: 'Addresses', icon: FiMapPin },
  { id: 'profile', label: 'Profile', icon: FiUser },
]

export default function DashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = searchParams.get('tab') || 'overview'
  const { currentUser, userProfile, logout } = useAuth()
  const { wishlist } = useWishlist()

  const [orders, setOrders] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedOrder, setExpandedOrder] = useState(null)

  const orderSteps = ['pending', 'processing', 'shipped', 'delivered']
  const getOrderStepIndex = (status) => orderSteps.indexOf(status)

  const [profile, setProfile] = useState({
    displayName: userProfile?.displayName || currentUser?.displayName || '',
    email: currentUser?.email || '',
    phone: userProfile?.phone || '',
  })
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' })

  useEffect(() => {
    const fetch = async () => {
      if (!currentUser) return
      try {
        const [orderSnap, bookingSnap] = await Promise.all([
          getDocs(query(collection(db, 'orders'), where('userId', '==', currentUser.uid), orderBy('createdAt', 'desc'))),
          getDocs(query(collection(db, 'bookings'), where('userId', '==', currentUser.uid), orderBy('date', 'desc'))),
        ])
        setOrders(orderSnap.docs.map((d) => ({ id: d.id, ...d.data() })))
        setBookings(bookingSnap.docs.map((d) => ({ id: d.id, ...d.data() })))
      } catch (err) { console.error('Failed to fetch data:', err) }
      setLoading(false)
    }
    fetch()
  }, [currentUser])

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return
    try {
      await updateDoc(doc(db, 'orders', orderId), { status: 'cancelled', updatedAt: new Date().toISOString() })
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: 'cancelled' } : o)))
      toast.success('Order cancelled')
    } catch (err) { toast.error('Failed to cancel order') }
  }

  const handleProfileSave = async (e) => {
    e.preventDefault()
    if (!currentUser) return
    try {
      const ref = doc(db, 'users', currentUser.uid)
      await updateDoc(ref, { displayName: profile.displayName, phone: profile.phone, updatedAt: new Date().toISOString() })
      toast.success('Profile updated!')
    } catch (err) { toast.error('Failed to update profile: ' + err.message) }
  }

  const handlePasswordUpdate = async (e) => {
    e.preventDefault()
    if (passwords.newPass !== passwords.confirm) return toast.error('Passwords do not match')
    if (passwords.newPass.length < 6) return toast.error('Password must be at least 6 characters')
    try {
      await updatePassword(auth.currentUser, passwords.newPass)
      toast.success('Password updated!')
      setPasswords({ current: '', newPass: '', confirm: '' })
    } catch (err) { toast.error(err.message) }
  }

  const activeOrders = orders.filter((o) => ['pending', 'processing', 'shipped'].includes(o.status)).length
  const upcomingBookings = bookings.filter((b) => ['pending', 'confirmed'].includes(b.status)).length

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-400">Loading...</div>

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 bg-hive-yellow rounded-full flex items-center justify-center text-xl font-bold text-hive-black">
          {(userProfile?.displayName || currentUser?.email || '?')[0].toUpperCase()}
        </div>
        <div>
          <h1 className="font-heading text-2xl font-bold text-hive-black dark:text-white">
            {userProfile?.displayName || 'My Account'}
          </h1>
          <p className="text-sm text-gray-500">{currentUser?.email}</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-64 flex-shrink-0">
          <div className="card p-2 sticky top-24">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSearchParams({ tab: tab.id })}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-hive-yellow text-hive-black' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
              >
                <tab.icon /> {tab.label}
              </button>
            ))}
            <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 mt-2">
              <FiLogOut /> Sign Out
            </button>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Active Orders', value: String(activeOrders), icon: FiShoppingBag, color: 'text-blue-600 bg-blue-100' },
                  { label: 'Upcoming Appointments', value: String(upcomingBookings), icon: FiTool, color: 'text-hive-orange bg-orange-100' },
                  { label: 'Wishlist Items', value: String(wishlist.length), icon: FiHeart, color: 'text-red-500 bg-red-100' },
                  { label: 'Total Orders', value: String(orders.length), icon: FiPackage, color: 'text-hive-yellow bg-yellow-100' },
                ].map((stat, i) => (
                  <div key={i} className="card p-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${stat.color}`}>
                      <stat.icon />
                    </div>
                    <p className="text-2xl font-bold text-hive-black dark:text-white">{stat.value}</p>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="card p-6">
                <h3 className="font-semibold text-hive-black dark:text-white mb-4">Recent Orders</h3>
                {orders.length === 0 ? (
                  <p className="text-gray-500 text-sm">No orders yet.</p>
                ) : orders.slice(0, 3).map((order) => (
                  <div key={order.id} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
                    <div>
                      <p className="font-medium text-sm text-hive-black dark:text-white">{order.orderNumber || order.id}</p>
                      <p className="text-xs text-gray-500">{formatDate(order.createdAt?.toDate?.() || order.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>{order.status}</span>
                      <p className="text-sm font-medium mt-1">{formatCurrency(order.total)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="card p-6">
                <h3 className="font-semibold text-hive-black dark:text-white mb-4">Upcoming Appointments</h3>
                {bookings.length === 0 ? (
                  <p className="text-gray-500 text-sm">No bookings yet.</p>
                ) : bookings.filter((b) => ['pending', 'confirmed'].includes(b.status)).slice(0, 3).map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
                    <div>
                      <p className="font-medium text-sm text-hive-black dark:text-white">{booking.serviceName}</p>
                      <p className="text-xs text-gray-500">{booking.motorcycleModel} - {booking.date} at {booking.time}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>{booking.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-4">
              <h2 className="font-heading text-2xl font-bold text-hive-black dark:text-white">My Orders</h2>
              {orders.length === 0 ? (
                <div className="card p-12 text-center text-gray-500"><p>No orders yet.</p></div>
              ) : orders.map((order) => {
                const isExpanded = expandedOrder === order.id
                const stepIdx = getOrderStepIndex(order.status)
                const isCancelled = order.status === 'cancelled'
                return (
                <div key={order.id} className="card p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-semibold text-hive-black dark:text-white">{order.orderNumber || order.id}</p>
                      <p className="text-sm text-gray-500">{formatDate(order.createdAt?.toDate?.() || order.createdAt)}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>{order.status}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">{order.items?.length || 0} item(s)</span>
                    <span className="font-bold text-hive-orange">{formatCurrency(order.total)}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    {['pending', 'processing'].includes(order.status) && (
                      <button onClick={() => handleCancelOrder(order.id)} className="text-sm text-red-500 hover:underline">Cancel Order</button>
                    )}
                    {!isCancelled && (
                      <button onClick={() => setExpandedOrder(isExpanded ? null : order.id)} className="text-sm text-hive-yellow hover:underline flex items-center gap-1">
                        Track Order <FiChevronDown className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>
                    )}
                  </div>
                  {isExpanded && !isCancelled && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between max-w-xl mx-auto">
                        {orderSteps.map((step, i) => (
                          <div key={step} className="flex flex-col items-center relative flex-1">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold z-10 ${i <= stepIdx ? 'bg-hive-yellow text-hive-black' : 'bg-gray-200 dark:bg-gray-700 text-gray-400'}`}>
                              {i < stepIdx ? <FiCheck size={14} /> : i + 1}
                            </div>
                            <p className={`text-xs mt-1 capitalize text-center ${i <= stepIdx ? 'text-hive-black dark:text-white font-medium' : 'text-gray-400'}`}>{step}</p>
                            {i < orderSteps.length - 1 && (
                              <div className={`absolute top-4 left-[calc(50%+16px)] w-[calc(100%-32px)] h-0.5 -translate-y-1/2 ${i < stepIdx ? 'bg-hive-yellow' : 'bg-gray-200 dark:bg-gray-700'}`} />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {isExpanded && isCancelled && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-sm text-gray-500 text-center">This order has been cancelled.</p>
                    </div>
                  )}
                </div>
              )})}
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="space-y-4">
              <h2 className="font-heading text-2xl font-bold text-hive-black dark:text-white">My Bookings</h2>
              {bookings.length === 0 ? (
                <div className="card p-12 text-center text-gray-500"><p>No bookings yet.</p></div>
              ) : bookings.map((booking) => (
                <div key={booking.id} className="card p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-semibold text-hive-black dark:text-white">{booking.serviceName}</p>
                      <p className="text-sm text-gray-500">{booking.bookingNumber || booking.id}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>{booking.status}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-gray-500">Date: <span className="font-medium text-hive-black dark:text-white">{booking.date}</span></span>
                    <span className="text-gray-500">Time: <span className="font-medium text-hive-black dark:text-white">{booking.time}</span></span>
                    <span className="text-gray-500">Model: <span className="font-medium text-hive-black dark:text-white">{booking.motorcycleModel}</span></span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'wishlist' && (
            <div className="card p-6">
              <h2 className="font-heading text-2xl font-bold text-hive-black dark:text-white mb-4">My Wishlist</h2>
              <p className="text-gray-500">You have {wishlist.length} items in your wishlist.</p>
              <a href="/wishlist" className="btn-outline inline-block mt-4 text-sm">View Wishlist</a>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="card p-6">
              <h2 className="font-heading text-2xl font-bold text-hive-black dark:text-white mb-4">My Reviews</h2>
              <p className="text-gray-500">You haven't written any reviews yet.</p>
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="card p-6">
              <h2 className="font-heading text-2xl font-bold text-hive-black dark:text-white mb-4">Saved Addresses</h2>
              <p className="text-gray-500">No saved addresses yet.</p>
              <button className="btn-outline mt-4 text-sm">Add New Address</button>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="card p-6">
              <h2 className="font-heading text-2xl font-bold text-hive-black dark:text-white mb-6">Profile Settings</h2>
              <form onSubmit={handleProfileSave} className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <input type="text" value={profile.displayName} onChange={(e) => setProfile({ ...profile, displayName: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input type="email" value={profile.email} disabled className="input-field bg-gray-50 dark:bg-gray-800" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <input type="tel" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className="input-field" />
                </div>
                <button type="submit" className="btn-primary">Save Changes</button>
              </form>

              <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8">
                <h3 className="font-semibold text-hive-black dark:text-white mb-4">Change Password</h3>
                <form onSubmit={handlePasswordUpdate} className="space-y-4 max-w-lg">
                  <div>
                    <label className="block text-sm font-medium mb-2">New Password</label>
                    <input type="password" value={passwords.newPass} onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })} className="input-field" required minLength={6} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                    <input type="password" value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} className="input-field" required minLength={6} />
                  </div>
                  <button type="submit" className="btn-primary">Update Password</button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
