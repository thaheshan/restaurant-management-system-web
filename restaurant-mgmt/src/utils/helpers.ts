import { HealthStatus, UserRole } from "../types";
export const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
export const formatDate = (d: string) =>
  new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric" }).format(new Date(d));
export const getHealthStatusColor = (s: HealthStatus): string =>
  ({ fresh: "#22c55e", good: "#84cc16", warning: "#f59e0b", critical: "#ef4444", expired: "#6b7280" }[s]);
export const getHealthStatusLabel = (s: HealthStatus): string =>
  ({ fresh: "Fresh", good: "Good", warning: "Low Stock", critical: "Critical", expired: "Expired" }[s]);
export const getRoleColor = (r: UserRole): string =>
  ({ super_admin: "#FF4500", manager: "#4A90D9", chef: "#E67E22", waiter: "#27AE60", inventory_staff: "#8E44AD" }[r]);
export const getRoleDisplayName = (r: UserRole): string =>
  ({ super_admin: "Super Admin", manager: "Manager", chef: "Head Chef", waiter: "Waiter", inventory_staff: "Inventory Staff" }[r]);
export const calculateStockPercentage = (cur: number, max: number) => Math.min(Math.round((cur / max) * 100), 100);
export const getDaysUntilExpiry = (d: string) =>
  Math.ceil((new Date(d).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
export const generateId = () => Math.random().toString(36).substr(2, 9);
