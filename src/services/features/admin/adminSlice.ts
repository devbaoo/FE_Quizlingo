import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiMethods } from "@/services/constant/axiosInstance";
import {
  GET_USERS_ENDPOINT,
  DELETE_USER_ENDPOINT,
} from "@/services/constant/apiConfig";
import { ApiError } from "@/services/constant/axiosInstance";
import { IAdmin } from "@/interfaces/IAdmin";

interface UsersResponse {
  success: boolean;
  count: number;
  users: IAdmin[];
}

interface AdminState {
  users: IAdmin[];
  loading: boolean;
  error: string | null;
  count: number;
}

const initialState: AdminState = {
  users: [],
  loading: false,
  error: null,
  count: 0,
};

export const fetchUsers = createAsyncThunk(
  "admin/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiMethods.get<UsersResponse>(GET_USERS_ENDPOINT);
      const data = response.data as unknown as UsersResponse;
      return data;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.message || "Failed to fetch users");
    }
  }
);

export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await apiMethods.delete(DELETE_USER_ENDPOINT(userId));
      return { userId, message: response.data.message };
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.message || "Failed to delete user");
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          state.users = action.payload.users;
          state.count = action.payload.count;
        }
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete User
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter(
          (user) => user._id !== action.payload.userId
        );
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default adminSlice.reducer;
