import React, { createContext, useContext, useState, useCallback } from 'react';
import { Order, OrderStatus, CartItem, PaymentMethod, OrderHistoryItem } from '@types/index';

interface OrderContextType {
  currentOrder: Order | null;
  orderHistory: OrderHistoryItem[];
  createOrder: (tableId: string, items: CartItem[], paymentMethod: PaymentMethod) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  getCurrentOrder: (orderId: string) => Order | undefined;
  getOrderHistory: (tableId?: string) => OrderHistoryItem[];
  clearCurrentOrder: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

// Helper function to generate order ID
const generateOrderId = () => `ORD-${Date.now()}`;

// Helper function to generate estimated wait time (in minutes)
const generateEstimatedTime = () => Math.floor(Math.random() * 45) + 15; // 15-60 minutes

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [orderHistory, setOrderHistory] = useState<OrderHistoryItem[]>([]);

  const createOrder = useCallback(
    (tableId: string, items: CartItem[], paymentMethod: PaymentMethod): Order => {
      const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const taxAmount = Math.round(subtotal * 0.1);
      const total = subtotal + taxAmount;

      const order: Order = {
        id: generateOrderId(),
        tableId,
        items,
        status: 'placed',
        total,
        taxAmount,
        paymentMethod,
        estimatedTime: generateEstimatedTime(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setCurrentOrder(order);
      return order;
    },
    []
  );

  const updateOrderStatus = useCallback((orderId: string, status: OrderStatus) => {
    if (currentOrder && currentOrder.id === orderId) {
      setCurrentOrder((prev) =>
        prev
          ? {
              ...prev,
              status,
              updatedAt: new Date(),
            }
          : null
      );
    }
  }, [currentOrder]);

  const getCurrentOrder = useCallback(
    (orderId: string) => {
      if (currentOrder && currentOrder.id === orderId) {
        return currentOrder;
      }
      return orderHistory.find((o) => o.id === orderId);
    },
    [currentOrder, orderHistory]
  );

  const getOrderHistory = useCallback(
    (tableId?: string) => {
      if (tableId) {
        return orderHistory.filter((order) => order.tableId === tableId);
      }
      return orderHistory;
    },
    [orderHistory]
  );

  const clearCurrentOrder = useCallback(() => {
    if (currentOrder) {
      // Move current order to history with completion time
      const completedOrder: OrderHistoryItem = {
        ...currentOrder,
        status: 'served',
        completedAt: new Date(),
      };
      setOrderHistory((prev) => [completedOrder, ...prev]);
      setCurrentOrder(null);
    }
  }, [currentOrder]);

  const value: OrderContextType = {
    currentOrder,
    orderHistory,
    createOrder,
    updateOrderStatus,
    getCurrentOrder,
    getOrderHistory,
    clearCurrentOrder,
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};
