import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FiUser, FiShoppingBag, FiTool, FiHeart, FiStar, FiLogOut, FiMapPin, FiPackage, FiClock, FiSettings } from 'react-icons/fi'
import { useAuth } from '../../contexts/AuthContext'
import { useWishlist } from '../../contexts/WishlistContext'
import { formatCurrency, formatDate, getStatusColor } from '../../lib/helpers'

const mockOrders = [
  { id: 'HMP-A1B2C3', date: '2026-06-01', status: 'delivered', total: 1500, items: 3 },
  { id: 'HMP-D4E5F6', date: '2026-06-05', status: 'shipped', total: 2800, items: 2 },
  { id: 'HMP-G7H8I9', date: '2026-06-10', status: 'processing', total: 450, items: 1 },
]

const mockBookings = [
  { id: 'BOK-A1B2', service: 'Change Oil', date: '2026-06-15', time: '10:00', status: 'confirmed', model: 'Honda Beat' },
  { id: 'BOK-C3D4', service: 'CVT Cleaning', date: '2026-06-20', time: '14:00', status: 'pending', model: 'Yamaha Mio' },
]

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

  const [profile, setProfile] = useState({
    displayName: userProfile?.displayName || currentUser?.displayName || '',
    email: currentUser?.email || '',
    phone: userProfile?.phone || '',
  })

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
                  { label: 'Active Orders', value: '2', icon: FiShoppingBag, color: 'text-blue-600 bg-blue-100' },
                  { label: 'Upcoming Appointments', value: '2', icon: FiTool, color: 'text-hive-orange bg-orange-100' },
                  { label: 'Wishlist Items', value: String(wishlist.length || 3), icon: FiHeart, color: 'text-red-500 bg-red-100' },
                  { label: 'Loyalty Points', value: '250', icon: FiStar, color: 'text-hive-yellow bg-yellow-100' },
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
                {mockOrders.slice(0, 3).map((order) => (
                  <div key={order.id} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
                    <div>
                      <p className="font-medium text-sm text-hive-black dark:text-white">{order.id}</p>
                      <p className="text-xs text-gray-500">{formatDate(order.date)}</p>
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
                {mockBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
                    <div>
                      <p className="font-medium text-sm text-hive-black dark:text-white">{booking.service}</p>
                      <p className="text-xs text-gray-500">{booking.model} - {booking.date} at {booking.time}</p>
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
              {mockOrders.map((order) => (
                <div key={order.id} className="card p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-semibold text-hive-black dark:text-white">{order.id}</p>
                      <p className="text-sm text-gray-500">{formatDate(order.date)}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>{order.status}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">{order.items} item(s)</span>
                    <span className="font-bold text-hive-orange">{formatCurrency(order.total)}</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button className="text-sm text-hive-yellow font-medium hover:underline">View Details</button>
                    <button className="text-sm text-gray-500 hover:underline">Track Order</button>
                    <button className="text-sm text-gray-500 hover:underline">Download Invoice</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="space-y-4">
              <h2 className="font-heading text-2xl font-bold text-hive-black dark:text-white">My Bookings</h2>
              {mockBookings.map((booking) => (
                <div key={booking.id} className="card p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-semibold text-hive-black dark:text-white">{booking.service}</p>
                      <p className="text-sm text-gray-500">{booking.id}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>{booking.status}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-gray-500">Date: <span className="font-medium text-hive-black dark:text-white">{booking.date}</span></span>
                    <span className="text-gray-500">Time: <span className="font-medium text-hive-black dark:text-white">{booking.time}</span></span>
                    <span className="text-gray-500">Model: <span className="font-medium text-hive-black dark:text-white">{booking.model}</span></span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button className="text-sm text-hive-yellow font-medium hover:underline">Reschedule</button>
                    <button className="text-sm text-red-500 hover:underline">Cancel</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'wishlist' && (
            <div className="card p-6">
              <h2 className="font-heading text-2xl font-bold text-hive-black dark:text-white mb-4">My Wishlist</h2>
              <p className="text-gray-500">You have {wishlist.length || 3} items in your wishlist.</p>
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
              <form className="space-y-4 max-w-lg">
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
                <form className="space-y-4 max-w-lg">
                  <div>
                    <label className="block text-sm font-medium mb-2">Current Password</label>
                    <input type="password" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">New Password</label>
                    <input type="password" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                    <input type="password" className="input-field" />
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
