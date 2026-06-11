import { useState, useMemo } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { FiGrid, FiList, FiSliders, FiX, FiSearch } from 'react-icons/fi'
import ProductCard from '../../components/ui/ProductCard'
import { SHOP_CATEGORIES } from '../../lib/constants'

const allProducts = [
  { id: 'p1', name: 'NGK Spark Plug CR7HSA', brand: 'NGK', price: 180, discountedPrice: 150, images: ['https://placehold.co/400x400/e8b830/1a1a2e?text=Spark+Plug'], rating: 4.5, reviewsCount: 23, stock: 50, category: 'engine', model: 'Honda', createdAt: Date.now() - 100000 },
  { id: 'p2', name: 'Mobil 1 Racing 4T 10W-40', brand: 'Mobil', price: 550, discountedPrice: 480, images: ['https://placehold.co/400x400/f26522/fff?text=Engine+Oil'], rating: 4.8, reviewsCount: 45, stock: 100, category: 'lubricants', model: 'Universal', createdAt: Date.now() - 20000 },
  { id: 'p3', name: 'Brembo Brake Pads Set', brand: 'Brembo', price: 1200, images: ['https://placehold.co/400x400/1a1a2e/fff?text=Brake+Pads'], rating: 4.7, reviewsCount: 18, stock: 30, category: 'brakes', model: 'Yamaha', createdAt: Date.now() - 50000 },
  { id: 'p4', name: 'DID Heavy Duty Chain Kit', brand: 'DID', price: 2500, discountedPrice: 2200, images: ['https://placehold.co/400x400/e8b830/1a1a2e?text=Chain+Kit'], rating: 4.6, reviewsCount: 12, stock: 20, category: 'engine', model: 'Kawasaki', createdAt: Date.now() },
  { id: 'p5', name: 'Showa Shock Absorber', brand: 'Showa', price: 3500, images: ['https://placehold.co/400x400/f26522/fff?text=Shock'], rating: 4.4, reviewsCount: 8, stock: 15, category: 'suspension', model: 'Honda', createdAt: Date.now() - 30000 },
  { id: 'p6', name: 'Michelin Pilot Street Radial', brand: 'Michelin', price: 4500, discountedPrice: 3800, images: ['https://placehold.co/400x400/1a1a2e/fff?text=Tire'], rating: 4.9, reviewsCount: 34, stock: 25, category: 'tires', model: 'Universal', createdAt: Date.now() - 1000 },
  { id: 'p7', name: 'RK Chain 428 Gold', brand: 'RK', price: 1800, images: ['https://placehold.co/400x400/e8b830/1a1a2e?text=RK+Chain'], rating: 4.3, reviewsCount: 15, stock: 40, category: 'engine', model: 'Suzuki', createdAt: Date.now() - 60000 },
  { id: 'p8', name: 'Motul Chain Lube Spray', brand: 'Motul', price: 320, discountedPrice: 280, images: ['https://placehold.co/400x400/f26522/fff?text=Chain+Lube'], rating: 4.7, reviewsCount: 56, stock: 200, category: 'lubricants', model: 'Universal', createdAt: Date.now() - 40000 },
  { id: 'p9', name: 'K&N Air Filter', brand: 'K&N', price: 850, images: ['https://placehold.co/400x400/1a1a2e/fff?text=Air+Filter'], rating: 4.5, reviewsCount: 22, stock: 35, category: 'engine', model: 'Honda', createdAt: Date.now() - 70000 },
  { id: 'p10', name: 'LED Headlight Bulb Kit', brand: 'Philips', price: 650, discountedPrice: 520, images: ['https://placehold.co/400x400/e8b830/1a1a2e?text=LED+Headlight'], rating: 4.6, reviewsCount: 41, stock: 60, category: 'electrical', model: 'Universal', createdAt: Date.now() - 80000 },
  { id: 'p11', name: 'Givi Top Box 45L', brand: 'Givi', price: 5500, images: ['https://placehold.co/400x400/f26522/fff?text=Top+Box'], rating: 4.8, reviewsCount: 28, stock: 10, category: 'accessories', model: 'Universal', createdAt: Date.now() - 90000 },
  { id: 'p12', name: 'Battery Yuasa YTX12-BS', brand: 'Yuasa', price: 1500, images: ['https://placehold.co/400x400/1a1a2e/fff?text=Battery'], rating: 4.4, reviewsCount: 19, stock: 25, category: 'electrical', model: 'Yamaha', createdAt: Date.now() - 10000 },
]

const brands = ['All', 'NGK', 'Mobil', 'Brembo', 'DID', 'Showa', 'Michelin', 'RK', 'Motul', 'K&N', 'Philips', 'Givi', 'Yuasa']
const models = ['All', 'Universal', 'Honda', 'Yamaha', 'Kawasaki', 'Suzuki']

export default function ShopPage() {
  const { category } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const searchQuery = searchParams.get('search') || ''

  const [viewMode, setViewMode] = useState('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    brand: 'All',
    model: 'All',
    priceRange: 'all',
    sortBy: 'newest',
    inStock: false,
  })

  const filtered = useMemo(() => {
    let result = [...allProducts]

    if (category) {
      result = result.filter((p) => p.category === category)
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      )
    }

    if (filters.brand !== 'All') {
      result = result.filter((p) => p.brand === filters.brand)
    }
    if (filters.model !== 'All') {
      result = result.filter((p) => p.model === filters.model)
    }
    if (filters.inStock) {
      result = result.filter((p) => p.stock > 0)
    }

    const price = filters.priceRange
    if (price === 'under500') result = result.filter((p) => (p.discountedPrice || p.price) < 500)
    else if (price === '500to1500') result = result.filter((p) => (p.discountedPrice || p.price) >= 500 && (p.discountedPrice || p.price) <= 1500)
    else if (price === '1500to3000') result = result.filter((p) => (p.discountedPrice || p.price) >= 1500 && (p.discountedPrice || p.price) <= 3000)
    else if (price === 'over3000') result = result.filter((p) => (p.discountedPrice || p.price) > 3000)

    switch (filters.sortBy) {
      case 'price-low':
        result.sort((a, b) => (a.discountedPrice || a.price) - (b.discountedPrice || b.price))
        break
      case 'price-high':
        result.sort((a, b) => (b.discountedPrice || b.price) - (a.discountedPrice || a.price))
        break
      case 'rating':
        result.sort((a, b) => b.rating - a.rating)
        break
      case 'newest':
        result.sort((a, b) => b.createdAt - a.createdAt)
        break
    }

    return result
  }, [category, searchQuery, filters])

  const clearFilters = () => {
    setFilters({ brand: 'All', model: 'All', priceRange: 'all', sortBy: 'newest', inStock: false })
    setSearchParams({})
  }

  const categoryName = category
    ? SHOP_CATEGORIES.find((c) => c.id === category)?.name || category
    : 'All Products'

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-hive-black dark:text-white capitalize">
          {searchQuery ? `Search: "${searchQuery}"` : categoryName}
        </h1>
        <p className="text-gray-500 mt-1">{filtered.length} products found</p>
      </div>

      <div className="flex items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${showFilters ? 'bg-hive-yellow border-hive-yellow text-hive-black' : 'border-gray-300 dark:border-gray-600 text-hive-black dark:text-white'}`}
          >
            <FiSliders /> Filters
          </button>
          {category && (
            <span className="px-3 py-1 bg-hive-yellow/10 text-hive-yellow rounded-full text-sm font-medium">
              {SHOP_CATEGORIES.find((c) => c.id === category)?.icon} {categoryName}
            </span>
          )}
          {(filters.brand !== 'All' || filters.model !== 'All' || filters.priceRange !== 'all' || filters.inStock) && (
            <button onClick={clearFilters} className="flex items-center gap-1 px-3 py-1 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
              <FiX /> Clear
            </button>
          )}
        </div>
        <div className="flex items-center gap-3">
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-sm focus:ring-2 focus:ring-hive-yellow outline-none"
          >
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
          <div className="hidden sm:flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-hive-yellow text-hive-black' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              <FiGrid />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-hive-yellow text-hive-black' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              <FiList />
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        {showFilters && (
          <div className="w-64 flex-shrink-0 space-y-6">
            <div className="card p-5">
              <h3 className="font-semibold text-hive-black dark:text-white mb-3">Brand</h3>
              <div className="space-y-2">
                {brands.map((brand) => (
                  <label key={brand} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                    <input
                      type="radio"
                      name="brand"
                      checked={filters.brand === brand}
                      onChange={() => setFilters({ ...filters, brand })}
                      className="accent-hive-yellow"
                    />
                    {brand}
                  </label>
                ))}
              </div>
            </div>

            <div className="card p-5">
              <h3 className="font-semibold text-hive-black dark:text-white mb-3">Motorcycle Model</h3>
              <div className="space-y-2">
                {models.map((model) => (
                  <label key={model} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                    <input
                      type="radio"
                      name="model"
                      checked={filters.model === model}
                      onChange={() => setFilters({ ...filters, model })}
                      className="accent-hive-yellow"
                    />
                    {model}
                  </label>
                ))}
              </div>
            </div>

            <div className="card p-5">
              <h3 className="font-semibold text-hive-black dark:text-white mb-3">Price Range</h3>
              <div className="space-y-2">
                {[
                  { value: 'all', label: 'All Prices' },
                  { value: 'under500', label: 'Under ₱500' },
                  { value: '500to1500', label: '₱500 - ₱1,500' },
                  { value: '1500to3000', label: '₱1,500 - ₱3,000' },
                  { value: 'over3000', label: 'Over ₱3,000' },
                ].map((range) => (
                  <label key={range.value} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                    <input
                      type="radio"
                      name="price"
                      checked={filters.priceRange === range.value}
                      onChange={() => setFilters({ ...filters, priceRange: range.value })}
                      className="accent-hive-yellow"
                    />
                    {range.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="card p-5">
              <label className="flex items-center gap-2 text-sm text-hive-black dark:text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.inStock}
                  onChange={(e) => setFilters({ ...filters, inStock: e.target.checked })}
                  className="accent-hive-yellow"
                />
                In Stock Only
              </label>
            </div>
          </div>
        )}

        <div className="flex-1">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <FiSearch className="text-5xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-hive-black dark:text-white mb-2">No products found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your filters or search terms.</p>
              <button onClick={clearFilters} className="btn-primary">Clear Filters</button>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 gap-4' : 'space-y-4'}>
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
