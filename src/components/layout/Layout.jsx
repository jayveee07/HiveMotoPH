import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import { useAuth } from '../../contexts/AuthContext'

function AuthHandler() {
  const navigate = useNavigate()
  const { setOnLogout, setOnAdminLogin } = useAuth()

  useEffect(() => {
    setOnLogout(() => navigate('/dashboard', { replace: true }))
    setOnAdminLogin(() => navigate('/admin', { replace: true }))
  }, [])

  return null
}

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <AuthHandler />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
