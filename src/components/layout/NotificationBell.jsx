import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { FiBell, FiShoppingCart, FiTool, FiPackage } from 'react-icons/fi'
import { formatCurrency } from '../../lib/helpers'

export default function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState({ orders: [], bookings: [], lowStock: [] })
  const ref = useRef()

  useEffect(() => {
    const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    if (!open) return
    const fetch = async () => {
      try {
        const [orderSnap, bookingSnap, productSnap] = await Promise.all([
          getDocs(query(collection(db, 'orders'), where('status', 'in', ['pending', 'processing']), orderBy('createdAt', 'desc'), limit(10))),
          getDocs(query(collection(db, 'bookings'), where('status', '==', 'pending'), orderBy('date', 'asc'), limit(10))),
          getDocs(query(collection(db, 'products'), where('stock', '<=', 10), orderBy('stock', 'asc'), limit(10))),
        ])
        setNotifications({
          orders: orderSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
          bookings: bookingSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
          lowStock: productSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
        })
      } catch (err) { console.error('Failed to fetch notifications:', err) }
    }
    fetch()
  }, [open])

  const totalCount = notifications.orders.length + notifications.bookings.length + notifications.lowStock.length

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors relative">
        <FiBell className="text-xl text-hive-black dark:text-white" />
        {totalCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[16px] text-center">
            {totalCount > 9 ? '9+' : totalCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 rounded-xl shadow-xl border dark:border-gray-700 z-50 max-h-[70vh] flex flex-col">
          <div className="flex items-center justify-between p-3 border-b dark:border-gray-700">
            <h3 className="font-semibold text-hive-black dark:text-white text-sm">Notifications</h3>
            {totalCount > 0 && (
              <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">{totalCount} new</span>
            )}
          </div>

          <div className="overflow-y-auto flex-1">
            {notifications.orders.length > 0 && (
              <div className="p-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 py-1 flex items-center gap-1">
                  <FiShoppingCart size={12} /> Orders · {notifications.orders.length}
                </p>
                {notifications.orders.map((o) => (
                  <Link
                    key={o.id}
                    to="/admin?tab=orders"
                    onClick={() => setOpen(false)}
                    className="flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <FiShoppingCart className="text-blue-600 dark:text-blue-400" size={13} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-hive-black dark:text-white truncate">{o.orderNumber || o.id}</p>
                      <p className="text-xs text-gray-500">
                        {o.status === 'pending' ? 'New order placed' : 'Order processing'} — {formatCurrency(o.total)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {notifications.bookings.length > 0 && (
              <div className={`p-2 ${notifications.orders.length > 0 ? 'border-t dark:border-gray-700' : ''}`}>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 py-1 flex items-center gap-1">
                  <FiTool size={12} /> Bookings · {notifications.bookings.length}
                </p>
                {notifications.bookings.map((b) => (
                  <Link
                    key={b.id}
                    to="/admin?tab=bookings"
                    onClick={() => setOpen(false)}
                    className="flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <FiTool className="text-amber-600 dark:text-amber-400" size={13} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-hive-black dark:text-white truncate">{b.customerName}</p>
                      <p className="text-xs text-gray-500">
                        {b.serviceName} — {b.date} at {b.time}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {notifications.lowStock.length > 0 && (
              <div className={`p-2 ${notifications.orders.length > 0 || notifications.bookings.length > 0 ? 'border-t dark:border-gray-700' : ''}`}>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 py-1 flex items-center gap-1">
                  <FiPackage size={12} /> Low Stock · {notifications.lowStock.length}
                </p>
                {notifications.lowStock.map((p) => (
                  <Link
                    key={p.id}
                    to="/admin?tab=products"
                    onClick={() => setOpen(false)}
                    className="flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <FiPackage className="text-red-600 dark:text-red-400" size={13} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-hive-black dark:text-white truncate">{p.name}</p>
                      <p className="text-xs text-gray-500">
                        Only <span className="text-red-500 font-medium">{p.stock}</span> left in stock{p.stock === 0 ? ' — Out of stock' : ''}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {totalCount === 0 && (
              <div className="text-center py-10 text-gray-400">
                <FiBell className="text-3xl mx-auto mb-2" />
                <p className="text-sm">No new notifications</p>
              </div>
            )}
          </div>

          <Link
            to="/admin"
            onClick={() => setOpen(false)}
            className="block text-center text-sm text-hive-yellow font-medium p-3 border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-b-xl"
          >
            View all in Admin
          </Link>
        </div>
      )}
    </div>
  )
}
