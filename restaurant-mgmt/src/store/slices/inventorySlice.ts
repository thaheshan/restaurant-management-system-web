import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { InventoryState, InventoryItem } from "../../types";
import { mockInventoryItems } from "../../utils/mockData";
import { generateId } from "../../utils/helpers";
const alerts = (items: InventoryItem[]) => items.filter(i => i.healthStatus === "critical" || i.healthStatus === "warning");
const initialState: InventoryState = { items: mockInventoryItems, loading: false, error: null, alerts: alerts(mockInventoryItems) };
const inventorySlice = createSlice({
  name: "inventory", initialState,
  reducers: {
    addInventoryItem: (s, a: PayloadAction<Omit<InventoryItem,"id"|"lastUpdated">>) => {
      s.items.push({ ...a.payload, id: generateId(), lastUpdated: new Date().toISOString() });
      s.alerts = alerts(s.items);
    },
    updateInventoryItem: (s, a: PayloadAction<InventoryItem>) => {
      const i = s.items.findIndex(x => x.id === a.payload.id);
      if (i !== -1) s.items[i] = { ...a.payload, lastUpdated: new Date().toISOString() };
      s.alerts = alerts(s.items);
    },
    deleteInventoryItem: (s, a: PayloadAction<string>) => { s.items = s.items.filter(i => i.id !== a.payload); s.alerts = alerts(s.items); },
    updateStock: (s, a: PayloadAction<{ id: string; quantity: number }>) => {
      const item = s.items.find(i => i.id === a.payload.id);
      if (item) {
        item.currentStock = a.payload.quantity; item.lastUpdated = new Date().toISOString();
        item.healthStatus = item.currentStock <= 0 ? "critical" : item.currentStock < item.minimumStock ? "warning" : "good";
      }
      s.alerts = alerts(s.items);
    },
  },
});
export const { addInventoryItem, updateInventoryItem, deleteInventoryItem, updateStock } = inventorySlice.actions;
export default inventorySlice.reducer;
