import { useState } from 'react'
import { FiMapPin, FiPhone, FiMail, FiClock, FiSend, FiMessageCircle } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      toast.success('Message sent! We\'ll get back to you soon.')
      setForm({ name: '', email: '', subject: '', message: '' })
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="font-heading text-4xl font-bold text-hive-black dark:text-white">Contact Us</h1>
        <p className="text-gray-500 mt-2 max-w-xl mx-auto">
          Have a question, feedback, or need assistance? We're here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="card p-8">
            <h2 className="font-heading text-2xl font-bold text-hive-black dark:text-white mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name *</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email *</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="input-field" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Subject *</label>
                <input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Message *</label>
                <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={5} required className="input-field" />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                <FiSend /> {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-8">
            <h2 className="font-heading text-2xl font-bold text-hive-black dark:text-white mb-6">Get in Touch</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-hive-yellow/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FiMapPin className="text-hive-yellow text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-hive-black dark:text-white">Address</h3>
                  <p className="text-gray-500 text-sm mt-1">123 Motorcycle Highway<br />Brgy. San Juan, Manila<br />Philippines</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-hive-yellow/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FiPhone className="text-hive-yellow text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-hive-black dark:text-white">Phone</h3>
                  <p className="text-gray-500 text-sm mt-1">+63 (2) 1234-5678<br />+63 912 345 6789</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-hive-yellow/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FiMail className="text-hive-yellow text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-hive-black dark:text-white">Email</h3>
                  <p className="text-gray-500 text-sm mt-1">hello@hivemoto.ph<br />support@hivemoto.ph</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-hive-yellow/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FiClock className="text-hive-yellow text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-hive-black dark:text-white">Business Hours</h3>
                  <p className="text-gray-500 text-sm mt-1">
                    Monday - Saturday: 8:00 AM - 6:00 PM<br />
                    Sunday: 9:00 AM - 4:00 PM<br />
                    <span className="text-red-500 text-xs">Closed on holidays</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="card p-8 bg-hive-yellow/5 border-2 border-hive-yellow/20">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-hive-yellow rounded-xl flex items-center justify-center">
                <FiMessageCircle className="text-hive-black text-xl" />
              </div>
              <div>
                <h3 className="font-heading text-xl font-bold text-hive-black">Need Quick Help?</h3>
                <p className="text-sm text-gray-600">Chat with our support team</p>
              </div>
            </div>
            <button className="btn-primary w-full flex items-center justify-center gap-2">
              <FiMessageCircle /> Start Live Chat
            </button>
            <p className="text-xs text-gray-500 text-center mt-2">Available 8AM - 6PM, Mon-Sat</p>
          </div>

          <div className="card p-6">
            <h3 className="font-semibold text-hive-black dark:text-white mb-4">Location</h3>
            <div className="bg-gray-200 dark:bg-gray-700 h-48 rounded-lg flex items-center justify-center text-gray-500">
              <div className="text-center">
                <FiMapPin className="text-2xl mx-auto mb-2" />
                <p className="text-sm">Google Maps Integration</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
