export interface AdminUser {
  id: string
  email: string
  name: string
  restaurantId: string
  createdAt: string
}

export interface Order {
  id: string
  tableNumber: number
  items: OrderItem[]
  status: 'placed' | 'prep' | 'in-progress' | 'served'
  totalAmount: number
  createdAt: string
  estimatedTime: number
}

export interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
  image: string
}

export interface Ingredient {
  id: string
  name: string
  category: 'MEAT' | 'SEAFOOD' | 'VEGETABLE' | 'SPICE'
  quantity: number
  unit: string
  status: 'FRESH' | 'WARNING' | 'EXPIRED'
  expiryDate: string
}

export interface Certification {
  id: string
  name: string
  level: string
  issueDate: string
  expiryDate: string
  icon: string
}

export interface SanitizationLog {
  id: string
  sessionType: 'surface_prep' | 'deep_clean' | 'tables_clean'
  employee: string
  date: string
  time: string
  status: 'VERIFIED' | 'PENDING'
}

export interface RestaurantStats {
  totalOrders: number
  pendingOrders: number
  ingredientsInStock: number
  expiringItems: number
  certifications: Certification[]
}
