import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { LoginResponse, User } from "@/interfaces/IUser";
import axiosInstance from "@/services/constant/axiosInstance";
import { toast } from "react-toastify";
import { LOGIN_ENDPOINT } from "@/services/constant/apiConfig";

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

interface LoginCredentials {
  email: string;
  password: string;
}

export const loginUser = createAsyncThunk<
  LoginResponse,
  LoginCredentials,
  { rejectValue: { message: string } }
>("auth/loginUser", async (credentials, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(LOGIN_ENDPOINT, credentials);
    return response.data;
  } catch (err: any) {
    const message =
      err?.response?.data?.message || err.message || "Đăng nhập thất bại";
    return rejectWithValue({ message });
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem("token");
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
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
        localStorage.setItem("token", action.payload.token);

        toast.success(action.payload.message);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload?.message || "Đăng nhập thất bại";

        toast.error(state.error);
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
