import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FoodState, FoodItem } from "../../types";
import { mockFoodItems } from "../../utils/mockData";
import { generateId } from "../../utils/helpers";
const initialState: FoodState = { items: mockFoodItems, loading: false, error: null, selectedItem: null };
const foodSlice = createSlice({
  name: "food", initialState,
  reducers: {
    addFoodItem: (s, a: PayloadAction<Omit<FoodItem, "id"|"createdAt"|"updatedAt">>) => {
      s.items.push({ ...a.payload, id: generateId(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    },
    updateFoodItem: (s, a: PayloadAction<FoodItem>) => {
      const i = s.items.findIndex(x => x.id === a.payload.id);
      if (i !== -1) s.items[i] = { ...a.payload, updatedAt: new Date().toISOString() };
    },
    deleteFoodItem:          (s, a: PayloadAction<string>)       => { s.items = s.items.filter(x => x.id !== a.payload); },
    toggleFoodAvailability:  (s, a: PayloadAction<string>)       => { const x = s.items.find(i => i.id === a.payload); if (x) x.isAvailable = !x.isAvailable; },
    setSelectedItem:         (s, a: PayloadAction<FoodItem|null>) => { s.selectedItem = a.payload; },
  },
});
export const { addFoodItem, updateFoodItem, deleteFoodItem, toggleFoodAvailability, setSelectedItem } = foodSlice.actions;
export default foodSlice.reducer;
