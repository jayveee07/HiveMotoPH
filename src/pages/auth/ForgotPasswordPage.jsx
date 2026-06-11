import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiMail, FiArrowLeft } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useAuth } from '../../contexts/AuthContext'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const { resetPassword } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await resetPassword(email)
      setSent(true)
      toast.success('Password reset email sent!')
    } catch (err) {
      toast.error(err.message.replace('Firebase: ', '').replace(/\(.*\)/, ''))
    }
    setLoading(false)
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="card p-8">
          <div className="text-center mb-8">
            <h1 className="font-heading text-3xl font-bold text-hive-black dark:text-white">Reset Password</h1>
            <p className="text-gray-500 mt-2">
              {sent ? 'Check your email for the reset link' : "Enter your email and we'll send you a reset link"}
            </p>
          </div>

          {sent ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiMail className="text-2xl text-green-600" />
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                We've sent a password reset link to <strong>{email}</strong>. Please check your inbox and follow the instructions.
              </p>
              <Link to="/login" className="btn-primary inline-block">
                Back to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-hive-black dark:text-white mb-2">Email</label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="input-field pl-10"
                  />
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          )}

          <div className="text-center mt-6">
            <Link to="/login" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-hive-yellow transition-colors">
              <FiArrowLeft /> Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
