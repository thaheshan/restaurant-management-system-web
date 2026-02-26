export type UserRole     = "super_admin" | "manager" | "chef" | "waiter" | "inventory_staff";
export type FoodCategory = "appetizer" | "main_course" | "dessert" | "beverage" | "side_dish" | "special";
export type HealthStatus = "fresh" | "good" | "warning" | "critical" | "expired";
export type UnitType     = "kg" | "g" | "liter" | "ml" | "piece" | "box" | "bag";

export interface User {
  id: string; name: string; email: string; role: UserRole;
  createdAt: string; isActive: boolean;
}
export interface AuthState {
  user: User | null; token: string | null;
  isAuthenticated: boolean; loading: boolean; error: string | null;
}
export interface LoginCredentials { email: string; password: string; }

export interface FoodItem {
  id: string; name: string; description: string; category: FoodCategory;
  price: number; cost: number; ingredients: string[]; allergens: string[];
  isAvailable: boolean; preparationTime: number; calories: number;
  createdAt: string; updatedAt: string;
}
export interface InventoryItem {
  id: string; name: string; category: string; quantity: number; unit: UnitType;
  minimumStock: number; maximumStock: number; currentStock: number;
  healthStatus: HealthStatus; expiryDate: string; receivedDate: string;
  supplier: string; pricePerUnit: number; location: string;
  notes?: string; lastUpdated: string;
}
export interface Permission {
  id: string; module: string; action: "read" | "write" | "delete" | "manage"; description: string;
}
export interface Role {
  id: string; name: UserRole; displayName: string; description: string;
  permissions: Permission[]; userCount: number; color: string;
}
export interface Notification {
  id: string; type: "info" | "warning" | "error" | "success";
  message: string; timestamp: string; read: boolean;
}
export interface FoodState      { items: FoodItem[];      loading: boolean; error: string | null; selectedItem: FoodItem | null; }
export interface InventoryState { items: InventoryItem[]; loading: boolean; error: string | null; alerts: InventoryItem[]; }
export interface RolesState     { roles: Role[];           users: User[];    loading: boolean; error: string | null; }
export interface UIState        { sidebarOpen: boolean; notifications: Notification[]; }
