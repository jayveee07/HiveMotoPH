import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiLoader } from 'react-icons/fi'

export default function SetupPage() {
  const navigate = useNavigate()

  useEffect(() => {
    navigate('/admin?tab=settings', { replace: true })
  }, [navigate])

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <FiLoader className="animate-spin text-3xl text-hive-yellow" />
    </div>
  )
}
