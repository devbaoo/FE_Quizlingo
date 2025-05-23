import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiMethods } from "@/services/constant/axiosInstance";
import { GET_PROFILE_TOKEN_ENDPOINT } from "@/services/constant/apiConfig";
import { UserProfile } from "@/interfaces/IUser";

interface UserState {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  loading: false,
  error: null,
};

export const fetchUserProfile = createAsyncThunk(
  "user/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiMethods.get<UserProfile>(
        GET_PROFILE_TOKEN_ENDPOINT
      );
      return response.data.user;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch profile");
    }
  }
);

export const uploadUserAvatar = createAsyncThunk(
  "users/uploadAvatar",
  async (formData: FormData, { rejectWithValue, dispatch }) => {
    try {
      await apiMethods.post("/users/avatar", formData, {
        withCredentials: true,
      });
      await dispatch(fetchUserProfile());
      return true;
    } catch (error: any) {
      console.error("Upload avatar error:", error, error?.response);
      return rejectWithValue(
        error?.response?.data?.message || error.message || "Failed to upload avatar"
      );
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUserProfile: (state) => {
      state.profile = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(uploadUserAvatar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadUserAvatar.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(uploadUserAvatar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearUserProfile } = userSlice.actions;
export default userSlice.reducer;