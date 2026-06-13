import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { doc, getDoc, collection, getDocs, addDoc, query, where, orderBy, limit } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { FiShoppingCart, FiHeart, FiMinus, FiPlus, FiCheck, FiTruck, FiShield, FiRotateCcw, FiStar, FiSend } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useCart } from '../../contexts/CartContext'
import { useWishlist } from '../../contexts/WishlistContext'
import { useAuth } from '../../contexts/AuthContext'
import { formatCurrency } from '../../lib/helpers'
import ProductCard from '../../components/ui/ProductCard'

export default function ProductDetailsPage() {
  const { id } = useParams()
  const { currentUser } = useAuth()
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [activeTab, setActiveTab] = useState('description')
  const [reviewForm, setReviewForm] = useState({ rating: 5, text: '' })
  const [submittingReview, setSubmittingReview] = useState(false)
  const { addToCart } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()

  const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : '0.0'

  useEffect(() => {
    const fetch = async () => {
      if (!id) return
      try {
        const [prodSnap, reviewSnap] = await Promise.all([
          getDoc(doc(db, 'products', id)),
          getDocs(query(collection(db, 'reviews'), where('productId', '==', id), orderBy('createdAt', 'desc'))),
        ])
        if (prodSnap.exists()) {
          const data = { id: prodSnap.id, ...prodSnap.data() }
          setProduct(data)
          const relatedSnap = await getDocs(query(collection(db, 'products'), where('category', '==', data.category), limit(4)))
          setRelatedProducts(relatedSnap.docs.map((d) => ({ id: d.id, ...d.data() })).filter((p) => p.id !== id))
        }
        setReviews(reviewSnap.docs.map((d) => ({ id: d.id, ...d.data() })))
      } catch (err) { console.error('Failed to fetch product:', err) }
      setLoading(false)
    }
    fetch()
  }, [id])

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    if (!currentUser) { toast.error('Please log in to leave a review'); return }
    setSubmittingReview(true)
    try {
      const data = {
        productId: id,
        userId: currentUser.uid,
        userName: currentUser.displayName || currentUser.email?.split('@')[0] || 'Anonymous',
        rating: Number(reviewForm.rating),
        text: reviewForm.text,
        createdAt: new Date().toISOString(),
      }
      const ref = await addDoc(collection(db, 'reviews'), data)
      setReviews((prev) => [{ id: ref.id, ...data }, ...prev])
      setReviewForm({ rating: 5, text: '' })
      toast.success('Review submitted!')
    } catch (err) { toast.error('Failed to submit review') }
    setSubmittingReview(false)
  }

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-400">Loading...</div>
  if (!product) return <div className="max-w-7xl mx-auto px-4 py-20 text-center"><h2 className="text-2xl font-bold mb-4">Product not found</h2><Link to="/shop" className="btn-primary">Back to Shop</Link></div>

  const inWishlist = isInWishlist(product.id)

  const handleAddToCart = () => {
    addToCart(product, quantity)
    toast.success(`${product.name} added to cart!`)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link to="/" className="hover:text-hive-yellow">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-hive-yellow">Shop</Link>
        <span>/</span>
        <span className="text-hive-black dark:text-white capitalize">{product.category}</span>
        <span>/</span>
        <span className="text-hive-black dark:text-white font-medium truncate">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        <div>
          <div className="card overflow-hidden mb-4">
            <img src={product.images?.[selectedImage] || product.images?.[0] || ''} alt={product.name} className="w-full aspect-square object-cover" />
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setSelectedImage(i)} className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${selectedImage === i ? 'border-hive-yellow' : 'border-gray-200 dark:border-gray-700'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          {product.brand && <p className="text-sm text-hive-orange font-semibold uppercase tracking-wider mb-2">{product.brand}</p>}
          <h1 className="font-heading text-3xl font-bold text-hive-black dark:text-white mb-4">{product.name}</h1>

          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`text-lg ${i < Math.round(product.rating || 0) ? 'text-hive-yellow' : 'text-gray-300'}`}>★</span>
              ))}
            </div>
            <span className="text-sm text-gray-500">{product.rating || 0} ({product.reviewsCount || 0} reviews)</span>
          </div>

          <div className="mb-6">
            {product.discountedPrice ? (
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-hive-orange">{formatCurrency(product.discountedPrice)}</span>
                <span className="text-xl text-gray-400 line-through">{formatCurrency(product.price)}</span>
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">-{Math.round((1 - product.discountedPrice / product.price) * 100)}% OFF</span>
              </div>
            ) : (
              <span className="text-3xl font-bold text-hive-black dark:text-white">{formatCurrency(product.price)}</span>
            )}
          </div>

          <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">{product.description}</p>

          <div className="flex items-center gap-2 mb-6">
            {product.stock > 0 ? (
              <><FiCheck className="text-green-500" /><span className="text-sm text-green-600 font-medium">In Stock ({product.stock} units)</span></>
            ) : (
              <span className="text-sm text-red-500 font-medium">Out of Stock</span>
            )}
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800"><FiMinus /></button>
              <span className="px-6 py-3 font-medium text-hive-black dark:text-white min-w-[60px] text-center">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800"><FiPlus /></button>
            </div>
            <button onClick={handleAddToCart} disabled={product.stock <= 0} className="flex-1 btn-primary flex items-center justify-center gap-2"><FiShoppingCart /> Add to Cart</button>
            <button onClick={() => toggleWishlist(product.id)} className={`p-3 rounded-lg border transition-colors ${inWishlist ? 'bg-red-50 border-red-200 text-red-500' : 'border-gray-300 dark:border-gray-600 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
              <FiHeart className={inWishlist ? 'fill-red-500' : ''} />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl mb-6">
            <div className="text-center"><FiTruck className="text-hive-yellow text-xl mx-auto mb-1" /><p className="text-xs text-gray-600 dark:text-gray-400">Free Shipping over ₱1k</p></div>
            <div className="text-center"><FiShield className="text-hive-yellow text-xl mx-auto mb-1" /><p className="text-xs text-gray-600 dark:text-gray-400">100% Authentic</p></div>
            <div className="text-center"><FiRotateCcw className="text-hive-yellow text-xl mx-auto mb-1" /><p className="text-xs text-gray-600 dark:text-gray-400">30-Day Returns</p></div>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1">{[...Array(5)].map((_, i) => (<span key={i} className={`text-lg ${i < Math.round(Number(avgRating)) ? 'text-hive-yellow' : 'text-gray-300'}`}>★</span>))}</div>
            <span className="text-sm text-gray-500">{avgRating} ({reviews.length} reviews)</span>
          </div>

            {product.compatibleModels?.length > 0 && (
            <div>
              <h3 className="font-semibold text-hive-black dark:text-white mb-2">Compatible Models:</h3>
              <div className="flex flex-wrap gap-2">
                {product.compatibleModels.map((model) => (
                  <span key={model} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-sm text-gray-600 dark:text-gray-400 rounded-full">{model}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mb-16">
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
          {['description', 'specifications', 'reviews'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-3 font-medium capitalize transition-colors border-b-2 ${activeTab === tab ? 'border-hive-yellow text-hive-yellow' : 'border-transparent text-gray-500 hover:text-hive-black dark:hover:text-white'}`}>{tab}</button>
          ))}
        </div>

        <div className="prose dark:prose-invert max-w-none">
          {activeTab === 'description' && <div className="text-gray-600 dark:text-gray-400 leading-relaxed"><p>{product.description}</p></div>}
          {activeTab === 'specifications' && (
            <table className="w-full">
              <tbody>
                {product.specifications?.map((spec) => (
                  <tr key={spec.label} className="border-b border-gray-200 dark:border-gray-700">
                    <td className="py-3 font-medium text-hive-black dark:text-white w-48">{spec.label}</td>
                    <td className="py-3 text-gray-600 dark:text-gray-400">{spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {currentUser && (
                <form onSubmit={handleSubmitReview} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <h4 className="font-semibold text-hive-black dark:text-white mb-3">Write a Review</h4>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm text-gray-500">Rating:</span>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} type="button" onClick={() => setReviewForm({ ...reviewForm, rating: star })} className="text-xl focus:outline-none">
                        <span className={star <= reviewForm.rating ? 'text-hive-yellow' : 'text-gray-300'}>★</span>
                      </button>
                    ))}
                  </div>
                  <textarea value={reviewForm.text} onChange={(e) => setReviewForm({ ...reviewForm, text: e.target.value })} required placeholder="Share your experience with this product..." rows={3} className="input-field mb-3" />
                  <button type="submit" disabled={submittingReview} className="btn-primary text-sm flex items-center gap-2">
                    {submittingReview ? 'Submitting...' : <><FiSend size={14} /> Submit Review</>}
                  </button>
                </form>
              )}
              <div className="space-y-4">
                {reviews.length > 0 ? reviews.map((review) => (
                  <div key={review.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-hive-yellow rounded-full flex items-center justify-center text-sm font-bold text-hive-black">{(review.userName || '?')[0]}</div>
                        <span className="font-medium text-hive-black dark:text-white">{review.userName}</span>
                      </div>
                      <span className="text-xs text-gray-500">{review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ''}</span>
                    </div>
                    <div className="flex items-center gap-1 mb-2">{[...Array(5)].map((_, i) => (<span key={i} className={`text-sm ${i < review.rating ? 'text-hive-yellow' : 'text-gray-300'}`}>★</span>))}</div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{review.text}</p>
                  </div>
                )) : <p className="text-gray-500">No reviews yet. Be the first to review!</p>}
              </div>
            </div>
          )}
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section>
          <h2 className="font-heading text-2xl font-bold text-hive-black dark:text-white mb-6">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map((p) => (<ProductCard key={p.id} product={p} />))}
          </div>
        </section>
      )}
    </div>
  )
}
