import { collection, doc, setDoc, getDocs, writeBatch, query, limit } from 'firebase/firestore'
import { db } from './firebase'
import { CATEGORIES, PRODUCTS, SERVICES, COUPONS, TESTIMONIALS, BRANDS, BANNERS, SAMPLE_ORDERS, SAMPLE_BOOKINGS, SITE_SETTINGS } from './seedData'

const COLLECTIONS = {
  categories: CATEGORIES,
  products: PRODUCTS,
  services: SERVICES,
  coupons: COUPONS,
  testimonials: TESTIMONIALS,
  brands: BRANDS,
  banners: BANNERS,
  orders: SAMPLE_ORDERS,
  bookings: SAMPLE_BOOKINGS,
  settings: [SITE_SETTINGS],
}

async function isCollectionSeeded(collectionName) {
  const q = query(collection(db, collectionName), limit(1))
  const snap = await getDocs(q)
  return !snap.empty
}

async function seedCollection(collectionName, items, onProgress) {
  if (!Array.isArray(items) || items.length === 0) return 0

  const alreadySeeded = await isCollectionSeeded(collectionName)
  if (alreadySeeded) {
    onProgress?.(`Skipping "${collectionName}" — already has data`)
    return 0
  }

  let count = 0
  const batch = writeBatch(db)
  const maxBatch = 500

  for (const item of items) {
    const id = item.id || item.code || item.orderNumber || item.bookingNumber || 'default'
    const ref = doc(db, collectionName, id)
    batch.set(ref, { ...item, createdAt: item.createdAt || new Date().toISOString() })
    count++

    if (count % maxBatch === 0) {
      await batch.commit()
    }
  }

  if (count % maxBatch !== 0) {
    await batch.commit()
  }

  onProgress?.(`Seeded "${collectionName}" — ${count} documents`)
  return count
}

export async function seedAll(onProgress) {
  const results = {}
  for (const [name, data] of Object.entries(COLLECTIONS)) {
    try {
      const count = await seedCollection(name, data, onProgress)
      results[name] = count
    } catch (err) {
      const msg = `Failed to seed "${name}": ${err.message}`
      onProgress?.(msg)
      results[name] = 0
    }
  }
  return results
}
