import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import hygieneService from '@/app/src/services/hygieneService';

interface Certification {
  id: string;
  certification_name: string;
  certification_level: string;
  issue_date: string;
  expiry_date: string;
  status: string;
}

interface SanitizationLog {
  id: string;
  session_type: string;
  employee_name: string;
  date_logged: string;
  time_logged: string;
  status: string;
}

interface HygieneState {
  certifications: Certification[];
  sanitizationLogs: SanitizationLog[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: HygieneState = {
  certifications: [],
  sanitizationLogs: [],
  loading: false,
  error: null,
  successMessage: null,
};

export const fetchHygieneDashboard = createAsyncThunk(
  'hygiene/fetchDashboard',
  async (restaurantId: string, { rejectWithValue }) => {
    try {
      return await hygieneService.getDashboard(restaurantId);
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch hygiene dashboard'
      );
    }
  }
);

export const fetchCertifications = createAsyncThunk(
  'hygiene/fetchCertifications',
  async (restaurantId: string, { rejectWithValue }) => {
    try {
      return await hygieneService.getCertifications(restaurantId);
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch certifications'
      );
    }
  }
);

export const addCertification = createAsyncThunk(
  'hygiene/addCertification',
  async (
    {
      restaurantId,
      data,
    }: {
      restaurantId: string;
      data: {
        name: string;
        issuedBy: string;
        issuedDate: string;
        expiryDate: string;
        certificateNumber: string;
      };
    },
    { rejectWithValue }
  ) => {
    try {
      return await hygieneService.addCertification(restaurantId, data);
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to add certification'
      );
    }
  }
);

export const fetchSanitizationLogs = createAsyncThunk(
  'hygiene/fetchSanitizationLogs',
  async (restaurantId: string, { rejectWithValue }) => {
    try {
      return await hygieneService.getSanitizationLogs(restaurantId);
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch sanitization logs'
      );
    }
  }
);

export const addSanitizationLog = createAsyncThunk(
  'hygiene/addSanitizationLog',
  async (
    {
      restaurantId,
      data,
    }: {
      restaurantId: string;
      data: {
        area: string;
        cleanedBy: string;
        cleaningType: string;
        notes: string;
        cleanedAt: string;
      };
    },
    { rejectWithValue }
  ) => {
    try {
      return await hygieneService.addSanitizationLog(restaurantId, data);
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to add sanitization log'
      );
    }
  }
);

const hygieneSlice = createSlice({
  name: 'hygiene',
  initialState,
  reducers: {
    clearHygieneMessages(state) {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Dashboard
      .addCase(fetchHygieneDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHygieneDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.certifications =
          action.payload.dashboard?.certifications || [];
        state.sanitizationLogs =
          action.payload.dashboard?.sanitizationLogs || [];
      })
      .addCase(fetchHygieneDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Certifications
      .addCase(fetchCertifications.fulfilled, (state, action) => {
        state.certifications =
          action.payload.certifications || action.payload || [];
      })
      // Add Certification
      .addCase(addCertification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCertification.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = 'Certification added successfully';
      })
      .addCase(addCertification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Sanitization Logs
      .addCase(fetchSanitizationLogs.fulfilled, (state, action) => {
        state.sanitizationLogs =
          action.payload.logs || action.payload || [];
      })
      // Add Sanitization Log
      .addCase(addSanitizationLog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addSanitizationLog.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = 'Sanitization log added successfully';
      })
      .addCase(addSanitizationLog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearHygieneMessages } = hygieneSlice.actions;
export default hygieneSlice.reducer;