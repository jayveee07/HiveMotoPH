export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
  }).format(amount)
}

export function formatDate(date) {
  return new Intl.DateTimeFormat('en-PH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export function formatTime(date) {
  return new Intl.DateTimeFormat('en-PH', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(date))
}

export function truncate(str, length = 100) {
  if (!str) return ''
  if (str.length <= length) return str
  return str.substring(0, length) + '...'
}

export function generateOrderId() {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `HMP-${timestamp}${random}`
}

export function generateBookingId() {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 4).toUpperCase()
  return `BOK-${timestamp}${random}`
}

export function getInitials(name) {
  if (!name) return '?'
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function timeSlots() {
  const slots = []
  for (let hour = 8; hour <= 17; hour++) {
    const time = hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`
    slots.push({ value: `${hour}:00`, label: time })
    if (hour < 17) {
      const halfHour = `${hour}:30`
      const halfLabel =
        hour > 12 ? `${hour - 12}:30 PM` : `${hour}:30 AM`
      slots.push({ value: halfHour, label: halfLabel })
    }
  }
  return slots
}

export function getStatusColor(status) {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    processing: 'bg-indigo-100 text-indigo-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    completed: 'bg-green-100 text-green-800',
    'in-progress': 'bg-orange-100 text-orange-800',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}
