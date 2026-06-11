import { Link } from 'react-router-dom'
import { FiMapPin, FiPhone, FiMail, FiClock, FiFacebook, FiInstagram, FiYoutube, FiPackage } from 'react-icons/fi'
import { FaTiktok } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="bg-hive-dark text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="mb-4">
            <img src="/HiveMoto PH.png" alt="HiveMoto PH" className="h-12 w-auto" />
          </div>
            <p className="text-gray-400 mb-4 text-sm leading-relaxed">
              Your trusted partner for motorcycle parts, accessories, and professional maintenance services. Ride safe, ride with HiveMoto!
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-hive-yellow hover:text-hive-black rounded-lg flex items-center justify-center transition-colors">
                <FiFacebook />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-hive-yellow hover:text-hive-black rounded-lg flex items-center justify-center transition-colors">
                <FiInstagram />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-hive-yellow hover:text-hive-black rounded-lg flex items-center justify-center transition-colors">
                <FaTiktok />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-hive-yellow hover:text-hive-black rounded-lg flex items-center justify-center transition-colors">
                <FiYoutube />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-heading text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/shop" className="hover:text-hive-yellow transition-colors">Shop All Products</Link></li>
              <li><Link to="/services" className="hover:text-hive-yellow transition-colors">Book a Service</Link></li>
              <li><Link to="/cart" className="hover:text-hive-yellow transition-colors">Shopping Cart</Link></li>
              <li><Link to="/wishlist" className="hover:text-hive-yellow transition-colors">Wishlist</Link></li>
              <li><Link to="/contact" className="hover:text-hive-yellow transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-lg font-semibold text-white mb-4">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/shop/engine" className="hover:text-hive-yellow transition-colors">Engine Parts</Link></li>
              <li><Link to="/shop/brakes" className="hover:text-hive-yellow transition-colors">Brake System</Link></li>
              <li><Link to="/shop/tires" className="hover:text-hive-yellow transition-colors">Tires & Wheels</Link></li>
              <li><Link to="/shop/electrical" className="hover:text-hive-yellow transition-colors">Electrical Parts</Link></li>
              <li><Link to="/shop/accessories" className="hover:text-hive-yellow transition-colors">Accessories</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-lg font-semibold text-white mb-4">Visit Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <FiMapPin className="mt-1 text-hive-yellow flex-shrink-0" />
                <span>123 Motorcycle Highway, Brgy. San Juan, Manila, Philippines</span>
              </li>
              <li className="flex items-center gap-3">
                <FiPhone className="text-hive-yellow flex-shrink-0" />
                <span>+63 (2) 1234-5678</span>
              </li>
              <li className="flex items-center gap-3">
                <FiMail className="text-hive-yellow flex-shrink-0" />
                <span>hello@hivemoto.ph</span>
              </li>
              <li className="flex items-start gap-3">
                <FiClock className="mt-1 text-hive-yellow flex-shrink-0" />
                <div>
                  <p>Mon - Sat: 8:00 AM - 6:00 PM</p>
                  <p>Sunday: 9:00 AM - 4:00 PM</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} HiveMoto PH. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link to="#" className="hover:text-hive-yellow transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-hive-yellow transition-colors">Terms of Service</Link>
            <Link to="#" className="hover:text-hive-yellow transition-colors">Returns Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
