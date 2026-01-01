// Pharmacy-related types for MedsBharat marketplace

export interface PharmacyWithDistance {
  id: string
  businessName: string
  address: string
  latitude: number
  longitude: number
  rating: number
  totalReviews: number
  totalOrders: number
  deliveryRadius: number
  distance?: number // calculated client-side
  isOpen?: boolean  // calculated based on operating hours
}

export interface MedicineWithPharmacy {
  id: string
  name: string
  description: string | null
  manufacturer: string | null
  category: string
  packSize: string | null
  price: number
  mrp: number | null
  inStock: boolean
  discountPercent: number | null
  stockQuantity: number | null
  pharmacy: {
    id: string
    businessName: string
    rating: number
    address: string
    latitude: number
    longitude: number
  }
}

export interface PharmacyDetail {
  id: string
  businessName: string
  address: string
  latitude: number
  longitude: number
  rating: number
  totalReviews: number
  totalOrders: number
  deliveryRadius: number
  operatingHours: Record<string, string>
  medicines: Medicine[]
  reviews: Review[]
}

export interface Medicine {
  id: string
  name: string
  description?: string | null
  manufacturer?: string | null
  category: string
  packSize?: string | null
  price: number
  mrp?: number | null
  inStock?: boolean
  discountPercent?: number | null
  stockQuantity?: number | null
  ingredients?: string | null
  requiresPrescription?: boolean
}

export interface Review {
  id: string
  rating: number
  comment: string | null
  createdAt: string
  patient: {
    name: string
  }
}

export interface SearchResult {
  type: 'medicine' | 'pharmacy'
  medicines?: MedicineWithPharmacy[]
  pharmacies?: PharmacyWithDistance[]
  total: number
}

export interface CartItem {
  medicineId: string
  medicineName: string
  pharmacyId: string
  pharmacyName: string
  price: number
  mrp: number | null
  quantity: number
}
