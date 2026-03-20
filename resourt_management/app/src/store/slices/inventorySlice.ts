import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import inventoryService from '@/app/src/services/inventoryService';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minThreshold: number;
  expiryDate: string;
  status: 'critical' | 'low' | 'ok';
  stockLevel: string;
}

interface InventoryStats {
  total: number;
  inStock: number;
  lowStock: number;
  critical: number;
  wastageRate: string;
}

interface InventoryState {
  items: InventoryItem[];
  stats: InventoryStats | null;
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
    try {
      return await inventoryService.getAll(restaurantId);
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch inventory'
      );
    }
  }
);

export const fetchInventoryStats = createAsyncThunk(
  'inventory/fetchStats',
  async (restaurantId: string, { rejectWithValue }) => {
    try {
      return await inventoryService.getStats(restaurantId);
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch stats'
      );
    }
  }
);

export const addIngredient = createAsyncThunk(
  'inventory/add',
  async (
    data: {
      restaurantId: string;
      name: string;
      quantity: number;
      unit: string;
      minThreshold: number;
      expiryDate: string;
    },
    { rejectWithValue }
  ) => {
    try {
      return await inventoryService.create(data);
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to add ingredient'
      );
    }
  }
);

export const updateIngredient = createAsyncThunk(
  'inventory/update',
  async (
    { id, data }: { id: string; data: { quantity: number; minThreshold: number } },
    { rejectWithValue }
  ) => {
    try {
      return await inventoryService.update(id, data);
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to update ingredient'
      );
    }
  }
);

export const deleteIngredient = createAsyncThunk(
  'inventory/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await inventoryService.delete(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to delete ingredient'
      );
    }
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
      // Fetch all
      .addCase(fetchInventory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.inventory || action.payload || [];
      })
      .addCase(fetchInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch stats
      .addCase(fetchInventoryStats.fulfilled, (state, action) => {
        state.stats = action.payload.stats || action.payload;
      })
      // Add
      .addCase(addIngredient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addIngredient.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = 'Ingredient added successfully';
      })
      .addCase(addIngredient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update
      .addCase(updateIngredient.fulfilled, (state, action) => {
        state.successMessage = 'Ingredient updated successfully';
        const index = state.items.findIndex(
          (i) => i.id === action.payload?.id
        );
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(updateIngredient.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Delete
      .addCase(deleteIngredient.fulfilled, (state, action) => {
        state.items = state.items.filter((i) => i.id !== action.payload);
        state.successMessage = 'Ingredient deleted successfully';
      })
      .addCase(deleteIngredient.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearInventoryMessages } = inventorySlice.actions;
export default inventorySlice.reducer;