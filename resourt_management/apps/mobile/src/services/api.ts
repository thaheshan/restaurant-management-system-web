const BASE_URL = "https://unbrothered-gloria-noneruptive.ngrok-free.dev/api";
const RESTAURANT_URL = "https://unbrothered-gloria-noneruptive.ngrok-free.dev/api/restaurant/public";

const tunnelFetch = async (url: string, options: any = {}) => {
  const res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      "ngrok-skip-browser-warning": "true",
    },
  });
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    console.log("Response was not JSON:", text.substring(0, 200));
    throw new Error("Invalid response from server");
  }
};

export const api = {
  getCategories: async (restaurantId: string) => {
    return tunnelFetch(`${RESTAURANT_URL}/categories/${restaurantId}`);
  },
  getCategoryItems: async (categoryId: string) => {
    return tunnelFetch(`${RESTAURANT_URL}/category/${categoryId}/items`);
  },
  getItemDetail: async (itemId: string) => {
    return tunnelFetch(`${RESTAURANT_URL}/item/${itemId}`);
  },
  scanQR: async (restaurantId: string, tableNumber: string) => {
    return tunnelFetch(`${RESTAURANT_URL}/scan?restaurantId=${restaurantId}&tableNumber=${tableNumber}`);
  },
  placeOrder: async (orderData: any, token: string) => {
    return tunnelFetch(`${BASE_URL}/orders/place`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });
  },
  getOrderStatus: async (orderId: string, token: string) => {
    return tunnelFetch(`${BASE_URL}/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  getMyOrders: async (token: string) => {
    return tunnelFetch(`${BASE_URL}/orders/my-orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  requestAssistant: async (orderId: string, token: string) => {
    return tunnelFetch(`${BASE_URL}/orders/request-assistant`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ orderId }),
    });
  },
  updatePayment: async (orderId: string, paymentMethod: string, token: string) => {
    return tunnelFetch(`${BASE_URL}/orders/${orderId}/payment`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ paymentMethod }),
    });
  },
};