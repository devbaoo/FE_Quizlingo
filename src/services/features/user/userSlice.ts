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
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : "Failed to fetch profile";
      return rejectWithValue(errMsg);
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
    updateUserProfileFromLesson: (state, action) => {
      if (state.profile && action.payload) {
        state.profile = {
          ...state.profile,
          ...action.payload,
        };
      }
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
      });
  },
});

export const { clearUserProfile, updateUserProfileFromLesson } = userSlice.actions;
export default userSlice.reducer;
