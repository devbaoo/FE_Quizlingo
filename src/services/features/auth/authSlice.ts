import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { LoginResponse, User } from "@/interfaces/IUser";
import axiosInstance, { ApiError } from "@/services/constant/axiosInstance";
import { toast } from "react-toastify";
import {
  LOGIN_ENDPOINT,
  REGISTER_ENDPOINT,
  FORGOT_PASSWORD_ENDPOINT,
} from "@/services/constant/apiConfig";

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

interface RegisterCredentials {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface ForgotPasswordRequest {
  email: string;
}

export const loginUser = createAsyncThunk<
  LoginResponse,
  LoginCredentials,
  { rejectValue: { message: string } }
>("auth/loginUser", async (credentials, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(LOGIN_ENDPOINT, credentials);
    return response.data;
  } catch (err: unknown) {
    const error = err as ApiError;
    const message = error.message || "Đăng nhập thất bại";
    return rejectWithValue({ message });
  }
});

export const registerUser = createAsyncThunk<
  LoginResponse,
  RegisterCredentials,
  { rejectValue: { message: string } }
>("auth/registerUser", async (credentials, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(REGISTER_ENDPOINT, credentials);
    return response.data;
  } catch (err: unknown) {
    const error = err as ApiError;
    const message = error.message || "Đăng ký thất bại";
    return rejectWithValue({ message });
  }
});

export const forgotPassword = createAsyncThunk<
  { success: boolean; message: string },
  ForgotPasswordRequest,
  { rejectValue: { message: string } }
>("auth/forgotPassword", async (request, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(
      FORGOT_PASSWORD_ENDPOINT,
      request
    );
    return response.data;
  } catch (err: unknown) {
    const error = err as ApiError;
    const message = error.message || "Yêu cầu đặt lại mật khẩu thất bại";
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
      })
      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
        localStorage.setItem("token", action.payload.token);

        toast.success(action.payload.message || "Đăng ký thành công");
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload?.message || "Đăng ký thất bại";

        toast.error(state.error);
      })
      // Forgot password cases
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        if (action.payload.success) {
          toast.success(
            action.payload.message || "Email đặt lại mật khẩu đã được gửi"
          );
        } else {
          toast.error(
            action.payload.message || "Yêu cầu đặt lại mật khẩu thất bại"
          );
        }
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Yêu cầu đặt lại mật khẩu thất bại";

        toast.error(state.error);
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
