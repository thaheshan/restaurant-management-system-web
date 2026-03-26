import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import inventoryService from '@/app/src/services/inventoryService';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  min_threshold: number;
  expiry_date: string;
  status: string;
  stock_level: string;
}

interface InventoryState {
  items: InventoryItem[];
  stats: any | null;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: InventoryState = {
  items: [],
  stats: null,
  loading: false,
  error: null,
  successMessage: null,
};

export const fetchInventory = createAsyncThunk(
  'inventory/fetchAll',
  async (restaurantId: string, { rejectWithValue }) => {
    try { return await inventoryService.getAll(restaurantId); }
    catch (err: any) { return rejectWithValue(err.response?.data?.error || 'Failed to fetch inventory'); }
  }
);

export const fetchInventoryStats = createAsyncThunk(
  'inventory/fetchStats',
  async (restaurantId: string, { rejectWithValue }) => {
    try { return await inventoryService.getStats(restaurantId); }
    catch (err: any) { return rejectWithValue(err.response?.data?.error || 'Failed to fetch stats'); }
  }
);

export const addIngredient = createAsyncThunk(
  'inventory/add',
  async (data: any, { rejectWithValue }) => {
    try { return await inventoryService.create(data); }
    catch (err: any) { return rejectWithValue(err.response?.data?.error || 'Failed to add ingredient'); }
  }
);

export const updateIngredient = createAsyncThunk(
  'inventory/update',
  async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
    try { return await inventoryService.update(id, data); }
    catch (err: any) { return rejectWithValue(err.response?.data?.error || 'Failed to update ingredient'); }
  }
);

export const updateUsage = createAsyncThunk(
  'inventory/usage',
  async ({ id, amount, type }: { id: string; amount: number; type: 'add' | 'remove' }, { rejectWithValue }) => {
    try { return await inventoryService.updateUsage(id, amount, type); }
    catch (err: any) { return rejectWithValue(err.response?.data?.error || 'Failed to update usage'); }
  }
);

export const deleteIngredient = createAsyncThunk(
  'inventory/delete',
  async (id: string, { rejectWithValue }) => {
    try { await inventoryService.delete(id); return id; }
    catch (err: any) { return rejectWithValue(err.response?.data?.error || 'Failed to delete ingredient'); }
  }
);

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    clearInventoryMessages(state) {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventory.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.inventory || action.payload || [];
      })
      .addCase(fetchInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchInventoryStats.fulfilled, (state, action) => {
        state.stats = action.payload.stats || action.payload;
      })
      .addCase(addIngredient.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(addIngredient.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = 'Ingredient saved successfully!';
      })
      .addCase(addIngredient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateIngredient.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updateIngredient.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = 'Ingredient updated!';
        const idx = state.items.findIndex(i => i.id === action.payload?.ingredient?.id);
        if (idx !== -1) state.items[idx] = action.payload.ingredient;
      })
      .addCase(updateIngredient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateUsage.fulfilled, (state, action) => {
        state.successMessage = 'Stock updated!';
        const idx = state.items.findIndex(i => i.id === action.payload?.ingredient?.id);
        if (idx !== -1) state.items[idx] = action.payload.ingredient;
      })
      .addCase(updateUsage.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(deleteIngredient.fulfilled, (state, action) => {
        state.items = state.items.filter(i => i.id !== action.payload);
        state.successMessage = 'Ingredient deleted!';
      })
      .addCase(deleteIngredient.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearInventoryMessages } = inventorySlice.actions;
export default inventorySlice.reducer;