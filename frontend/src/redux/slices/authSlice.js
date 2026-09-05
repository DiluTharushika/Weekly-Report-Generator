import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginApi, registerApi, meApi } from "../../api/authApi";

const tokenFromStorage = localStorage.getItem("token");

export const loginThunk = createAsyncThunk("auth/login", async (payload) => {
  return await loginApi(payload);
});

export const registerThunk = createAsyncThunk("auth/register", async (payload) => {
  return await registerApi(payload);
});

export const meThunk = createAsyncThunk("auth/me", async () => {
  return await meApi();
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: tokenFromStorage || null,
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem("token");
    },
    setToken: (state, action) => {
      state.token = action.payload;
      localStorage.setItem("token", action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(meThunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
      });
  },
});

export const { logout, setToken } = authSlice.actions;
export default authSlice.reducer;