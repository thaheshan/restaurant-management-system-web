import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '@/app/src/services/authService';

interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  restaurantId: string;
  token: string;
}

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  otpSent: boolean;
  demoOtp: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  otpSent: false,
  demoOtp: null,
};

export const registerUser = createAsyncThunk(
  'auth/register',
  async (
    data: {
      name: string;
      email: string;
      password: string;
      mobile: string;
      role: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await authService.register(data);
      localStorage.setItem('adminSession', JSON.stringify(res));
      return res;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Registration failed'
      );
    }
  }
);

export const sendOtp = createAsyncThunk(
  'auth/sendOtp',
  async (mobileNumber: string, { rejectWithValue }) => {
    try {
      return await authService.sendOtp(mobileNumber);
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to send OTP'
      );
    }
  }
);

export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async (
    { mobileNumber, otp }: { mobileNumber: string; otp: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await authService.verifyOtp(mobileNumber, otp);
      localStorage.setItem('customerSession', JSON.stringify(res));
      return res;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'OTP verification failed'
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await authService.adminLogin(email, password);
      localStorage.setItem('adminSession', JSON.stringify(res));
      return res;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Login failed'
      );
    }
  }
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('adminSession');
  localStorage.removeItem('customerSession');
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserFromSession(state) {
      const session = localStorage.getItem('adminSession');
      if (session) {
        const parsed = JSON.parse(session);
        state.user = {
          id: parsed.user?.id || parsed.id,
          email: parsed.user?.email || parsed.email,
          name: parsed.user?.name || parsed.name,
          role: parsed.user?.role || parsed.role,
          restaurantId:
            parsed.user?.restaurantId || parsed.restaurantId,
          token: parsed.token,
        };
      }
    },
    clearError(state) {
      state.error = null;
    },
    clearOtpState(state) {
      state.otpSent = false;
      state.demoOtp = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = {
          id: action.payload.user?.id,
          email: action.payload.user?.email,
          name: action.payload.user?.name,
          role: action.payload.user?.role,
          restaurantId: action.payload.user?.restaurantId,
          token: action.payload.token,
        };
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Send OTP
      .addCase(sendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.otpSent = true;
        state.demoOtp = action.payload.demo_otp || null;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Verify OTP
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.otpSent = false;
        state.demoOtp = null;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Admin Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = {
          id: action.payload.user?.id,
          email: action.payload.user?.email,
          name: action.payload.user?.name,
          role: action.payload.user?.role,
          restaurantId: action.payload.user?.restaurantId,
          token: action.payload.token,
        };
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.error = null;
      });
  },
});

export const { setUserFromSession, clearError, clearOtpState } =
  authSlice.actions;
export default authSlice.reducer;