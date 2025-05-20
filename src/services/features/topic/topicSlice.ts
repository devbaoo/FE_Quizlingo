import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance, { ApiError } from "@/services/constant/axiosInstance";
import { GET_TOPICS_ENDPOINT } from "@/services/constant/apiConfig";

export interface Topic {
  _id: string;
  name: string;
  description: string;
}

interface TopicState {
  topics: Topic[];
  loading: boolean;
  error: string | null;
}

const initialState: TopicState = {
  topics: [],
  loading: false,
  error: null,
};

export const fetchTopics = createAsyncThunk<
  { topics: Topic[] },
  void,
  { rejectValue: { message: string } }
>("topic/fetchTopics", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(GET_TOPICS_ENDPOINT);
    return response.data;
  } catch (err: unknown) {
    const error = err as ApiError;
    const message = error.message || "Failed to fetch topics";
    return rejectWithValue({ message });
  }
});

const topicSlice = createSlice({
  name: "topic",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTopics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopics.fulfilled, (state, action) => {
        state.loading = false;
        state.topics = action.payload.topics;
        state.error = null;
      })
      .addCase(fetchTopics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch topics";
      });
  },
});

export default topicSlice.reducer;
