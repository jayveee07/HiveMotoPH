const admin = require('firebase-admin')
const path = require('path')
const fs = require('fs')

const ENV_PATH = path.resolve(__dirname, '..', '.env')
if (fs.existsSync(ENV_PATH)) {
  const lines = fs.readFileSync(ENV_PATH, 'utf-8').split('\n')
  for (const line of lines) {
    const [key, ...rest] = line.split('=')
    if (key && rest.length) {
      process.env[key.trim()] = rest.join('=').trim().replace(/^['"]|['"]$/g, '')
    }
  }
}

const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT
let serviceAccount = null
if (serviceAccountPath && fs.existsSync(path.resolve(__dirname, '..', serviceAccountPath))) {
  serviceAccount = require(path.resolve(__dirname, '..', serviceAccountPath))
}

if (!serviceAccount) {
  console.log('No service account found. Attempting with application default credentials...')
  console.log('To use a service account:')
  console.log('  1. Download your Firebase service account JSON from Project Settings > Service Accounts')
  console.log('  2. Save it in the project root (e.g., serviceAccount.json)')
  console.log('  3. Add to .env: FIREBASE_SERVICE_ACCOUNT=serviceAccount.json')
  console.log('  4. Re-run this script\n')
  try {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'hivemoto-ph',
    })
  } catch (e) {
    console.error('Could not initialize Firebase Admin:', e.message)
    process.exit(1)
  }
} else {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  })
}

const db = admin.firestore()

// ── Seed Data ──────────────────────────────────────────────

const CATEGORIES = [
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

const PRODUCTS = [
  { id: 'prod-001', name: 'NGK Spark Plug CR7HSA', brand: 'NGK', category: 'engine', price: 180, discountedPrice: 150, stock: 50, rating: 4.5, reviewsCount: 23, salesCount: 230, description: 'High-performance NGK spark plug. Copper core electrode for reliable ignition.', specifications: [{ label: 'Type', value: 'Copper Core' }, { label: 'Thread Size', value: '10mm' }, { label: 'Hex Size', value: '16mm' }, { label: 'Gap', value: '0.7mm' }], compatibleModels: ['Honda Beat', 'Honda Click', 'Yamaha Mio', 'Yamaha NMAX', 'Suzuki Skydrive'], images: ['https://placehold.co/600x600/e8b830/1a1a2e?text=Spark+Plug'], isFeatured: true, isBestSeller: true },
  { id: 'prod-002', name: 'Mobil 1 Racing 4T 10W-40', brand: 'Mobil', category: 'lubricants', price: 550, discountedPrice: 480, stock: 100, rating: 4.8, reviewsCount: 45, salesCount: 180, description: 'Fully synthetic 4-stroke motorcycle engine oil.', specifications: [{ label: 'Viscosity', value: '10W-40' }, { label: 'Capacity', value: '1 Liter' }, { label: 'Type', value: 'Fully Synthetic' }], compatibleModels: ['Universal'], images: ['https://placehold.co/600x600/f26522/fff?text=Engine+Oil'], isFeatured: true, isBestSeller: true },
  { id: 'prod-003', name: 'Brembo Brake Pads Set', brand: 'Brembo', category: 'brakes', price: 1200, stock: 30, rating: 4.7, reviewsCount: 18, salesCount: 95, description: 'Premium sintered brake pads for superior stopping power.', specifications: [{ label: 'Material', value: 'Sintered' }, { label: 'Position', value: 'Front & Rear' }], compatibleModels: ['Honda Click', 'Yamaha NMAX', 'Yamaha Aerox', 'Suzuki Raider'], images: ['https://placehold.co/600x600/1a1a2e/fff?text=Brake+Pads'], isFeatured: true, isBestSeller: false },
  { id: 'prod-004', name: 'DID Heavy Duty Chain Kit', brand: 'DID', category: 'engine', price: 2500, discountedPrice: 2200, stock: 20, rating: 4.6, reviewsCount: 12, salesCount: 67, description: 'O-ring chain kit with front and rear sprockets.', specifications: [{ label: 'Size', value: '428' }, { label: 'Links', value: '120' }, { label: 'Type', value: 'O-Ring' }], compatibleModels: ['Honda Beat', 'Yamaha Mio', 'Suzuki Skydrive'], images: ['https://placehold.co/600x600/e8b830/1a1a2e?text=Chain+Kit'], isFeatured: true, isBestSeller: true },
  { id: 'prod-005', name: 'Showa Shock Absorber', brand: 'Showa', category: 'suspension', price: 3500, stock: 15, rating: 4.4, reviewsCount: 8, salesCount: 34, description: 'Genuine Showa rear shock absorber.', specifications: [{ label: 'Type', value: 'Twin Tube' }, { label: 'Length', value: '320mm' }], compatibleModels: ['Honda Beat', 'Honda Click'], images: ['https://placehold.co/600x600/f26522/fff?text=Shock'], isFeatured: false, isBestSeller: false },
  { id: 'prod-006', name: 'Michelin Pilot Street Radial', brand: 'Michelin', category: 'tires', price: 4500, discountedPrice: 3800, stock: 25, rating: 4.9, reviewsCount: 34, salesCount: 120, description: 'Radial tire for street motorcycles.', specifications: [{ label: 'Front', value: '110/70-17' }, { label: 'Rear', value: '130/70-17' }], compatibleModels: ['Yamaha NMAX', 'Yamaha Aerox', 'Honda PCX'], images: ['https://placehold.co/600x600/1a1a2e/fff?text=Tire'], isFeatured: true, isBestSeller: true },
  { id: 'prod-007', name: 'RK Chain 428 Gold', brand: 'RK', category: 'engine', price: 1800, stock: 40, rating: 4.3, reviewsCount: 15, salesCount: 88, description: 'Premium gold chain for underbone motorcycles.', specifications: [{ label: 'Size', value: '428' }, { label: 'Links', value: '118' }], compatibleModels: ['Honda Beat', 'Yamaha Mio', 'Suzuki Skydrive'], images: ['https://placehold.co/600x600/e8b830/1a1a2e?text=RK+Chain'], isFeatured: false, isBestSeller: false },
  { id: 'prod-008', name: 'Motul Chain Lube Spray', brand: 'Motul', category: 'lubricants', price: 320, discountedPrice: 280, stock: 200, rating: 4.7, reviewsCount: 56, salesCount: 310, description: 'High-adhesion chain lubricant spray.', specifications: [{ label: 'Volume', value: '400ml' }, { label: 'Type', value: 'Aerosol' }], compatibleModels: ['Universal'], images: ['https://placehold.co/600x600/f26522/fff?text=Chain+Lube'], isFeatured: true, isBestSeller: true },
  { id: 'prod-009', name: 'K&N Air Filter', brand: 'K&N', category: 'engine', price: 850, stock: 35, rating: 4.5, reviewsCount: 22, salesCount: 145, description: 'High-flow washable air filter.', specifications: [{ label: 'Type', value: 'High-Flow' }, { label: 'Washable', value: 'Yes' }], compatibleModels: ['Honda Beat', 'Honda Click', 'Yamaha Mio'], images: ['https://placehold.co/600x600/1a1a2e/fff?text=Air+Filter'], isFeatured: false, isBestSeller: false },
  { id: 'prod-010', name: 'LED Headlight Bulb Kit', brand: 'Philips', category: 'electrical', price: 650, discountedPrice: 520, stock: 60, rating: 4.6, reviewsCount: 41, salesCount: 200, description: 'Ultra-bright LED headlight bulbs.', specifications: [{ label: 'Type', value: 'LED' }, { label: 'Lumens', value: '3000lm' }], compatibleModels: ['Universal'], images: ['https://placehold.co/600x600/e8b830/1a1a2e?text=LED+Headlight'], isFeatured: true, isBestSeller: false },
  { id: 'prod-011', name: 'Givi Top Box 45L', brand: 'Givi', category: 'accessories', price: 5500, stock: 10, rating: 4.8, reviewsCount: 28, salesCount: 55, description: 'Large capacity top box.', specifications: [{ label: 'Capacity', value: '45 Liters' }, { label: 'Material', value: 'ABS' }], compatibleModels: ['Universal'], images: ['https://placehold.co/600x600/f26522/fff?text=Top+Box'], isFeatured: false, isBestSeller: false },
  { id: 'prod-012', name: 'Battery Yuasa YTX12-BS', brand: 'Yuasa', category: 'electrical', price: 1500, stock: 25, rating: 4.4, reviewsCount: 19, salesCount: 98, description: 'Maintenance-free sealed battery.', specifications: [{ label: 'Voltage', value: '12V' }, { label: 'Capacity', value: '10Ah' }], compatibleModels: ['Yamaha NMAX', 'Yamaha Aerox', 'Honda PCX', 'Kawasaki Ninja'], images: ['https://placehold.co/600x600/1a1a2e/fff?text=Battery'], isFeatured: false, isBestSeller: false },
]

const SERVICES = [
  { id: 'svc-001', name: 'Change Oil', price: 250, duration: '30 mins', description: 'Engine oil change with filter cleaning.', category: 'maintenance', isPopular: true },
  { id: 'svc-002', name: 'Tune-Up', price: 500, duration: '1 hr', description: 'Complete engine tune-up.', category: 'maintenance', isPopular: true },
  { id: 'svc-003', name: 'CVT Cleaning', price: 350, duration: '45 mins', description: 'CVT cleaning and inspection.', category: 'maintenance', isPopular: true },
  { id: 'svc-004', name: 'Brake Maintenance', price: 300, duration: '45 mins', description: 'Brake pad inspection and adjustment.', category: 'repair', isPopular: true },
  { id: 'svc-005', name: 'Tire Replacement', price: 200, duration: '30 mins', description: 'Tire removal and installation.', category: 'repair', isPopular: false },
  { id: 'svc-006', name: 'Electrical Repair', price: 400, duration: '1 hr', description: 'Electrical system diagnosis and repair.', category: 'repair', isPopular: false },
  { id: 'svc-007', name: 'Engine Repair', price: 1500, duration: '3 hrs', description: 'Major engine repair.', category: 'repair', isPopular: false },
  { id: 'svc-008', name: 'Preventive Maintenance', price: 800, duration: '2 hrs', description: 'Comprehensive PMS check.', category: 'maintenance', isPopular: true },
  { id: 'svc-009', name: 'Custom Modifications', price: 1000, duration: '2 hrs', description: 'Custom parts installation.', category: 'custom', isPopular: false },
  { id: 'svc-010', name: 'General Inspection', price: 150, duration: '20 mins', description: '20-point motorcycle inspection.', category: 'maintenance', isPopular: true },
]

const COUPONS = [
  { id: 'cpn-001', code: 'HIVEMOTO10', discountType: 'percentage', discountValue: 10, minPurchase: 500, maxDiscount: 500, usageLimit: 100, usedCount: 0, expiresAt: '2027-12-31T23:59:59Z', isActive: true, description: '10% off your purchase' },
  { id: 'cpn-002', code: 'RIDER50', discountType: 'fixed', discountValue: 50, minPurchase: 300, maxDiscount: 50, usageLimit: 200, usedCount: 0, expiresAt: '2027-12-31T23:59:59Z', isActive: true, description: '₱50 off' },
  { id: 'cpn-003', code: 'NEWUSER', discountType: 'percentage', discountValue: 15, minPurchase: 0, maxDiscount: 200, usageLimit: 50, usedCount: 0, expiresAt: '2027-12-31T23:59:59Z', isActive: true, description: '15% off for new customers' },
  { id: 'cpn-004', code: 'FREESHIP', discountType: 'fixed', discountValue: 100, minPurchase: 1000, maxDiscount: 100, usageLimit: 50, usedCount: 0, expiresAt: '2026-06-30T23:59:59Z', isActive: true, description: '₱100 off shipping' },
  { id: 'cpn-005', code: 'FLASHSALE', discountType: 'percentage', discountValue: 20, minPurchase: 1000, maxDiscount: 1000, usageLimit: 30, usedCount: 0, expiresAt: '2026-07-15T23:59:59Z', isActive: true, description: 'Flash sale 20% off' },
]

const TESTIMONIALS = [
  { id: 'test-001', name: 'Juan Dela Cruz', role: 'Motorcycle Enthusiast', rating: 5, text: 'Best motorcycle shop in town! Got my parts delivered in 2 days.' },
  { id: 'test-002', name: 'Maria Santos', role: 'Daily Rider', rating: 5, text: 'Booked a tune-up online and it was hassle-free. Very professional.' },
  { id: 'test-003', name: 'Pedro Gonzales', role: 'Fleet Owner', rating: 4, text: 'We source all our parts from HiveMoto. Great prices and reliable delivery.' },
  { id: 'test-004', name: 'Ana Reyes', role: 'Student Rider', rating: 5, text: 'Affordable prices and excellent customer service.' },
  { id: 'test-005', name: 'Carlos Mendoza', role: 'Mechanic', rating: 5, text: 'I trust HiveMoto for authentic parts. Well-stocked inventory.' },
]

const BRANDS_LIST = ['NGK', 'Mobil', 'Brembo', 'DID', 'Showa', 'Michelin', 'RK', 'Motul', 'K&N', 'Philips', 'Givi', 'Yuasa']

const BANNERS = [
  { id: 'bnr-001', title: 'Summer Sale', subtitle: 'Up to 30% off', image: 'https://placehold.co/1920x600/e8b830/1a1a2e?text=Summer+Sale', link: '/shop', isActive: true, order: 1 },
  { id: 'bnr-002', title: 'Free Service Check', subtitle: 'Book PMS, get free inspection', image: 'https://placehold.co/1920x600/f26522/fff?text=Free+Service+Check', link: '/services', isActive: true, order: 2 },
  { id: 'bnr-003', title: 'New Arrivals', subtitle: 'Latest accessories in stock', image: 'https://placehold.co/1920x600/1a1a2e/fff?text=New+Arrivals', link: '/shop/accessories', isActive: true, order: 3 },
]

const SITE_SETTINGS = {
  storeName: 'HiveMoto PH',
  tagline: 'Your Ride, Our Passion',
  email: 'hello@hivemoto.ph',
  phone: '+63 (2) 1234-5678',
  address: '123 Motorcycle Highway, Brgy. San Juan, Manila, Philippines',
  currency: 'PHP',
  taxRate: 0.12,
}

// ── Seeding Logic ──────────────────────────────────────────

const SEED_CONFIG = [
  { collection: 'categories', data: CATEGORIES.map(c => ({ ...c, id: undefined })), ids: CATEGORIES.map(c => c.id) },
  { collection: 'products', data: PRODUCTS.map(p => ({ ...p, id: undefined })), ids: PRODUCTS.map(p => p.id) },
  { collection: 'services', data: SERVICES.map(s => ({ ...s, id: undefined })), ids: SERVICES.map(s => s.id) },
  { collection: 'coupons', data: COUPONS.map(c => ({ ...c, id: undefined })), ids: COUPONS.map(c => c.id) },
  { collection: 'testimonials', data: TESTIMONIALS.map(t => ({ ...t, id: undefined })), ids: TESTIMONIALS.map(t => t.id) },
  { collection: 'banners', data: BANNERS.map(b => ({ ...b, id: undefined })), ids: BANNERS.map(b => b.id) },
  { collection: 'brands', data: BRANDS_LIST.map((name, i) => ({ name, isFeatured: i < 6, id: undefined })), ids: BRANDS_LIST.map((_, i) => `brd-${String(i + 1).padStart(3, '0')}`) },
  { collection: 'settings', data: [{ ...SITE_SETTINGS, id: undefined }], ids: ['main'] },
]

async function isSeeded(collectionName) {
  const snap = await db.collection(collectionName).limit(1).get()
  return !snap.empty
}

async function seedAll() {
  console.log('🌱 HiveMoto PH — Database Seeder\n')
  let total = 0

  for (const { collection, data, ids } of SEED_CONFIG) {
    process.stdout.write(`  Checking "${collection}"... `)

    if (await isSeeded(collection)) {
      console.log('⚠️  Already has data, skipping')
      continue
    }

    const batch = db.batch()
    data.forEach((item, i) => {
      const ref = db.collection(collection).doc(ids[i])
      batch.set(ref, { ...item, createdAt: admin.firestore.FieldValue.serverTimestamp() })
    })

    await batch.commit()
    console.log(`✅ Seeded ${data.length} documents`)
    total += data.length
  }

  console.log(`\n🎉 Done! ${total} documents written across ${SEED_CONFIG.length} collections.\n`)
}

seedAll().catch((err) => {
  console.error('\n❌ Seeding failed:', err.message)
  process.exit(1)
})
