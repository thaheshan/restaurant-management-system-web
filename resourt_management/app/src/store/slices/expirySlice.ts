import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import expiryService from '@/app/src/services/expiryService';

interface ExpiryItem {
  id: number;
  name: string;
  category: string;
  expiryDate: string;
  daysLeft: number;
  severity: 'expired' | 'critical' | 'warning';
  quantity: string;
  supplier: string;
  icon: string;
}

interface ExpiryState {
  items: ExpiryItem[];
  loading: boolean;
  error: string | null;
}

const initialState: ExpiryState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchExpiryAlerts = createAsyncThunk(
  'expiry/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await expiryService.getAll();
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch expiry alerts');
    }
  }
);

export const resolveExpiryAlert = createAsyncThunk(
  'expiry/resolve',
  async (id: number, { rejectWithValue }) => {
    try {
      await expiryService.resolve(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to resolve alert');
    }
  }
);

const expirySlice = createSlice({
  name: 'expiry',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpiryAlerts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpiryAlerts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchExpiryAlerts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(resolveExpiryAlert.fulfilled, (state, action) => {
        state.items = state.items.filter(i => i.id !== action.payload);
      });
  },
});

export default expirySlice.reducer;
