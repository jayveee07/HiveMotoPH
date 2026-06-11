export const COLORS = {
  primary: '#1a1a2e',
  secondary: '#e8b830',
  accent: '#f26522',
  dark: '#0f0f1a',
  light: '#f8f9fa',
}

export const SHOP_CATEGORIES = [
  { id: 'engine', name: 'Engine Parts', icon: '⚙️' },
  { id: 'brakes', name: 'Brake System', icon: '🛑' },
  { id: 'suspension', name: 'Suspension', icon: '🔧' },
  { id: 'electrical', name: 'Electrical', icon: '⚡' },
  { id: 'body', name: 'Body Parts', icon: '🚲' },
  { id: 'tires', name: 'Tires & Wheels', icon: '🛞' },
  { id: 'exhaust', name: 'Exhaust System', icon: '💨' },
  { id: 'accessories', name: 'Accessories', icon: '🧢' },
  { id: 'lubricants', name: 'Lubricants', icon: '🛢️' },
  { id: 'tools', name: 'Tools & Equipment', icon: '🔨' },
]

export const SERVICE_TYPES = [
  { id: 'change-oil', name: 'Change Oil', price: 250, duration: '30 mins' },
  { id: 'tune-up', name: 'Tune-Up', price: 500, duration: '1 hr' },
  { id: 'cvt-cleaning', name: 'CVT Cleaning', price: 350, duration: '45 mins' },
  { id: 'brake-maintenance', name: 'Brake Maintenance', price: 300, duration: '45 mins' },
  { id: 'tire-replacement', name: 'Tire Replacement', price: 200, duration: '30 mins' },
  { id: 'electrical-repair', name: 'Electrical Repair', price: 400, duration: '1 hr' },
  { id: 'engine-repair', name: 'Engine Repair', price: 1500, duration: '3 hrs' },
  { id: 'pms', name: 'Preventive Maintenance', price: 800, duration: '2 hrs' },
  { id: 'custom-mods', name: 'Custom Modifications', price: 1000, duration: '2 hrs' },
  { id: 'general-inspection', name: 'General Inspection', price: 150, duration: '20 mins' },
]

export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
}

export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
}

export const PAYMENT_METHODS = [
  { id: 'gcash', name: 'GCash', icon: '📱' },
  { id: 'maya', name: 'Maya', icon: '💳' },
  { id: 'bank-transfer', name: 'Bank Transfer', icon: '🏦' },
  { id: 'credit-card', name: 'Credit/Debit Card', icon: '💳' },
  { id: 'cod', name: 'Cash on Delivery', icon: '💵' },
  { id: 'pickup', name: 'Cash on Pickup', icon: '🏪' },
]
