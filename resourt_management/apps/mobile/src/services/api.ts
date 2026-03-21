const BASE_URL = "https://forty-cobras-fail.loca.lt/api";
const RESTAURANT_URL = "https://afraid-adults-allow.loca.lt";

const tunnelFetch = async (url: string, options: any = {}) => {
  const res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      "bypass-tunnel-reminder": "true",
      "User-Agent": "DineSmart-Mobile/1.0",
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
    return tunnelFetch(`${RESTAURANT_URL}/public/categories/${restaurantId}`);
  },
  getCategoryItems: async (categoryId: string) => {
    return tunnelFetch(`${RESTAURANT_URL}/public/category/${categoryId}/items`);
  },
  getItemDetail: async (itemId: string) => {
    return tunnelFetch(`${RESTAURANT_URL}/public/item/${itemId}`);
  },
  scanQR: async (restaurantId: string, tableNumber: string) => {
    return tunnelFetch(`${RESTAURANT_URL}/public/scan?restaurantId=${restaurantId}&tableNumber=${tableNumber}`);
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
};
