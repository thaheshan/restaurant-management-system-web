// Cart Types
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
}

export interface Cart {
  items: CartItem[];
  tableId: string;
}

// Menu Types
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  ingredients?: string[];
}

export interface MenuCategory {
  id: string;
  name: string;
  image: string;
}

// Order Types
export type OrderStatus = 'placed' | 'prep' | 'in-progress' | 'served';

export interface Order {
  id: string;
  tableId: string;
  items: CartItem[];
  status: OrderStatus;
  total: number;
  taxAmount: number;
  paymentMethod: PaymentMethod;
  estimatedTime: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderHistoryItem extends Order {
  completedAt?: Date;
}

// Payment Types
export type PaymentMethod = 'cash' | 'debitCard' | 'creditCard';

export interface PaymentOption {
  id: PaymentMethod;
  name: string;
  description: string;
  icon: string;
}

// Admin Types
export interface AdminUser {
  id: string;
  email: string;
  name: string;
  restaurantId: string;
}

// Inventory Types
export type InventoryStatus = 'fresh' | 'warning' | 'expired';
export type IngredientCategory = 'meat' | 'seafood' | 'vegetable' | 'spice' | 'dairy';

export interface InventoryItem {
  id: string;
  name: string;
  category: IngredientCategory;
  stock: number;
  unit: string;
  status: InventoryStatus;
  expiryDate: Date;
  lastUpdated: Date;
}

// Hygiene Types
export interface Certification {
  id: string;
  name: string;
  level: string;
  issueDate: Date;
  expiryDate: Date;
  badge: string;
}

export interface SanitizationLog {
  id: string;
  type: string;
  employee: string;
  date: Date;
  time: string;
  status: 'verified' | 'pending';
}

// Expiry Alert Types
export interface ExpiryAlert {
  id: string;
  ingredient: string;
  expiryDate: Date;
  daysLeft: number;
  quantity: number;
  unit: string;
  action: 'required' | 'optional';
}
