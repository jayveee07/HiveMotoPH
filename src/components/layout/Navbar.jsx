import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { FiSearch, FiShoppingCart, FiUser, FiHeart, FiMenu, FiX, FiSun, FiMoon, FiPackage, FiTool } from 'react-icons/fi'
import { useAuth } from '../../contexts/AuthContext'
import { useCart } from '../../contexts/CartContext'
import { useWishlist } from '../../contexts/WishlistContext'
import { useTheme } from '../../contexts/ThemeContext'
import NotificationBell from './NotificationBell'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { currentUser, userProfile, logout } = useAuth()
  const { cartItemsCount } = useCart()
  const { wishlist } = useWishlist()
  const { darkMode, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const isAdminPage = location.pathname.startsWith('/admin')

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
      setSearchOpen(false)
    }
  }

  return (
    <nav className="bg-white dark:bg-hive-dark shadow-md sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center gap-2">
            <img src="/HiveMoto PH.png" alt="HiveMoto PH" className="h-10 md:h-12 w-auto" />
          </Link>

          {!isAdminPage && (
            <div className="hidden lg:flex items-center gap-8">
              <Link to="/" className="text-hive-black dark:text-white hover:text-hive-yellow transition-colors font-medium">Home</Link>
              <Link to="/shop" className="text-hive-black dark:text-white hover:text-hive-yellow transition-colors font-medium">Shop</Link>
              <Link to="/services" className="text-hive-black dark:text-white hover:text-hive-yellow transition-colors font-medium">Services</Link>
              <Link to="/contact" className="text-hive-black dark:text-white hover:text-hive-yellow transition-colors font-medium">Contact</Link>
            </div>
          )}

          <div className="flex items-center gap-3">
            <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
              <FiSearch className="text-xl text-hive-black dark:text-white" />
            </button>

            <NotificationBell />

            <button onClick={toggleTheme} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
              {darkMode ? <FiSun className="text-xl text-hive-yellow" /> : <FiMoon className="text-xl text-hive-black" />}
            </button>

            {!isAdminPage && (
              <Link to="/wishlist" className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors hidden sm:block">
                <FiHeart className="text-xl text-hive-black dark:text-white" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {wishlist.length}
                  </span>
                )}
              </Link>
            )}

            {!isAdminPage && (
              <Link to="/cart" className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                <FiShoppingCart className="text-xl text-hive-black dark:text-white" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-hive-orange text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {cartItemsCount}
                  </span>
                )}
              </Link>
            )}

            {currentUser ? (
              <div className="relative group">
                <button className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                  <div className="w-8 h-8 bg-hive-yellow rounded-full flex items-center justify-center">
                    <FiUser className="text-hive-black" />
                  </div>
                  <span className="hidden md:block text-sm font-medium text-hive-black dark:text-white max-w-[100px] truncate">
                    {userProfile?.displayName || currentUser.email?.split('@')[0]}
                  </span>
                </button>
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-xl shadow-xl border dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-3 border-b dark:border-gray-700">
                    <p className="text-sm font-medium text-hive-black dark:text-white truncate">{currentUser.email}</p>
                    <p className="text-xs text-gray-500 capitalize">{userProfile?.role || 'customer'}</p>
                  </div>
                  <div className="p-2">
                    <Link to="/dashboard" className="flex items-center gap-3 px-3 py-2 text-sm text-hive-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                      <FiUser /> Dashboard
                    </Link>
                    <Link to="/dashboard?tab=orders" className="flex items-center gap-3 px-3 py-2 text-sm text-hive-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                      <FiShoppingCart /> My Orders
                    </Link>
                    <Link to="/dashboard?tab=bookings" className="flex items-center gap-3 px-3 py-2 text-sm text-hive-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                      <FiTool /> My Bookings
                    </Link>

                  </div>
                  <div className="p-2 border-t dark:border-gray-700">
                    <button onClick={() => { if (window.confirm('Are you sure you want to sign out?')) { logout(); navigate('/dashboard', { replace: true }) } }} className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/login" className="btn-primary text-sm py-2 px-4 hidden md:block">
                Sign In
              </Link>
            )}

            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
              {mobileOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
            </button>
          </div>
        </div>
      </div>

      {searchOpen && (
        <div className="bg-white dark:bg-hive-dark border-t dark:border-gray-700 py-4">
          <div className="max-w-3xl mx-auto px-4">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, parts, accessories..."
                className="input-field flex-1"
                autoFocus
              />
              <button type="submit" className="btn-primary">
                <FiSearch className="text-lg" />
              </button>
            </form>
          </div>
        </div>
      )}

      {mobileOpen && (
        <div className="lg:hidden bg-white dark:bg-hive-dark border-t dark:border-gray-700">
          <div className="px-4 py-3 space-y-2">
            {!isAdminPage && (
              <>
                <Link to="/" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-hive-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-medium">Home</Link>
                <Link to="/shop" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-hive-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-medium">Shop</Link>
                <Link to="/services" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-hive-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-medium">Services</Link>
                <Link to="/wishlist" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-hive-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-medium">Wishlist</Link>
                <Link to="/contact" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-hive-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-medium">Contact</Link>
              </>
            )}
            {!currentUser && (
              <div className="flex gap-2 pt-2">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-primary text-center flex-1 text-sm">Sign In</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-secondary text-center flex-1 text-sm">Register</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
