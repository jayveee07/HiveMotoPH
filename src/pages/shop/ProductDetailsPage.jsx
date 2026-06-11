import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FiShoppingCart, FiHeart, FiShare2, FiMinus, FiPlus, FiCheck, FiTruck, FiShield, FiRotateCcw } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useCart } from '../../contexts/CartContext'
import { useWishlist } from '../../contexts/WishlistContext'
import { formatCurrency } from '../../lib/helpers'
import ProductCard from '../../components/ui/ProductCard'

const product = {
  id: 'p1',
  name: 'NGK Spark Plug CR7HSA',
  brand: 'NGK',
  price: 180,
  discountedPrice: 150,
  description: 'High-performance NGK spark plug designed for various motorcycle models. Features copper core electrode for reliable ignition and improved fuel efficiency.',
  specifications: [
    { label: 'Type', value: 'Copper Core' },
    { label: 'Thread Size', value: '10mm' },
    { label: 'Hex Size', value: '16mm' },
    { label: 'Gap', value: '0.7mm' },
    { label: 'Resistor', value: '5kΩ' },
    { label: 'Material', value: 'Nickel Alloy' },
  ],
  compatibleModels: ['Honda Beat', 'Honda Click', 'Yamaha Mio', 'Yamaha NMAX', 'Suzuki Skydrive'],
  images: [
    'https://placehold.co/600x600/e8b830/1a1a2e?text=Spark+Plug+1',
    'https://placehold.co/600x600/f26522/fff?text=Spark+Plug+2',
    'https://placehold.co/600x600/1a1a2e/fff?text=Spark+Plug+3',
  ],
  rating: 4.5,
  reviewsCount: 23,
  stock: 50,
  category: 'engine',
  reviews: [
    { id: 1, user: 'Juan D.', rating: 5, text: 'Great quality spark plug. My engine runs smoother now.', date: '2024-12-15' },
    { id: 2, user: 'Maria S.', rating: 4, text: 'Good value for money. Fits my Honda Beat perfectly.', date: '2024-11-20' },
    { id: 3, user: 'Pedro G.', rating: 5, text: 'Original NGK quality. Highly recommended!', date: '2024-10-05' },
  ],
}

const relatedProducts = [
  { id: 'p2', name: 'Mobil 1 Racing 4T 10W-40', brand: 'Mobil', price: 550, discountedPrice: 480, images: ['https://placehold.co/400x400/f26522/fff?text=Engine+Oil'], rating: 4.8, reviewsCount: 45, stock: 100, category: 'lubricants' },
  { id: 'p9', name: 'K&N Air Filter', brand: 'K&N', price: 850, images: ['https://placehold.co/400x400/1a1a2e/fff?text=Air+Filter'], rating: 4.5, reviewsCount: 22, stock: 35, category: 'engine' },
  { id: 'p7', name: 'RK Chain 428 Gold', brand: 'RK', price: 1800, images: ['https://placehold.co/400x400/e8b830/1a1a2e?text=RK+Chain'], rating: 4.3, reviewsCount: 15, stock: 40, category: 'engine' },
  { id: 'p8', name: 'Motul Chain Lube Spray', brand: 'Motul', price: 320, discountedPrice: 280, images: ['https://placehold.co/400x400/f26522/fff?text=Chain+Lube'], rating: 4.7, reviewsCount: 56, stock: 200, category: 'lubricants' },
]

export default function ProductDetailsPage() {
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [activeTab, setActiveTab] = useState('description')
  const { addToCart } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()
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
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full aspect-square object-cover"
            />
          </div>
          <div className="flex gap-3">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${selectedImage === i ? 'border-hive-yellow' : 'border-gray-200 dark:border-gray-700'}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm text-hive-orange font-semibold uppercase tracking-wider mb-2">{product.brand}</p>
          <h1 className="font-heading text-3xl font-bold text-hive-black dark:text-white mb-4">{product.name}</h1>

          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`text-lg ${i < Math.round(product.rating) ? 'text-hive-yellow' : 'text-gray-300'}`}>★</span>
              ))}
            </div>
            <span className="text-sm text-gray-500">{product.rating} ({product.reviewsCount} reviews)</span>
          </div>

          <div className="mb-6">
            {product.discountedPrice ? (
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-hive-orange">{formatCurrency(product.discountedPrice)}</span>
                <span className="text-xl text-gray-400 line-through">{formatCurrency(product.price)}</span>
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                  -{Math.round((1 - product.discountedPrice / product.price) * 100)}% OFF
                </span>
              </div>
            ) : (
              <span className="text-3xl font-bold text-hive-black dark:text-white">{formatCurrency(product.price)}</span>
            )}
          </div>

          <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">{product.description}</p>

          <div className="flex items-center gap-2 mb-6">
            {product.stock > 0 ? (
              <>
                <FiCheck className="text-green-500" />
                <span className="text-sm text-green-600 font-medium">In Stock ({product.stock} units)</span>
              </>
            ) : (
              <span className="text-sm text-red-500 font-medium">Out of Stock</span>
            )}
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <FiMinus />
              </button>
              <span className="px-6 py-3 font-medium text-hive-black dark:text-white min-w-[60px] text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <FiPlus />
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className="flex-1 btn-primary flex items-center justify-center gap-2"
            >
              <FiShoppingCart /> Add to Cart
            </button>
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`p-3 rounded-lg border transition-colors ${inWishlist ? 'bg-red-50 border-red-200 text-red-500' : 'border-gray-300 dark:border-gray-600 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              <FiHeart className={inWishlist ? 'fill-red-500' : ''} />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl mb-6">
            <div className="text-center">
              <FiTruck className="text-hive-yellow text-xl mx-auto mb-1" />
              <p className="text-xs text-gray-600 dark:text-gray-400">Free Shipping over ₱1k</p>
            </div>
            <div className="text-center">
              <FiShield className="text-hive-yellow text-xl mx-auto mb-1" />
              <p className="text-xs text-gray-600 dark:text-gray-400">100% Authentic</p>
            </div>
            <div className="text-center">
              <FiRotateCcw className="text-hive-yellow text-xl mx-auto mb-1" />
              <p className="text-xs text-gray-600 dark:text-gray-400">30-Day Returns</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-hive-black dark:text-white mb-2">Compatible Models:</h3>
            <div className="flex flex-wrap gap-2">
              {product.compatibleModels.map((model) => (
                <span key={model} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-sm text-gray-600 dark:text-gray-400 rounded-full">
                  {model}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-16">
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
          {['description', 'specifications', 'reviews'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-medium capitalize transition-colors border-b-2 ${activeTab === tab ? 'border-hive-yellow text-hive-yellow' : 'border-transparent text-gray-500 hover:text-hive-black dark:hover:text-white'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="prose dark:prose-invert max-w-none">
          {activeTab === 'description' && (
            <div className="text-gray-600 dark:text-gray-400 leading-relaxed">
              <p>{product.description}</p>
              <p className="mt-4">
                The NGK CR7HSA is a standard copper core spark plug designed for a wide range of motorcycles.
                It provides reliable performance and improved fuel efficiency. With its nickel-alloy center electrode,
                it offers durability and consistent spark for smooth engine operation.
              </p>
              <ul className="mt-4 space-y-2">
                <li>✓ Reliable ignition performance</li>
                <li>✓ Improved fuel efficiency</li>
                <li>✓ Durable nickel-alloy construction</li>
                <li>✓ Wide compatibility with popular motorcycle models</li>
                <li>✓ OEM quality standard</li>
              </ul>
            </div>
          )}
          {activeTab === 'specifications' && (
            <table className="w-full">
              <tbody>
                {product.specifications.map((spec) => (
                  <tr key={spec.label} className="border-b border-gray-200 dark:border-gray-700">
                    <td className="py-3 font-medium text-hive-black dark:text-white w-48">{spec.label}</td>
                    <td className="py-3 text-gray-600 dark:text-gray-400">{spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              {product.reviews.map((review) => (
                <div key={review.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-hive-yellow rounded-full flex items-center justify-center text-sm font-bold text-hive-black">
                        {review.user[0]}
                      </div>
                      <span className="font-medium text-hive-black dark:text-white">{review.user}</span>
                    </div>
                    <span className="text-xs text-gray-500">{review.date}</span>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-sm ${i < review.rating ? 'text-hive-yellow' : 'text-gray-300'}`}>★</span>
                    ))}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{review.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <section>
        <h2 className="font-heading text-2xl font-bold text-hive-black dark:text-white mb-6">Related Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {relatedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  )
}
