import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import inventoryService from '@/app/src/services/inventoryService';
import hygieneService from '@/app/src/services/hygieneService';
import expiryService from '@/app/src/services/expiryService';

interface DashboardStats {
  totalInventory: number;
  inStock: number;
  lowStock: number;
  critical: number;
  hygieneDone: number;
  expiryAlerts: number;
}

interface RecentActivity {
  id: string;
  action: string;
  time: string;
  type: 'inventory' | 'expiry' | 'hygiene';
}

interface DashboardState {
  stats: DashboardStats | null;
  recentActivity: RecentActivity[];
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  stats: null,
  recentActivity: [],
  loading: false,
  error: null,
};

export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchAll',
  async (restaurantId: string, { rejectWithValue }) => {
    try {
      const [inventoryStats, inventoryAll, hygieneData, expiryData] = await Promise.all([
        inventoryService.getStats(restaurantId),
        inventoryService.getAll(restaurantId),
        hygieneService.getDashboard(restaurantId),
        expiryService.getAll(restaurantId),
      ]);

      // Count from real inventory data using actual stock_level values
      const allItems = inventoryAll?.inventory || inventoryAll?.ingredients || [];
      const criticalCount = allItems.filter((i: any) =>
        (i.stock_level || '').toLowerCase() === 'critical'
      ).length;
      const lowCount = allItems.filter((i: any) =>
        ['low', 'low_stock'].includes((i.stock_level || '').toLowerCase())
      ).length;

      // totalItems from stats API, fallback to array length
      const totalInventory =
        inventoryStats?.stats?.totalItems ||
        inventoryStats?.stats?.total ||
        allItems.length ||
        0;

      return {
        stats: {
          totalInventory,
          inStock: allItems.filter((i: any) =>
            ['ok', 'normal', 'fresh', 'in_stock'].includes((i.stock_level || '').toLowerCase())
          ).length,
          lowStock: lowCount,
          critical: criticalCount,
          hygieneDone: hygieneData?.dashboard?.sanitizationLogs?.length || 0,
          expiryAlerts: expiryData?.expiringItems?.length || 0,
        },
        recentActivity: [],
      };
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch dashboard data'
      );
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearDashboardError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.stats;
        state.recentActivity = action.payload.recentActivity;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearDashboardError } = dashboardSlice.actions;
export default dashboardSlice.reducer;