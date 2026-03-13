import type {
  Order,
  Ingredient,
  Certification,
  SanitizationLog,
  RestaurantStats,
} from '@/lib/types/admin'

export const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    tableNumber: 5,
    items: [
      {
        id: '1',
        name: 'Chicken Biryani',
        quantity: 2,
        price: 2000,
        image: 'https://images.unsplash.com/photo-1631515243166-7c5e1cebf4db?w=300',
      },
    ],
    status: 'placed',
    totalAmount: 4400,
    createdAt: new Date().toISOString(),
    estimatedTime: 25,
  },
  {
    id: 'ORD-002',
    tableNumber: 12,
    items: [
      {
        id: '2',
        name: 'Mixed Nasi Goreng',
        quantity: 1,
        price: 3000,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300',
      },
    ],
    status: 'prep',
    totalAmount: 3300,
    createdAt: new Date(Date.now() - 10 * 60000).toISOString(),
    estimatedTime: 15,
  },
  {
    id: 'ORD-003',
    tableNumber: 8,
    items: [
      {
        id: '3',
        name: 'Sushi Rolls',
        quantity: 1,
        price: 2500,
        image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=300',
      },
    ],
    status: 'in-progress',
    totalAmount: 2750,
    createdAt: new Date(Date.now() - 20 * 60000).toISOString(),
    estimatedTime: 5,
  },
]

export const mockIngredients: Ingredient[] = [
  {
    id: 'ing-001',
    name: 'Chicken',
    category: 'MEAT',
    quantity: 15,
    unit: 'kg',
    status: 'FRESH',
    expiryDate: '2026-03-25',
  },
  {
    id: 'ing-002',
    name: 'Prawns',
    category: 'SEAFOOD',
    quantity: 8,
    unit: 'kg',
    status: 'WARNING',
    expiryDate: '2026-03-16',
  },
  {
    id: 'ing-003',
    name: 'Carrots',
    category: 'VEGETABLE',
    quantity: 20,
    unit: 'kg',
    status: 'FRESH',
    expiryDate: '2026-03-30',
  },
  {
    id: 'ing-004',
    name: 'Tomatoes',
    category: 'VEGETABLE',
    quantity: 12,
    unit: 'kg',
    status: 'EXPIRED',
    expiryDate: '2026-02-12',
  },
  {
    id: 'ing-005',
    name: 'Spices Mix',
    category: 'SPICE',
    quantity: 5,
    unit: 'kg',
    status: 'FRESH',
    expiryDate: '2026-04-10',
  },
  {
    id: 'ing-006',
    name: 'Garlic',
    category: 'VEGETABLE',
    quantity: 5,
    unit: 'kg',
    status: 'FRESH',
    expiryDate: '2026-03-28',
  },
  {
    id: 'ing-007',
    name: 'Onions',
    category: 'VEGETABLE',
    quantity: 50,
    unit: 'kg',
    status: 'FRESH',
    expiryDate: '2026-04-15',
  },
  {
    id: 'ing-008',
    name: 'Ginger',
    category: 'SPICE',
    quantity: 2,
    unit: 'kg',
    status: 'WARNING',
    expiryDate: '2026-03-14',
  },
  {
    id: 'ing-009',
    name: 'Beans',
    category: 'VEGETABLE',
    quantity: 10,
    unit: 'kg',
    status: 'FRESH',
    expiryDate: '2026-03-22',
  },
]

export const mockCertifications: Certification[] = [
  {
    id: 'cert-001',
    name: 'SL Certification',
    level: 'Standard License Level 4',
    issueDate: '2025-01-12',
    expiryDate: '2026-01-12',
    icon: '✓',
  },
]

export const mockSanitizationLogs: SanitizationLog[] = [
  {
    id: 'log-001',
    sessionType: 'surface_prep',
    employee: 'Sunil',
    date: '2026-01-26',
    time: '11:30 PM',
    status: 'VERIFIED',
  },
  {
    id: 'log-002',
    sessionType: 'deep_clean',
    employee: 'Pradeep',
    date: '2026-01-26',
    time: '12:30 PM',
    status: 'VERIFIED',
  },
  {
    id: 'log-003',
    sessionType: 'tables_clean',
    employee: 'Sunil',
    date: '2026-01-26',
    time: '12:00 PM',
    status: 'VERIFIED',
  },
]

export const mockRestaurantStats: RestaurantStats = {
  totalOrders: 24,
  pendingOrders: 8,
  ingredientsInStock: 9,
  expiringItems: 2,
  certifications: mockCertifications,
}
