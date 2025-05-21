import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance, { ApiError } from "@/services/constant/axiosInstance";
import { CHOOSE_LEVELS_ENDPOINT, GET_LEVELS_ENDPOINT } from "@/services/constant/apiConfig";

//skill
export interface Level {
  _id: string;
  name: string;
  maxScore: string;
  timeLimit: string;
} 

interface LevelState {
  levels: Level[];
  loading: boolean;
  error: string | null;
}

const initialState: LevelState = {
  levels: [],
  loading: false,
  error: null,
};

export const fetchLevels = createAsyncThunk<
  { levels: Level[] }, 
  void,
  { rejectValue: { message: string } }
>("level/fetchLevels", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(GET_LEVELS_ENDPOINT);
    return response.data;
  } catch (err: unknown) {
    const error = err as ApiError;
    const message = error.message || "Failed to fetch levels";
    return rejectWithValue({ message });
  }
});

export const chooseLevels = createAsyncThunk<
  void,
  string, 
  { rejectValue: { message: string } }
>("level/chooseLevels", async (selectedLevelNames , { rejectWithValue }) => {
  try {
    await axiosInstance.post(CHOOSE_LEVELS_ENDPOINT, {
  level: selectedLevelNames,
});
  } catch (err: unknown) {
    const error = err as ApiError;
    const message = error.message || "Failed to choose levels";
    return rejectWithValue({ message });
  }
}); 


const levelSlice = createSlice({
  name: "level",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLevels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLevels.fulfilled, (state, action) => {
        state.loading = false;
        state.levels = action.payload.levels;
        state.error = null;
      })
      .addCase(fetchLevels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch levels";
      });
  },
});

export default levelSlice.reducer;