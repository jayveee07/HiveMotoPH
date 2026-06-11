import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import HomePage from './pages/home/HomePage'
import ShopPage from './pages/shop/ShopPage'
import ProductDetailsPage from './pages/shop/ProductDetailsPage'
import CartPage from './pages/shop/CartPage'
import CheckoutPage from './pages/shop/CheckoutPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import DashboardPage from './pages/dashboard/DashboardPage'
import AdminDashboard from './pages/dashboard/AdminDashboard'
import ServiceBookingPage from './pages/services/ServiceBookingPage'
import ContactPage from './pages/contact/ContactPage'
import WishlistPage from './pages/shop/WishlistPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="shop" element={<ShopPage />} />
        <Route path="shop/:category" element={<ShopPage />} />
        <Route path="product/:id" element={<ProductDetailsPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="wishlist" element={<WishlistPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="admin" element={<AdminDashboard />} />
        <Route path="services" element={<ServiceBookingPage />} />
        <Route path="contact" element={<ContactPage />} />
      </Route>
    </Routes>
  )
}
