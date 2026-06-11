import { Link } from 'react-router-dom'
import { FiHeart, FiArrowLeft, FiShoppingCart } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useWishlist } from '../../contexts/WishlistContext'
import { useCart } from '../../contexts/CartContext'
import { formatCurrency } from '../../lib/helpers'

const wishlistProducts = [
  { id: 'p1', name: 'NGK Spark Plug CR7HSA', brand: 'NGK', price: 180, discountedPrice: 150, images: ['https://placehold.co/400x400/e8b830/1a1a2e?text=Spark+Plug'], rating: 4.5, reviewsCount: 23, stock: 50 },
  { id: 'p3', name: 'Brembo Brake Pads Set', brand: 'Brembo', price: 1200, images: ['https://placehold.co/400x400/1a1a2e/fff?text=Brake+Pads'], rating: 4.7, reviewsCount: 18, stock: 30 },
  { id: 'p6', name: 'Michelin Pilot Street Radial', brand: 'Michelin', price: 4500, discountedPrice: 3800, images: ['https://placehold.co/400x400/1a1a2e/fff?text=Tire'], rating: 4.9, reviewsCount: 34, stock: 25 },
]

export default function WishlistPage() {
  const { wishlist, clearWishlist } = useWishlist()
  const { addToCart } = useCart()

  if (wishlist.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <FiHeart className="text-6xl text-gray-300 mx-auto mb-4" />
        <h2 className="font-heading text-3xl font-bold text-hive-black dark:text-white mb-2">Your Wishlist is Empty</h2>
        <p className="text-gray-500 mb-8">Save your favorite products to your wishlist.</p>
        <Link to="/shop" className="btn-primary inline-flex items-center gap-2">
          <FiArrowLeft /> Browse Products
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-hive-black dark:text-white">My Wishlist</h1>
          <p className="text-gray-500">{wishlistProducts.length} items</p>
        </div>
        <button onClick={clearWishlist} className="text-sm text-red-500 hover:underline">Clear All</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {wishlistProducts.map((product) => (
          <div key={product.id} className="card overflow-hidden group">
            <Link to={`/product/${product.id}`}>
              <div className="aspect-square overflow-hidden">
                <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              </div>
            </Link>
            <div className="p-4">
              <p className="text-xs text-gray-500 uppercase">{product.brand}</p>
              <Link to={`/product/${product.id}`}>
                <h3 className="font-semibold text-hive-black dark:text-white line-clamp-1 hover:text-hive-yellow transition-colors">{product.name}</h3>
              </Link>
              <div className="flex items-center gap-2 mt-2">
                {product.discountedPrice ? (
                  <>
                    <span className="font-bold text-hive-orange">{formatCurrency(product.discountedPrice)}</span>
                    <span className="text-sm text-gray-400 line-through">{formatCurrency(product.price)}</span>
                  </>
                ) : (
                  <span className="font-bold text-hive-black dark:text-white">{formatCurrency(product.price)}</span>
                )}
              </div>
              <button
                onClick={() => { addToCart(product); toast.success('Added to cart!') }}
                className="btn-primary w-full text-sm mt-3 flex items-center justify-center gap-2"
              >
                <FiShoppingCart /> Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
