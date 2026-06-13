export const CATEGORIES = [
  { id: 'engine', name: 'Engine Parts', slug: 'engine', icon: '⚙️', description: 'Engine components, pistons, valves, gaskets', order: 1 },
  { id: 'brakes', name: 'Brake System', slug: 'brakes', icon: '🛑', description: 'Brake pads, rotors, calipers, fluids', order: 2 },
  { id: 'suspension', name: 'Suspension', slug: 'suspension', icon: '🔧', description: 'Shocks, forks, linkages, springs', order: 3 },
  { id: 'electrical', name: 'Electrical', slug: 'electrical', icon: '⚡', description: 'Batteries, lights, wiring, CDI units', order: 4 },
  { id: 'body', name: 'Body Parts', slug: 'body', icon: '🚲', description: 'Fairings, panels, mirrors, seats', order: 5 },
  { id: 'tires', name: 'Tires & Wheels', slug: 'tires', icon: '🛞', description: 'Tires, rims, spokes, tubes', order: 6 },
  { id: 'exhaust', name: 'Exhaust System', slug: 'exhaust', icon: '💨', description: 'Mufflers, headers, pipes, gaskets', order: 7 },
  { id: 'accessories', name: 'Accessories', slug: 'accessories', icon: '🧢', description: 'Helmets, gloves, bags, covers', order: 8 },
  { id: 'lubricants', name: 'Lubricants', slug: 'lubricants', icon: '🛢️', description: 'Engine oils, greases, chain lubes', order: 9 },
  { id: 'tools', name: 'Tools & Equipment', slug: 'tools', icon: '🔨', description: 'Tool kits, stands, lifts', order: 10 },
]

export const PRODUCTS = [
  { id: 'prod-001', name: 'NGK Spark Plug CR7HSA', brand: 'NGK', category: 'engine', price: 180, discountedPrice: 150, stock: 50, rating: 4.5, reviewsCount: 23, salesCount: 230, description: 'High-performance NGK spark plug designed for various motorcycle models. Features copper core electrode for reliable ignition and improved fuel efficiency.', specifications: [{ label: 'Type', value: 'Copper Core' }, { label: 'Thread Size', value: '10mm' }, { label: 'Hex Size', value: '16mm' }, { label: 'Gap', value: '0.7mm' }, { label: 'Resistor', value: '5kΩ' }], compatibleModels: ['Honda Beat', 'Honda Click', 'Yamaha Mio', 'Yamaha NMAX', 'Suzuki Skydrive'], images: ['https://placehold.co/600x600/e8b830/1a1a2e?text=Spark+Plug+1', 'https://placehold.co/600x600/f26522/fff?text=Spark+Plug+2'], isFeatured: true, isBestSeller: true, createdAt: Date.now() - 86400000 * 30 },
  { id: 'prod-002', name: 'Mobil 1 Racing 4T 10W-40', brand: 'Mobil', category: 'lubricants', price: 550, discountedPrice: 480, stock: 100, rating: 4.8, reviewsCount: 45, salesCount: 180, description: 'Fully synthetic 4-stroke motorcycle engine oil. Provides superior engine protection and smooth shifting.', specifications: [{ label: 'Viscosity', value: '10W-40' }, { label: 'Capacity', value: '1 Liter' }, { label: 'Type', value: 'Fully Synthetic' }, { label: 'API', value: 'SN' }, { label: 'JASO', value: 'MA2' }], compatibleModels: ['Universal'], images: ['https://placehold.co/600x600/f26522/fff?text=Engine+Oil+1', 'https://placehold.co/600x600/e8b830/1a1a2e?text=Engine+Oil+2'], isFeatured: true, isBestSeller: true, createdAt: Date.now() - 86400000 * 25 },
  { id: 'prod-003', name: 'Brembo Brake Pads Set', brand: 'Brembo', category: 'brakes', price: 1200, discountedPrice: null, stock: 30, rating: 4.7, reviewsCount: 18, salesCount: 95, description: 'Premium sintered brake pads for superior stopping power. Low dust and long-lasting performance.', specifications: [{ label: 'Material', value: 'Sintered' }, { label: 'Position', value: 'Front & Rear' }, { label: 'Type', value: 'Disc Brake' }, { label: 'Fitting', value: 'Direct Replacement' }], compatibleModels: ['Honda Click', 'Yamaha NMAX', 'Yamaha Aerox', 'Suzuki Raider'], images: ['https://placehold.co/600x600/1a1a2e/fff?text=Brake+Pads+1', 'https://placehold.co/600x600/f26522/fff?text=Brake+Pads+2'], isFeatured: true, isBestSeller: false, createdAt: Date.now() - 86400000 * 20 },
  { id: 'prod-004', name: 'DID Heavy Duty Chain Kit', brand: 'DID', category: 'engine', price: 2500, discountedPrice: 2200, stock: 20, rating: 4.6, reviewsCount: 12, salesCount: 67, description: 'Heavy-duty O-ring chain kit with front and rear sprockets. Built for durability and long mileage.', specifications: [{ label: 'Size', value: '428' }, { label: 'Links', value: '120' }, { label: 'Type', value: 'O-Ring' }, { label: 'Color', value: 'Gold' }], compatibleModels: ['Honda Beat', 'Yamaha Mio', 'Suzuki Skydrive'], images: ['https://placehold.co/600x600/e8b830/1a1a2e?text=Chain+Kit+1', 'https://placehold.co/600x600/1a1a2e/fff?text=Chain+Kit+2'], isFeatured: true, isBestSeller: true, createdAt: Date.now() - 86400000 * 18 },
  { id: 'prod-005', name: 'Showa Shock Absorber', brand: 'Showa', category: 'suspension', price: 3500, discountedPrice: null, stock: 15, rating: 4.4, reviewsCount: 8, salesCount: 34, description: 'Genuine Showa rear shock absorber. Provides excellent damping and ride comfort.', specifications: [{ label: 'Type', value: 'Twin Tube' }, { label: 'Length', value: '320mm' }, { label: 'Adjustable', value: 'Preload' }, { label: 'Material', value: 'Steel' }], compatibleModels: ['Honda Beat', 'Honda Click'], images: ['https://placehold.co/600x600/f26522/fff?text=Shock+1'], isFeatured: false, isBestSeller: false, createdAt: Date.now() - 86400000 * 15 },
  { id: 'prod-006', name: 'Michelin Pilot Street Radial', brand: 'Michelin', category: 'tires', price: 4500, discountedPrice: 3800, stock: 25, rating: 4.9, reviewsCount: 34, salesCount: 120, description: 'Radial tire for street motorcycles. Excellent grip in wet and dry conditions.', specifications: [{ label: 'Size Front', value: '110/70-17' }, { label: 'Size Rear', value: '130/70-17' }, { label: 'Type', value: 'Radial' }, { label: 'Speed Rating', value: 'H' }, { label: 'Load Index', value: '54' }], compatibleModels: ['Yamaha NMAX', 'Yamaha Aerox', 'Honda PCX'], images: ['https://placehold.co/600x600/1a1a2e/fff?text=Tire+1', 'https://placehold.co/600x600/e8b830/1a1a2e?text=Tire+2'], isFeatured: true, isBestSeller: true, createdAt: Date.now() - 86400000 * 12 },
  { id: 'prod-007', name: 'RK Chain 428 Gold', brand: 'RK', category: 'engine', price: 1800, discountedPrice: null, stock: 40, rating: 4.3, reviewsCount: 15, salesCount: 88, description: 'Premium gold chain for underbone motorcycles. High tensile strength and corrosion resistance.', specifications: [{ label: 'Size', value: '428' }, { label: 'Links', value: '118' }, { label: 'Type', value: 'Standard' }, { label: 'Color', value: 'Gold' }], compatibleModels: ['Honda Beat', 'Yamaha Mio', 'Suzuki Skydrive'], images: ['https://placehold.co/600x600/e8b830/1a1a2e?text=RK+Chain+1'], isFeatured: false, isBestSeller: false, createdAt: Date.now() - 86400000 * 10 },
  { id: 'prod-008', name: 'Motul Chain Lube Spray', brand: 'Motul', category: 'lubricants', price: 320, discountedPrice: 280, stock: 200, rating: 4.7, reviewsCount: 56, salesCount: 310, description: 'High-adhesion chain lubricant spray. Reduces friction and extends chain life.', specifications: [{ label: 'Volume', value: '400ml' }, { label: 'Type', value: 'Aerosol' }, { label: 'Color', value: 'White' }, { label: 'Base', value: 'Synthetic' }], compatibleModels: ['Universal'], images: ['https://placehold.co/600x600/f26522/fff?text=Chain+Lube+1', 'https://placehold.co/600x600/1a1a2e/fff?text=Chain+Lube+2'], isFeatured: true, isBestSeller: true, createdAt: Date.now() - 86400000 * 8 },
  { id: 'prod-009', name: 'K&N Air Filter', brand: 'K&N', category: 'engine', price: 850, discountedPrice: null, stock: 35, rating: 4.5, reviewsCount: 22, salesCount: 145, description: 'High-flow washable air filter. Increases horsepower and acceleration.', specifications: [{ label: 'Type', value: 'High-Flow' }, { label: 'Material', value: 'Cotton Gauze' }, { label: 'Washable', value: 'Yes' }, { label: 'Reusable', value: 'Yes' }], compatibleModels: ['Honda Beat', 'Honda Click', 'Yamaha Mio'], images: ['https://placehold.co/600x600/1a1a2e/fff?text=Air+Filter+1'], isFeatured: false, isBestSeller: false, createdAt: Date.now() - 86400000 * 7 },
  { id: 'prod-010', name: 'LED Headlight Bulb Kit', brand: 'Philips', category: 'electrical', price: 650, discountedPrice: 520, stock: 60, rating: 4.6, reviewsCount: 41, salesCount: 200, description: 'Ultra-bright LED headlight bulbs. 300% brighter than standard halogen.', specifications: [{ label: 'Type', value: 'LED' }, { label: 'Wattage', value: '20W' }, { label: 'Lumens', value: '3000lm' }, { label: 'Color Temp', value: '6500K' }, { label: 'Voltage', value: '12V' }], compatibleModels: ['Universal'], images: ['https://placehold.co/600x600/e8b830/1a1a2e?text=LED+Headlight+1', 'https://placehold.co/600x600/f26522/fff?text=LED+Headlight+2'], isFeatured: true, isBestSeller: false, createdAt: Date.now() - 86400000 * 5 },
  { id: 'prod-011', name: 'Givi Top Box 45L', brand: 'Givi', category: 'accessories', price: 5500, discountedPrice: null, stock: 10, rating: 4.8, reviewsCount: 28, salesCount: 55, description: 'Large capacity top box with universal mounting plate. Holds two full-face helmets.', specifications: [{ label: 'Capacity', value: '45 Liters' }, { label: 'Material', value: 'ABS Plastic' }, { label: 'Color', value: 'Black' }, { label: 'Lock Type', value: 'Key' }, { label: 'Max Load', value: '5kg' }], compatibleModels: ['Universal'], images: ['https://placehold.co/600x600/f26522/fff?text=Top+Box+1'], isFeatured: false, isBestSeller: false, createdAt: Date.now() - 86400000 * 3 },
  { id: 'prod-012', name: 'Battery Yuasa YTX12-BS', brand: 'Yuasa', category: 'electrical', price: 1500, discountedPrice: null, stock: 25, rating: 4.4, reviewsCount: 19, salesCount: 98, description: 'Maintenance-free sealed battery. High cold cranking amps for reliable starting.', specifications: [{ label: 'Voltage', value: '12V' }, { label: 'Capacity', value: '10Ah' }, { label: 'Type', value: 'AGM' }, { label: 'CCA', value: '210' }, { label: 'Terminal', value: 'Right Positive' }], compatibleModels: ['Yamaha NMAX', 'Yamaha Aerox', 'Honda PCX', 'Kawasaki Ninja'], images: ['https://placehold.co/600x600/1a1a2e/fff?text=Battery+1'], isFeatured: false, isBestSeller: false, createdAt: Date.now() - 86400000 },
]

export const SERVICES = [
  { id: 'svc-001', name: 'Change Oil', price: 250, duration: '30 mins', description: 'Engine oil change with filter cleaning. Includes disposal of used oil.', category: 'maintenance', isPopular: true },
  { id: 'svc-002', name: 'Tune-Up', price: 500, duration: '1 hr', description: 'Complete engine tune-up including carburetor/throttle body cleaning, valve adjustment, and ignition timing.', category: 'maintenance', isPopular: true },
  { id: 'svc-003', name: 'CVT Cleaning', price: 350, duration: '45 mins', description: 'Continuous Variable Transmission cleaning and inspection. Includes belt and roller check.', category: 'maintenance', isPopular: true },
  { id: 'svc-004', name: 'Brake Maintenance', price: 300, duration: '45 mins', description: 'Brake pad inspection, cleaning, and adjustment. Brake fluid check and top-up.', category: 'repair', isPopular: true },
  { id: 'svc-005', name: 'Tire Replacement', price: 200, duration: '30 mins', description: 'Tire removal and installation. Includes balancing and old tire disposal.', category: 'repair', isPopular: false },
  { id: 'svc-006', name: 'Electrical Repair', price: 400, duration: '1 hr', description: 'Electrical system diagnosis and repair. Wiring, lights, horn, and ignition system.', category: 'repair', isPopular: false },
  { id: 'svc-007', name: 'Engine Repair', price: 1500, duration: '3 hrs', description: 'Major engine repair including top and bottom end overhaul. Parts charged separately.', category: 'repair', isPopular: false },
  { id: 'svc-008', name: 'Preventive Maintenance', price: 800, duration: '2 hrs', description: 'Comprehensive PMS check: oil change, filter cleaning, chain adjustment, tire pressure, bolt tightening.', category: 'maintenance', isPopular: true },
  { id: 'svc-009', name: 'Custom Modifications', price: 1000, duration: '2 hrs', description: 'Custom parts installation, body kit fitting, performance upgrades. Consultation included.', category: 'custom', isPopular: false },
  { id: 'svc-010', name: 'General Inspection', price: 150, duration: '20 mins', description: 'Basic 20-point inspection to assess overall motorcycle condition.', category: 'maintenance', isPopular: true },
]

export const COUPONS = [
  { id: 'cpn-001', code: 'HIVEMOTO10', discountType: 'percentage', discountValue: 10, minPurchase: 500, maxDiscount: 500, usageLimit: 100, usedCount: 0, expiresAt: new Date('2027-12-31').toISOString(), isActive: true, description: '10% off your purchase' },
  { id: 'cpn-002', code: 'RIDER50', discountType: 'fixed', discountValue: 50, minPurchase: 300, maxDiscount: 50, usageLimit: 200, usedCount: 0, expiresAt: new Date('2027-12-31').toISOString(), isActive: true, description: '₱50 off on orders ₱300+' },
  { id: 'cpn-003', code: 'NEWUSER', discountType: 'percentage', discountValue: 15, minPurchase: 0, maxDiscount: 200, usageLimit: 50, usedCount: 0, expiresAt: new Date('2027-12-31').toISOString(), isActive: true, description: '15% off for new customers' },
  { id: 'cpn-004', code: 'FREESHIP', discountType: 'fixed', discountValue: 100, minPurchase: 1000, maxDiscount: 100, usageLimit: 50, usedCount: 0, expiresAt: new Date('2027-06-30').toISOString(), isActive: true, description: '₱100 off shipping on orders ₱1k+' },
  { id: 'cpn-005', code: 'FLASHSALE', discountType: 'percentage', discountValue: 20, minPurchase: 1000, maxDiscount: 1000, usageLimit: 30, usedCount: 0, expiresAt: new Date('2026-07-15').toISOString(), isActive: true, description: 'Flash sale 20% off' },
]

export const TESTIMONIALS = [
  { id: 'test-001', name: 'Juan Dela Cruz', role: 'Motorcycle Enthusiast', rating: 5, text: 'Best motorcycle shop in town! Got my parts delivered in 2 days. Highly recommend HiveMoto PH for all your needs.', avatar: '' },
  { id: 'test-002', name: 'Maria Santos', role: 'Daily Rider', rating: 5, text: 'Booked a tune-up service online and it was hassle-free. The mechanics are very professional and knowledgeable.', avatar: '' },
  { id: 'test-003', name: 'Pedro Gonzales', role: 'Fleet Owner', rating: 4, text: 'We source all our maintenance parts from HiveMoto. Great prices and reliable delivery for our fleet of delivery motorcycles.', avatar: '' },
  { id: 'test-004', name: 'Ana Reyes', role: 'Student Rider', rating: 5, text: 'Affordable prices and excellent customer service. They helped me find the right parts for my first motorcycle.', avatar: '' },
  { id: 'test-005', name: 'Carlos Mendoza', role: 'Mechanic', rating: 5, text: 'As a professional mechanic, I trust HiveMoto for authentic parts. Their inventory is always well-stocked.', avatar: '' },
]

export const BRANDS = [
  { id: 'brd-001', name: 'NGK', logo: '', isFeatured: true },
  { id: 'brd-002', name: 'Mobil', logo: '', isFeatured: true },
  { id: 'brd-003', name: 'Brembo', logo: '', isFeatured: true },
  { id: 'brd-004', name: 'DID', logo: '', isFeatured: true },
  { id: 'brd-005', name: 'Showa', logo: '', isFeatured: false },
  { id: 'brd-006', name: 'Michelin', logo: '', isFeatured: true },
  { id: 'brd-007', name: 'RK', logo: '', isFeatured: false },
  { id: 'brd-008', name: 'Motul', logo: '', isFeatured: true },
  { id: 'brd-009', name: 'K&N', logo: '', isFeatured: false },
  { id: 'brd-010', name: 'Philips', logo: '', isFeatured: false },
  { id: 'brd-011', name: 'Givi', logo: '', isFeatured: false },
  { id: 'brd-012', name: 'Yuasa', logo: '', isFeatured: false },
]

export const BANNERS = [
  { id: 'bnr-001', title: 'Summer Sale', subtitle: 'Up to 30% off on selected parts', image: 'https://placehold.co/1920x600/e8b830/1a1a2e?text=Summer+Sale', link: '/shop', isActive: true, order: 1 },
  { id: 'bnr-002', title: 'Free Service Check', subtitle: 'Book a PMS and get free inspection', image: 'https://placehold.co/1920x600/f26522/fff?text=Free+Service+Check', link: '/services', isActive: true, order: 2 },
  { id: 'bnr-003', title: 'New Arrivals', subtitle: 'Latest motorcycle accessories in stock', image: 'https://placehold.co/1920x600/1a1a2e/fff?text=New+Arrivals', link: '/shop/accessories', isActive: true, order: 3 },
]

export const SAMPLE_ORDERS = [
  { id: 'order-sample-001', orderNumber: 'HMP-A1B2C3', status: 'delivered', items: [{ productId: 'prod-001', quantity: 2, price: 150 }, { productId: 'prod-008', quantity: 1, price: 280 }], subtotal: 580, shipping: 0, discount: 0, total: 580, paymentMethod: 'gcash', shippingAddress: { firstName: 'Juan', lastName: 'Dela Cruz', address: '123 Rizal St.', city: 'Manila', province: 'Metro Manila', zip: '1000', phone: '+63 912 345 6789' }, createdAt: new Date('2026-05-15').toISOString(), deliveredAt: new Date('2026-05-18').toISOString() },
  { id: 'order-sample-002', orderNumber: 'HMP-D4E5F6', status: 'shipped', items: [{ productId: 'prod-003', quantity: 1, price: 1200 }, { productId: 'prod-009', quantity: 1, price: 850 }], subtotal: 2050, shipping: 0, discount: 205, total: 1845, paymentMethod: 'maya', shippingAddress: { firstName: 'Maria', lastName: 'Santos', address: '456 Mabini Ave.', city: 'Quezon City', province: 'Metro Manila', zip: '1100', phone: '+63 917 234 5678' }, createdAt: new Date('2026-06-01').toISOString() },
  { id: 'order-sample-003', orderNumber: 'HMP-G7H8I9', status: 'pending', items: [{ productId: 'prod-006', quantity: 1, price: 3800 }], subtotal: 3800, shipping: 0, discount: 0, total: 3800, paymentMethod: 'cod', shippingAddress: { firstName: 'Pedro', lastName: 'Gonzales', address: '789 Bonifacio St.', city: 'Cebu City', province: 'Cebu', zip: '6000', phone: '+63 923 456 7890' }, createdAt: new Date('2026-06-10').toISOString() },
  { id: 'order-sample-004', orderNumber: 'HMP-J1K2L3', status: 'processing', items: [{ productId: 'prod-002', quantity: 3, price: 480 }, { productId: 'prod-008', quantity: 2, price: 280 }], subtotal: 2000, shipping: 0, discount: 200, total: 1800, paymentMethod: 'bank-transfer', shippingAddress: { firstName: 'Ana', lastName: 'Reyes', address: '321 Luna St.', city: 'Davao City', province: 'Davao del Sur', zip: '8000', phone: '+63 908 765 4321' }, createdAt: new Date('2026-06-08').toISOString() },
]

export const SAMPLE_BOOKINGS = [
  { id: 'booking-sample-001', bookingNumber: 'BOK-A1B2', serviceId: 'svc-001', serviceName: 'Change Oil', customerName: 'Juan Dela Cruz', email: 'juan@example.com', phone: '+63 912 345 6789', motorcycleModel: 'Honda Beat', motorcycleYear: 2023, date: '2026-06-20', time: '09:00', status: 'confirmed', notes: 'Please use fully synthetic oil', createdAt: new Date('2026-06-10').toISOString() },
  { id: 'booking-sample-002', bookingNumber: 'BOK-C3D4', serviceId: 'svc-003', serviceName: 'CVT Cleaning', customerName: 'Maria Santos', email: 'maria@example.com', phone: '+63 917 234 5678', motorcycleModel: 'Yamaha Mio', motorcycleYear: 2022, date: '2026-06-22', time: '14:00', status: 'pending', notes: '', createdAt: new Date('2026-06-11').toISOString() },
]

export const SITE_SETTINGS = {
  storeName: 'HiveMoto PH',
  tagline: 'Your Ride, Our Passion',
  email: 'hello@hivemoto.ph',
  phone: '+63 (2) 1234-5678',
  mobile: '+63 912 345 6789',
  address: '123 Motorcycle Highway, Brgy. San Juan, Manila, Philippines',
  businessHours: { weekdays: '8:00 AM - 6:00 PM', saturday: '8:00 AM - 6:00 PM', sunday: '9:00 AM - 4:00 PM' },
  socialMedia: { facebook: 'https://facebook.com/hivemotoph', instagram: 'https://instagram.com/hivemotoph', tiktok: 'https://tiktok.com/@hivemotoph', youtube: 'https://youtube.com/@hivemotoph' },
  shipping: { freeShippingThreshold: 1000, standardFee: 100, estimatedDelivery: '3-5 business days' },
  currency: 'PHP',
  taxRate: 0.12,
}

export const SAMPLE_REVIEWS = [
  { id: 'rev-001', productId: 'prod-001', userId: '', userName: 'Juan Dela Cruz', rating: 5, text: 'Great spark plug! My Honda Beat runs smoother than ever.', createdAt: Date.now() - 86400000 * 20 },
  { id: 'rev-002', productId: 'prod-001', userId: '', userName: 'Pedro Gonzales', rating: 4, text: 'Good quality for the price. Works well on my Click.', createdAt: Date.now() - 86400000 * 15 },
  { id: 'rev-003', productId: 'prod-002', userId: '', userName: 'Maria Santos', rating: 5, text: 'Best engine oil for the price. My NMAX loves it!', createdAt: Date.now() - 86400000 * 10 },
  { id: 'rev-004', productId: 'prod-002', userId: '', userName: 'Carlos Mendoza', rating: 4, text: 'Good synthetic oil. Smooth shifting.', createdAt: Date.now() - 86400000 * 8 },
  { id: 'rev-005', productId: 'prod-003', userId: '', userName: 'Ana Reyes', rating: 5, text: 'Excellent brake pads! Stopping power is impressive.', createdAt: Date.now() - 86400000 * 12 },
  { id: 'rev-006', productId: 'prod-006', userId: '', userName: 'Ramon Cruz', rating: 5, text: 'Best tires I have used. Great grip on wet roads.', createdAt: Date.now() - 86400000 * 7 },
  { id: 'rev-007', productId: 'prod-008', userId: '', userName: 'Jose Rizal', rating: 5, text: 'Keeps my chain in top condition. Highly recommend.', createdAt: Date.now() - 86400000 * 5 },
  { id: 'rev-008', productId: 'prod-010', userId: '', userName: 'Luna Garcia', rating: 4, text: 'Very bright LED bulbs. Easy to install.', createdAt: Date.now() - 86400000 * 3 },
]
