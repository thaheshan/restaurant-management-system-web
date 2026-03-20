import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import expiryService from '@/app/src/services/expiryService';

interface ExpiryItem {
  id: string;
  name: string;
  category: string;
  expiryDate: string;
  daysLeft: number;
  severity: 'expired' | 'critical' | 'warning';
  quantity: string;
  supplier: string;
}

interface ExpiryState {
  items: ExpiryItem[];
  loading: boolean;
  error: string | null;
  resolvedIds: string[];
}

const initialState: ExpiryState = {
  items: [],
  loading: false,
  error: null,
  resolvedIds: [],
};

export const fetchExpiryAlerts = createAsyncThunk(
  'expiry/fetchAll',
  async (restaurantId: string, { rejectWithValue }) => {
    try {
      return await expiryService.getAll(restaurantId);
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch expiry alerts'
      );
    }
  }
);

const expirySlice = createSlice({
  name: 'expiry',
  initialState,
  reducers: {
    resolveAlert(state, action) {
      state.resolvedIds.push(action.payload);
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
    clearExpiryError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpiryAlerts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpiryAlerts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.expiringItems || action.payload || [];
      })
      .addCase(fetchExpiryAlerts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resolveAlert, clearExpiryError } = expirySlice.actions;
export default expirySlice.reducer;