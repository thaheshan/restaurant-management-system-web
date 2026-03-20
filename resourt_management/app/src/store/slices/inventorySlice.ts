import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import inventoryService from '@/app/src/services/inventoryService';

interface Ingredient {
  id: number;
  name: string;
  category: string;
  stock: string;
  unit: string;
  threshold: string;
  status: 'critical' | 'low' | 'ok';
}

interface InventoryState {
  items: Ingredient[];
  loading: boolean;
  error: string | null;
}

const initialState: InventoryState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchInventory = createAsyncThunk(
  'inventory/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await inventoryService.getAll();
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch inventory');
    }
  }
);

export const addIngredient = createAsyncThunk(
  'inventory/add',
  async (ingredient: Omit<Ingredient, 'id'>, { rejectWithValue }) => {
    try {
      return await inventoryService.create(ingredient);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to add ingredient');
    }
  }
);

export const deleteIngredient = createAsyncThunk(
  'inventory/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await inventoryService.delete(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete');
    }
  }
);

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addIngredient.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(deleteIngredient.fulfilled, (state, action) => {
        state.items = state.items.filter(i => i.id !== action.payload);
      });
  },
});

export default inventorySlice.reducer;
