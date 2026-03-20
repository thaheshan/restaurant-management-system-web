import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '@/app/src/services/authService';

interface AuthUser {
  id: string;
  email: string;
  name: string;
  restaurantId: string;
  token?: string;
}

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const data = await authService.login(credentials);
      localStorage.setItem('adminSession', JSON.stringify(data));
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('adminSession');
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserFromSession(state) {
      const session = localStorage.getItem('adminSession');
      if (session) {
        state.user = JSON.parse(session);
      }
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export const { setUserFromSession, clearError } = authSlice.actions;
export default authSlice.reducer;
