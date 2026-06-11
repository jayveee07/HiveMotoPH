import { Link } from 'react-router-dom'
import { FiShoppingCart, FiHeart } from 'react-icons/fi'
import { useCart } from '../../contexts/CartContext'
import { useWishlist } from '../../contexts/WishlistContext'
import { formatCurrency } from '../../lib/helpers'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()
  const inWishlist = isInWishlist(product.id)

  return (
    <div className="card group relative overflow-hidden">
      <Link to={`/product/${product.id}`}>
        <div className="relative overflow-hidden aspect-square">
          <img
            src={product.images?.[0] || 'https://placehold.co/400x400/e8b830/1a1a2e?text=HiveMoto'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.discountedPrice && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              -{Math.round((1 - product.discountedPrice / product.price) * 100)}%
            </div>
          )}
          {product.stock <= 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-bold text-lg">Out of Stock</span>
            </div>
          )}
        </div>
      </Link>

      <button
        onClick={() => toggleWishlist(product.id)}
        className="absolute top-2 right-2 w-9 h-9 bg-white/90 dark:bg-gray-800/90 rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-gray-800 transition-colors"
      >
        <FiHeart className={inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600 dark:text-gray-300'} />
      </button>

      <div className="p-4">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{product.brand}</p>
        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-hive-black dark:text-white mb-2 line-clamp-2 hover:text-hive-yellow transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={`text-sm ${i < Math.round(product.rating || 0) ? 'text-hive-yellow' : 'text-gray-300'}`}>
              ★
            </span>
          ))}
          <span className="text-xs text-gray-500 ml-1">({product.reviewsCount || 0})</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            {product.discountedPrice ? (
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-hive-orange">{formatCurrency(product.discountedPrice)}</span>
                <span className="text-sm text-gray-400 line-through">{formatCurrency(product.price)}</span>
              </div>
            ) : (
              <span className="text-lg font-bold text-hive-black dark:text-white">{formatCurrency(product.price)}</span>
            )}
          </div>
          <button
            onClick={() => addToCart(product)}
            disabled={product.stock <= 0}
            className="w-10 h-10 bg-hive-yellow rounded-lg flex items-center justify-center hover:bg-hive-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiShoppingCart className="text-hive-black" />
          </button>
        </div>
      </div>
    </div>
  )
}
