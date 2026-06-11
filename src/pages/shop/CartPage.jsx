import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowLeft, FiPercent } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useCart } from '../../contexts/CartContext'
import { formatCurrency } from '../../lib/helpers'

export default function CartPage() {
  const { items, subtotal, discount, total, coupon, updateQuantity, removeFromCart, clearCart, applyCoupon, removeCoupon } = useCart()
  const [couponCode, setCouponCode] = useState('')

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === 'HIVEMOTO10') {
      applyCoupon({ code: 'HIVEMOTO10', discountType: 'percentage', discountValue: 10 })
      toast.success('Coupon applied! 10% discount')
    } else if (couponCode.toUpperCase() === 'RIDER50') {
      applyCoupon({ code: 'RIDER50', discountType: 'fixed', discountValue: 50 })
      toast.success('Coupon applied! ₱50 off')
    } else {
      toast.error('Invalid coupon code')
    }
    setCouponCode('')
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <FiShoppingBag className="text-6xl text-gray-300 mx-auto mb-4" />
        <h2 className="font-heading text-3xl font-bold text-hive-black dark:text-white mb-2">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/shop" className="btn-primary inline-flex items-center gap-2">
          <FiArrowLeft /> Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-3xl font-bold text-hive-black dark:text-white">Shopping Cart</h1>
        <button onClick={clearCart} className="text-sm text-red-500 hover:underline">Clear All</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="card p-4 flex items-center gap-4">
              <Link to={`/product/${item.id}`} className="w-20 h-20 flex-shrink-0">
                <img src={item.images?.[0] || 'https://placehold.co/400x400/e8b830/1a1a2e?text=HiveMoto'} alt={item.name} className="w-full h-full object-cover rounded-lg" />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/product/${item.id}`} className="font-semibold text-hive-black dark:text-white hover:text-hive-yellow transition-colors line-clamp-1">
                  {item.name}
                </Link>
                <p className="text-sm text-gray-500">{item.brand}</p>
                <p className="font-semibold text-hive-orange mt-1">
                  {formatCurrency((item.discountedPrice || item.price) * item.quantity)}
                </p>
              </div>
              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <FiMinus size={14} />
                </button>
                <span className="px-4 py-2 text-sm font-medium min-w-[40px] text-center">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <FiPlus size={14} />
                </button>
              </div>
              <button onClick={() => removeFromCart(item.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                <FiTrash2 />
              </button>
            </div>
          ))}
        </div>

        <div>
          <div className="card p-6 sticky top-24">
            <h3 className="font-heading text-xl font-bold text-hive-black dark:text-white mb-6">Order Summary</h3>

            <div className="space-y-4 mb-6">
              {!coupon ? (
                <div>
                  <label className="block text-sm font-medium text-hive-black dark:text-white mb-2">Have a coupon?</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter code"
                      className="input-field flex-1 text-sm"
                    />
                    <button onClick={handleApplyCoupon} className="btn-primary text-sm px-4">
                      <FiPercent />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-green-700 dark:text-green-400">Coupon: {coupon.code}</p>
                    <p className="text-xs text-green-600 dark:text-green-500">
                      {coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : `₱${coupon.discountValue} OFF`}
                    </p>
                  </div>
                  <button onClick={removeCoupon} className="text-red-500 text-sm hover:underline">Remove</button>
                </div>
              )}
            </div>

            <div className="space-y-3 text-sm border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-{formatCurrency(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">{subtotal >= 1000 ? 'FREE' : 'Calculated at checkout'}</span>
              </div>
              <div className="flex justify-between font-bold text-lg text-hive-black dark:text-white border-t border-gray-200 dark:border-gray-700 pt-3">
                <span>Total</span>
                <span className="text-hive-orange">{formatCurrency(total)}</span>
              </div>
            </div>

            <Link to="/checkout" className="btn-primary w-full text-center mt-6 flex items-center justify-center gap-2">
              Proceed to Checkout
            </Link>
            <Link to="/shop" className="block text-center text-sm text-gray-500 hover:text-hive-yellow mt-3 transition-colors">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
