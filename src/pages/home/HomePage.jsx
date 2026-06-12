import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { collection, getDocs, query, orderBy, limit, addDoc } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { FiArrowRight, FiShoppingBag, FiTool, FiShield, FiTruck, FiClock } from 'react-icons/fi'
import { motion } from 'framer-motion'
import ProductCard from '../../components/ui/ProductCard'
import ServiceCard from '../../components/ui/ServiceCard'
import TestimonialCard from '../../components/ui/TestimonialCard'
import { SHOP_CATEGORIES, SERVICE_TYPES } from '../../lib/constants'
import toast from 'react-hot-toast'

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [testimonials, setTestimonials] = useState([])
  const [brands, setBrands] = useState([])
  const [email, setEmail] = useState('')

  useEffect(() => {
    const fetch = async () => {
      try {
        const [productSnap, testimonialSnap, brandSnap] = await Promise.all([
          getDocs(query(collection(db, 'products'), orderBy('createdAt', 'desc'), limit(8))),
          getDocs(query(collection(db, 'testimonials'), limit(6))),
          getDocs(query(collection(db, 'brands'), limit(12))),
        ])
        setFeaturedProducts(productSnap.docs.map((d) => ({ id: d.id, ...d.data() })))
        setTestimonials(testimonialSnap.docs.map((d) => ({ id: d.id, ...d.data() })))
        setBrands(brandSnap.docs.map((d) => d.data().name || d.id))
      } catch (err) { console.error('Failed to fetch home data:', err) }
    }
    fetch()
  }, [])

  const handleSubscribe = async (e) => {
    e.preventDefault()
    if (!email) return
    try {
      await addDoc(collection(db, 'subscribers'), { email, createdAt: new Date().toISOString() })
      toast.success('Subscribed! Thank you for joining HiveMoto PH.')
      setEmail('')
    } catch (err) { toast.error('Failed to subscribe: ' + err.message) }
  }

  return (
    <div>
      <section className="relative bg-hive-dark overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-hive-dark via-hive-dark/95 to-transparent z-10" />
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'radial-gradient(circle at 25% 50%, #e8b830 0%, transparent 50%), radial-gradient(circle at 75% 50%, #f26522 0%, transparent 50%)'
        }} />
        <div className="relative z-20 max-w-7xl mx-auto px-4 py-20 md:py-28">
          <div className="max-w-2xl">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-hive-yellow font-heading text-lg uppercase tracking-widest mb-4"
            >
              Philippines' Trusted Motorcycle Shop
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-heading text-5xl md:text-7xl font-bold text-white leading-tight mb-6"
            >
              Your Ride, <br />
              <span className="text-hive-yellow">Our Passion</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-gray-300 text-lg mb-8 max-w-xl"
            >
              Premium motorcycle parts, accessories, and expert maintenance services. Gear up your ride with HiveMoto PH.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Link to="/shop" className="btn-primary flex items-center gap-2 text-lg px-8 py-4">
                Shop Now <FiArrowRight />
              </Link>
              <Link to="/services" className="btn-outline flex items-center gap-2 text-lg px-8 py-4">
                Book Service <FiTool />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white dark:bg-hive-dark transition-colors">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: FiTruck, title: 'Free Shipping', desc: 'On orders over ₱1,000' },
              { icon: FiShield, title: 'Quality Guaranteed', desc: '100% authentic parts' },
              { icon: FiClock, title: 'Fast Service', desc: 'Same day installation' },
              { icon: FiShoppingBag, title: 'Easy Returns', desc: '30-day return policy' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6 rounded-xl bg-gray-50 dark:bg-gray-900"
              >
                <item.icon className="text-3xl text-hive-yellow mx-auto mb-3" />
                <h3 className="font-semibold text-hive-black dark:text-white mb-1">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-subtitle">Find exactly what you need for your motorcycle</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {SHOP_CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={`/shop/${cat.id}`}
                  className="card flex flex-col items-center p-6 hover:border-hive-yellow hover:border-2 transition-all duration-200 border-2 border-transparent"
                >
                  <span className="text-3xl mb-2">{cat.icon}</span>
                  <span className="text-sm font-medium text-hive-black dark:text-white text-center">{cat.name}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white dark:bg-hive-dark transition-colors">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-12"
          >
            <div>
              <h2 className="section-title">Featured Products</h2>
              <p className="section-subtitle">Top-rated motorcycle parts and accessories</p>
            </div>
            <Link to="/shop" className="btn-outline text-sm hidden md:flex items-center gap-2">
              View All <FiArrowRight />
            </Link>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 8).map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8 md:hidden">
            <Link to="/shop" className="btn-outline inline-flex items-center gap-2">
              View All Products <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="section-title">Our Services</h2>
            <p className="section-subtitle">Professional motorcycle maintenance and repair</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICE_TYPES.slice(0, 4).map((service, i) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <ServiceCard service={service} onBook={() => window.location.href = '/services'} />
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/services" className="btn-outline inline-flex items-center gap-2">
              View All Services <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-hive-dark relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, #e8b830 0%, transparent 50%)'
        }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-white mb-4">
              Ready to Upgrade Your Ride?
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
              Shop top-quality motorcycle parts or book a professional service appointment today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/shop" className="btn-primary text-lg px-8 py-4">Shop Now</Link>
              <Link to="/services" className="btn-outline text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-hive-dark">Book a Service</Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-white dark:bg-hive-dark transition-colors">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="section-title">What Our Customers Say</h2>
            <p className="section-subtitle">Hear from our satisfied riders</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <TestimonialCard testimonial={t} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center font-heading text-2xl font-semibold text-hive-black dark:text-white mb-8"
          >
            Trusted Brands
          </motion.h2>
          <div className="flex flex-wrap justify-center gap-8 items-center opacity-50">
            {brands.map((brand, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="font-heading text-2xl md:text-3xl text-gray-400 dark:text-gray-600 font-bold tracking-wider"
              >
                {brand}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-hive-yellow">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-hive-black mb-4">
              Stay in the Loop
            </h2>
            <p className="text-hive-black/70 mb-8">
              Subscribe to get updates on new products, promotions, and motorcycle tips.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="input-field flex-1"
              />
              <button type="submit" className="btn-secondary whitespace-nowrap">Subscribe</button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
