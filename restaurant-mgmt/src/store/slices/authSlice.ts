import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, User, LoginCredentials } from "../../types";
import { DEMO_ACCOUNTS } from "../../utils/mockData";
const stored = { user: localStorage.getItem("rms_user"), token: localStorage.getItem("rms_token") };
const initialState: AuthState = {
  user: stored.user ? JSON.parse(stored.user) : null,
  token: stored.token, isAuthenticated: !!stored.token, loading: false, error: null,
};
const authSlice = createSlice({
  name: "auth", initialState,
  reducers: {
    loginStart:   (s) => { s.loading = true; s.error = null; },
    loginSuccess: (s, a: PayloadAction<{ user: User; token: string }>) => {
      s.loading = false; s.user = a.payload.user; s.token = a.payload.token;
      s.isAuthenticated = true; s.error = null;
      localStorage.setItem("rms_user", JSON.stringify(a.payload.user));
      localStorage.setItem("rms_token", a.payload.token);
    },
    loginFailure: (s, a: PayloadAction<string>) => { s.loading = false; s.error = a.payload; },
    logout: (s) => {
      s.user = null; s.token = null; s.isAuthenticated = false;
      localStorage.removeItem("rms_user"); localStorage.removeItem("rms_token");
    },
    clearError: (s) => { s.error = null; },
  },
});
export const { loginStart, loginSuccess, loginFailure, logout, clearError } = authSlice.actions;
export const login = (creds: LoginCredentials) => (dispatch: any) => {
  dispatch(loginStart());
  setTimeout(() => {
    const acct = Object.values(DEMO_ACCOUNTS).find(a => a.email === creds.email && a.password === creds.password);
    if (acct) dispatch(loginSuccess({ user: acct.user, token: `token_${Date.now()}` }));
    else dispatch(loginFailure("Invalid email or password"));
  }, 700);
};
export default authSlice.reducer;
