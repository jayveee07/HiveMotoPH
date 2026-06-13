import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiCreditCard, FiMapPin, FiCheck, FiTruck, FiSmartphone, FiDollarSign } from 'react-icons/fi'
import { collection, addDoc, doc, updateDoc, increment, query, where, getDocs, limit, serverTimestamp } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import toast from 'react-hot-toast'
import { useCart } from '../../contexts/CartContext'
import { useAuth } from '../../contexts/AuthContext'
import { formatCurrency, generateOrderId } from '../../lib/helpers'
import { PAYMENT_METHODS } from '../../lib/constants'

export default function CheckoutPage() {
  const { items, total, discount, coupon, clearCart } = useCart()
  const { currentUser } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [shipping, setShipping] = useState({
    firstName: currentUser?.displayName?.split(' ')[0] || '',
    lastName: currentUser?.displayName?.split(' ').slice(1).join(' ') || '',
    email: currentUser?.email || '',
    phone: '',
    address: '',
    city: '',
    province: '',
    zip: '',
    notes: '',
  })
  const [paymentMethod, setPaymentMethod] = useState('gcash')
  const [loading, setLoading] = useState(false)

  const handleShippingSubmit = (e) => {
    e.preventDefault()
    setStep(2)
    window.scrollTo(0, 0)
  }

  const handlePlaceOrder = async () => {
    setLoading(true)
    try {
      const orderId = generateOrderId()
      const subtotalCalc = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      const actualTotal = items.reduce((sum, item) => sum + ((item.discountedPrice || item.price) * item.quantity), 0)
      const orderData = {
        orderNumber: orderId,
        userId: currentUser?.uid || '',
        userEmail: currentUser?.email || shipping.email,
        items: items.map((item) => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          discountedPrice: item.discountedPrice || null,
          quantity: item.quantity,
        })),
        subtotal: subtotalCalc,
        shipping: 0,
        discount,
        total: actualTotal - discount,
        couponCode: coupon?.code || null,
        paymentMethod,
        shippingAddress: {
          firstName: shipping.firstName,
          lastName: shipping.lastName,
          address: shipping.address,
          city: shipping.city,
          province: shipping.province,
          zip: shipping.zip,
          phone: shipping.phone,
          email: shipping.email,
        },
        notes: shipping.notes,
        status: 'pending',
        createdAt: serverTimestamp(),
      }
      await addDoc(collection(db, 'orders'), orderData)
      if (coupon?.code) {
        const q = query(collection(db, 'coupons'), where('code', '==', coupon.code), limit(1))
        const snap = await getDocs(q)
        if (!snap.empty) {
          await updateDoc(doc(db, 'coupons', snap.docs[0].id), { usedCount: increment(1) })
        }
      }
      clearCart()
      toast.success(`Order #${orderId} placed successfully!`)
      navigate('/dashboard?tab=orders')
    } catch (err) {
      toast.error('Failed to place order: ' + err.message)
    }
    setLoading(false)
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <FiCheck className="text-6xl text-gray-300 mx-auto mb-4" />
        <h2 className="font-heading text-3xl font-bold text-hive-black dark:text-white mb-2">Nothing to Checkout</h2>
        <p className="text-gray-500 mb-8">Add some items to your cart first.</p>
        <Link to="/shop" className="btn-primary inline-flex items-center gap-2">Go Shopping</Link>
      </div>
    )
  }

  const steps = ['Shipping', 'Payment', 'Review']

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="font-heading text-3xl font-bold text-hive-black dark:text-white mb-8">Checkout</h1>

      <div className="flex items-center justify-center gap-4 mb-8">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step > i ? 'bg-green-500 text-white' : step === i + 1 ? 'bg-hive-yellow text-hive-black' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
              {step > i ? <FiCheck /> : i + 1}
            </div>
            <span className={`text-sm font-medium hidden sm:block ${step === i + 1 ? 'text-hive-yellow' : 'text-gray-500'}`}>{s}</span>
            {i < steps.length - 1 && <div className={`w-12 h-0.5 ${step > i ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`} />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          {step === 1 && (
            <div className="card p-6">
              <h2 className="font-heading text-xl font-bold text-hive-black dark:text-white mb-6 flex items-center gap-2">
                <FiMapPin /> Shipping Information
              </h2>
              <form onSubmit={handleShippingSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">First Name *</label>
                    <input type="text" value={shipping.firstName} onChange={(e) => setShipping({ ...shipping, firstName: e.target.value })} required className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Last Name *</label>
                    <input type="text" value={shipping.lastName} onChange={(e) => setShipping({ ...shipping, lastName: e.target.value })} required className="input-field" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Email *</label>
                    <input type="email" value={shipping.email} onChange={(e) => setShipping({ ...shipping, email: e.target.value })} required className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone *</label>
                    <input type="tel" value={shipping.phone} onChange={(e) => setShipping({ ...shipping, phone: e.target.value })} required className="input-field" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Address *</label>
                  <input type="text" value={shipping.address} onChange={(e) => setShipping({ ...shipping, address: e.target.value })} required className="input-field" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">City *</label>
                    <input type="text" value={shipping.city} onChange={(e) => setShipping({ ...shipping, city: e.target.value })} required className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Province *</label>
                    <input type="text" value={shipping.province} onChange={(e) => setShipping({ ...shipping, province: e.target.value })} required className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">ZIP *</label>
                    <input type="text" value={shipping.zip} onChange={(e) => setShipping({ ...shipping, zip: e.target.value })} required className="input-field" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Order Notes (Optional)</label>
                  <textarea value={shipping.notes} onChange={(e) => setShipping({ ...shipping, notes: e.target.value })} rows={3} className="input-field" placeholder="Special instructions for delivery" />
                </div>
                <button type="submit" className="btn-primary w-full">Continue to Payment</button>
              </form>
            </div>
          )}

          {step === 2 && (
            <div className="card p-6">
              <h2 className="font-heading text-xl font-bold text-hive-black dark:text-white mb-6 flex items-center gap-2">
                <FiCreditCard /> Payment Method
              </h2>
              <div className="space-y-3">
                {PAYMENT_METHODS.map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === method.id ? 'border-hive-yellow bg-hive-yellow/5' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'}`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="accent-hive-yellow"
                    />
                    <span className="text-2xl">{method.icon}</span>
                    <span className="font-medium text-hive-black dark:text-white">{method.name}</span>
                  </label>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(1)} className="btn-secondary flex-1">Back</button>
                <button onClick={() => setStep(3)} className="btn-primary flex-1">Continue to Review</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="card p-6">
              <h2 className="font-heading text-xl font-bold text-hive-black dark:text-white mb-6">Review Order</h2>
              <div className="space-y-4 mb-6">
                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                  <h3 className="font-semibold text-hive-black dark:text-white mb-2 flex items-center gap-2"><FiMapPin /> Shipping To</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {shipping.firstName} {shipping.lastName}<br />
                    {shipping.address}<br />
                    {shipping.city}, {shipping.province} {shipping.zip}<br />
                    {shipping.email} | {shipping.phone}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                  <h3 className="font-semibold text-hive-black dark:text-white mb-2 flex items-center gap-2"><FiCreditCard /> Payment Method</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {PAYMENT_METHODS.find((m) => m.id === paymentMethod)?.icon} {PAYMENT_METHODS.find((m) => m.id === paymentMethod)?.name}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                  <h3 className="font-semibold text-hive-black dark:text-white mb-2">{items.length} Item(s)</h3>
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-sm py-1">
                      <span className="text-gray-600 dark:text-gray-400">{item.name} x{item.quantity}</span>
                      <span className="font-medium">{formatCurrency((item.discountedPrice || item.price) * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="btn-secondary flex-1">Back</button>
                <button onClick={handlePlaceOrder} disabled={loading} className="btn-primary flex-1">
                  {loading ? 'Placing Order...' : `Place Order - ${formatCurrency(total)}`}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          <div className="card p-6 sticky top-24">
            <h3 className="font-heading text-lg font-bold text-hive-black dark:text-white mb-4">Order Summary</h3>
            <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <img src={item.images?.[0] || ''} alt={item.name} className="w-12 h-12 object-cover rounded-lg" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-hive-black dark:text-white truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-medium">{formatCurrency((item.discountedPrice || item.price) * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="space-y-2 text-sm border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal</span>
                <span>{formatCurrency(total)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Shipping</span>
                <span className="text-green-600">{total >= 1000 ? 'FREE' : '—'}</span>
              </div>
              <div className="flex justify-between font-bold text-lg text-hive-black dark:text-white border-t pt-2">
                <span>Total</span>
                <span className="text-hive-orange">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
