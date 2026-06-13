import { useState, useEffect } from 'react'
import { FiTool, FiClock, FiCalendar, FiUser, FiFileText, FiCheck, FiArrowRight } from 'react-icons/fi'
import { collection, addDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'
import ServiceCard from '../../components/ui/ServiceCard'
import { SERVICE_TYPES } from '../../lib/constants'
import { formatCurrency, generateBookingId, timeSlots } from '../../lib/helpers'

const motorcycleModels = [
  'Honda Beat', 'Honda Click', 'Honda PCX', 'Yamaha Mio', 'Yamaha NMAX',
  'Yamaha Aerox', 'Suzuki Skydrive', 'Suzuki Raider', 'Kawasaki Rouser',
  'Kawasaki Ninja', 'Other',
]

export default function ServiceBookingPage() {
  const { currentUser, userProfile } = useAuth()
  const [step, setStep] = useState('services')
  const [selectedService, setSelectedService] = useState(null)
  const [booking, setBooking] = useState({
    model: '',
    year: new Date().getFullYear(),
    date: '',
    time: '',
    notes: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  })
  const [confirmed, setConfirmed] = useState(null)
  const [bookedSlots, setBookedSlots] = useState([])

  useEffect(() => {
    if (booking.date) {
      const fetchBooked = async () => {
        try {
          const q = query(collection(db, 'bookings'), where('date', '==', booking.date))
          const snap = await getDocs(q)
          setBookedSlots(snap.docs.filter((d) => d.data().status !== 'cancelled').map((d) => d.data().time).filter(Boolean))
        } catch { setBookedSlots([]) }
      }
      fetchBooked()
    }
  }, [booking.date])

  useEffect(() => {
    if (currentUser) {
      setBooking((prev) => ({
        ...prev,
        firstName: currentUser.displayName?.split(' ')[0] || '',
        lastName: currentUser.displayName?.split(' ').slice(1).join(' ') || '',
        email: currentUser.email || '',
        phone: userProfile?.phone || '',
      }))
    }
  }, [currentUser, userProfile])

  const handleSelectService = (service) => {
    setSelectedService(service)
    setStep('form')
    window.scrollTo(0, 0)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (bookedSlots.includes(booking.time)) {
      toast.error('This time slot is already booked. Please choose another.')
      return
    }
    const bookingId = generateBookingId()
    try {
      await addDoc(collection(db, 'bookings'), {
        bookingNumber: bookingId,
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        customerName: `${booking.firstName} ${booking.lastName}`.trim(),
        email: booking.email,
        phone: booking.phone,
        userId: currentUser?.uid || '',
        motorcycleModel: booking.model,
        motorcycleYear: Number(booking.year),
        date: booking.date,
        time: booking.time,
        notes: booking.notes,
        status: 'pending',
        createdAt: serverTimestamp(),
      })
      setConfirmed({ ...booking, service: selectedService, id: bookingId })
      setStep('confirmed')
      toast.success('Booking confirmed!')
    } catch (err) {
      toast.error('Failed to book: ' + err.message)
    }
  }

  if (step === 'confirmed' && confirmed) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiCheck className="text-3xl text-green-600" />
        </div>
        <h1 className="font-heading text-3xl font-bold text-hive-black dark:text-white mb-2">Booking Confirmed!</h1>
        <p className="text-gray-500 mb-8">Your service appointment has been booked.</p>
        <div className="card p-8 text-left mb-8">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Booking ID</p>
              <p className="font-semibold text-hive-yellow">{confirmed.id}</p>
            </div>
            <div>
              <p className="text-gray-500">Service</p>
              <p className="font-semibold">{confirmed.service.name}</p>
            </div>
            <div>
              <p className="text-gray-500">Date</p>
              <p className="font-semibold">{confirmed.date}</p>
            </div>
            <div>
              <p className="text-gray-500">Time</p>
              <p className="font-semibold">{timeSlots().find((s) => s.value === confirmed.time)?.label || confirmed.time}</p>
            </div>
            <div>
              <p className="text-gray-500">Motorcycle</p>
              <p className="font-semibold">{confirmed.model} ({confirmed.year})</p>
            </div>
            <div>
              <p className="text-gray-500">Estimated Cost</p>
              <p className="font-semibold text-hive-orange">{formatCurrency(confirmed.service.price)}</p>
            </div>
          </div>
        </div>
        <button onClick={() => { setStep('services'); setSelectedService(null); setConfirmed(null) }} className="btn-primary">
          Book Another Service
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="font-heading text-4xl font-bold text-hive-black dark:text-white">Book a Service</h1>
        <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
          Schedule your motorcycle service online. Choose from our wide range of professional services.
        </p>
      </div>

      {step === 'services' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICE_TYPES.map((service) => (
            <ServiceCard key={service.id} service={service} onBook={() => handleSelectService(service)} />
          ))}
        </div>
      )}

      {step === 'form' && selectedService && (
        <div className="max-w-3xl mx-auto">
          <button onClick={() => setStep('services')} className="text-sm text-gray-500 hover:text-hive-yellow mb-6 inline-flex items-center gap-1">
            ← Back to services
          </button>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div className="md:col-span-3">
              <div className="card p-6">
                <h2 className="font-heading text-xl font-bold text-hive-black dark:text-white mb-6">
                  Service Details
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Motorcycle Model *</label>
                    <select
                      value={booking.model}
                      onChange={(e) => setBooking({ ...booking, model: e.target.value })}
                      required
                      className="input-field"
                    >
                      <option value="">Select your motorcycle</option>
                      {motorcycleModels.map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Year *</label>
                    <input
                      type="number"
                      value={booking.year}
                      onChange={(e) => setBooking({ ...booking, year: e.target.value })}
                      min={2000}
                      max={new Date().getFullYear() + 1}
                      required
                      className="input-field"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Preferred Date *</label>
                      <input
                        type="date"
                        value={booking.date}
                        onChange={(e) => setBooking({ ...booking, date: e.target.value })}
                        min={new Date().toISOString().split('T')[0]}
                        required
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Preferred Time *</label>
                      <select
                        value={booking.time}
                        onChange={(e) => setBooking({ ...booking, time: e.target.value })}
                        required
                        className="input-field"
                      >
                        <option value="">Select time</option>
                        {timeSlots().map((slot) => {
                          const isBooked = bookedSlots.includes(slot.value)
                          return (
                            <option key={slot.value} value={slot.value} disabled={isBooked}>
                              {slot.label}{isBooked ? ' (Booked)' : ''}
                            </option>
                          )
                        })}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Additional Notes</label>
                    <textarea
                      value={booking.notes}
                      onChange={(e) => setBooking({ ...booking, notes: e.target.value })}
                      rows={3}
                      className="input-field"
                      placeholder="Describe any issues or special requests..."
                    />
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <h3 className="font-semibold text-hive-black dark:text-white mb-4">Contact Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">First Name *</label>
                        <input
                          type="text"
                          value={booking.firstName}
                          onChange={(e) => setBooking({ ...booking, firstName: e.target.value })}
                          required
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Last Name *</label>
                        <input
                          type="text"
                          value={booking.lastName}
                          onChange={(e) => setBooking({ ...booking, lastName: e.target.value })}
                          required
                          className="input-field"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Email *</label>
                        <input
                          type="email"
                          value={booking.email}
                          onChange={(e) => setBooking({ ...booking, email: e.target.value })}
                          required
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Phone *</label>
                        <input
                          type="tel"
                          value={booking.phone}
                          onChange={(e) => setBooking({ ...booking, phone: e.target.value })}
                          required
                          className="input-field"
                        />
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                    Confirm Booking <FiArrowRight />
                  </button>
                </form>
              </div>
            </div>

            <div className="md:col-span-2">
              {booking.date && booking.time && bookedSlots.includes(booking.time) && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-4">
                  <p className="text-sm font-medium text-red-700 dark:text-red-400">This time slot is already booked. Please select another.</p>
                </div>
              )}
          <div className="card p-6 sticky top-24">
                <h3 className="font-heading text-lg font-bold text-hive-black dark:text-white mb-4">Service Summary</h3>
                <div className="p-4 bg-hive-yellow/5 rounded-xl mb-4">
                  <div className="w-12 h-12 bg-hive-yellow/10 rounded-xl flex items-center justify-center mb-3">
                    <FiTool className="text-xl text-hive-yellow" />
                  </div>
                  <h4 className="font-semibold text-hive-black dark:text-white">{selectedService.name}</h4>
                  <p className="text-sm text-gray-500 mt-1">Professional service by certified mechanics</p>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 flex items-center gap-2"><FiClock /> Duration</span>
                    <span className="font-medium">{selectedService.duration}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-3">
                    <span className="text-gray-500">Labor Cost</span>
                    <span className="font-medium">{formatCurrency(selectedService.price)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Parts</span>
                    <span className="font-medium">Included</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-3 font-bold text-lg">
                    <span>Total</span>
                    <span className="text-hive-orange">{formatCurrency(selectedService.price)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
