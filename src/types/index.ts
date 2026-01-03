// Product Types
export interface Product {
  id: string
  name: string
  slug: string
  description?: string
  shortDescription?: string
  sku: string
  categoryId: string
  brandId?: string
  mrp: number
  sellingPrice: number
  stockQuantity: number
  requiresPrescription: boolean
  composition?: string
  uses?: string
  sideEffects?: string
  dosage?: string
  storage?: string
  manufacturer?: string
  packSize?: string
  packType?: string
  images: string[]
  isActive: boolean
  isFeatured: boolean
  category?: Category
  brand?: Brand
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  parentId?: string
  isActive: boolean
  children?: Category[]
  products?: Product[]
}

export interface Brand {
  id: string
  name: string
  slug: string
  logo?: string
  isActive: boolean
}

// User Types
export interface User {
  id: string
  email?: string
  phone?: string
  name?: string
  image?: string
  role: 'USER' | 'ADMIN' | 'PHARMACIST'
}

export interface Address {
  id: string
  userId: string
  type: 'HOME' | 'WORK' | 'OTHER'
  name: string
  phone: string
  addressLine1: string
  addressLine2?: string
  landmark?: string
  city: string
  state: string
  pincode: string
  isDefault: boolean
}

// Cart Types
export interface CartItem {
  id: string
  productId: string
  quantity: number
  product: Product
}

export interface Cart {
  id: string
  items: CartItem[]
  subtotal: number
  itemCount: number
}

// Order Types
export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'PACKED'
  | 'SHIPPED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RETURNED'
  | 'REFUNDED'

export type PaymentMethod = 'COD' | 'UPI' | 'CARD' | 'NETBANKING' | 'WALLET'
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED'

export interface OrderItem {
  id: string
  productId: string
  productName: string
  productImage?: string
  quantity: number
  mrp: number
  sellingPrice: number
  total: number
}

export interface Order {
  id: string
  orderNumber: string
  userId: string
  addressId: string
  prescriptionId?: string
  subtotal: number
  discount: number
  deliveryFee: number
  tax: number
  total: number
  couponCode?: string
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  status: OrderStatus
  deliverySlot?: string
  trackingNumber?: string
  items: OrderItem[]
  address: Address
  createdAt: string
}

// Prescription Types
export type PrescriptionStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED'

export interface Prescription {
  id: string
  userId: string
  imageUrl: string
  notes?: string
  status: PrescriptionStatus
  verifiedAt?: string
  rejectionReason?: string
  createdAt: string
}

// Coupon Types
export interface Coupon {
  id: string
  code: string
  description?: string
  discountType: 'PERCENTAGE' | 'FIXED'
  discountValue: number
  minOrderValue?: number
  maxDiscount?: number
  validFrom: string
  validUntil: string
  isActive: boolean
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Filter Types
export interface ProductFilters {
  category?: string
  brand?: string
  minPrice?: number
  maxPrice?: number
  requiresPrescription?: boolean
  inStock?: boolean
  sort?: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'newest'
}

// Search Types
export interface SearchResult {
  products: Product[]
  categories: Category[]
  total: number
}

// Pincode Types
export interface PincodeInfo {
  pincode: string
  city: string
  state: string
  isServiceable: boolean
  deliveryDays: number
  codAvailable: boolean
}
