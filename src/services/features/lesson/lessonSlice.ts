import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance, { ApiError } from "@/services/constant/axiosInstance";
import {
  GET_LESSONS_ENDPOINT,
  GET_LESSON_BY_ID_ENDPOINT,
  COMPLETE_LESSON_ENDPOINT,
  RETRY_LESSON_ENDPOINT,
} from "@/services/constant/apiConfig";
import {
  ILesson,
  LessonProgress,
  UserProgress,
  QuestionResult,
} from "@/interfaces/ILesson";

interface LessonState {
  lessons: ILesson[];
  currentLesson: ILesson | null;
  loading: boolean;
  error: string | null;
  progress: LessonProgress | null;
  userProgress: UserProgress | null;
  status: string | null;
}

const initialState: LessonState = {
  lessons: [],
  currentLesson: null,
  loading: false,
  error: null,
  progress: null,
  userProgress: null,
  status: null,
};

export const fetchLessons = createAsyncThunk<
  { lessons: ILesson[] },
  void,
  { rejectValue: { message: string } }
>("lesson/fetchLessons", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(GET_LESSONS_ENDPOINT);
    return response.data;
  } catch (err: unknown) {
    const error = err as ApiError;
    const message = error.message || "Failed to fetch lessons";
    return rejectWithValue({ message });
  }
});

export const fetchLessonById = createAsyncThunk<
  { lesson: ILesson },
  string,
  { rejectValue: { message: string } }
>("lesson/fetchLessonById", async (id, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(GET_LESSON_BY_ID_ENDPOINT(id));
    return response.data;
  } catch (err: unknown) {
    const error = err as ApiError;
    const message = error.message || "Failed to fetch lesson";
    return rejectWithValue({ message });
  }
});

export const completeLesson = createAsyncThunk<
  { progress: LessonProgress; user: UserProgress; status: string },
  {
    lessonId: string;
    score: number;
    questionResults: QuestionResult[];
    isRetried: boolean;
  },
  { rejectValue: { message: string } }
>("lesson/completeLesson", async (data, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(COMPLETE_LESSON_ENDPOINT, data);
    return response.data;
  } catch (err: unknown) {
    const error = err as ApiError;
    const message = error.message || "Failed to complete lesson";
    return rejectWithValue({ message });
  }
});

export const retryLesson = createAsyncThunk<
  void,
  { lessonId: string },
  { rejectValue: { message: string } }
>("lesson/retryLesson", async (data, { rejectWithValue }) => {
  try {
    await axiosInstance.post(RETRY_LESSON_ENDPOINT, data);
  } catch (err: unknown) {
    const error = err as ApiError;
    const message = error.message || "Failed to retry lesson";
    return rejectWithValue({ message });
  }
});

const lessonSlice = createSlice({
  name: "lesson",
  initialState,
  reducers: {
    clearCurrentLesson: (state) => {
      state.currentLesson = null;
      state.progress = null;
      state.userProgress = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Lessons
      .addCase(fetchLessons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLessons.fulfilled, (state, action) => {
        state.loading = false;
        state.lessons = action.payload.lessons;
        state.error = null;
      })
      .addCase(fetchLessons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch lessons";
      })
      // Fetch Lesson By Id
      .addCase(fetchLessonById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLessonById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentLesson = action.payload.lesson;
        state.error = null;
      })
      .addCase(fetchLessonById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch lesson";
      })
      // Complete Lesson
      .addCase(completeLesson.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completeLesson.fulfilled, (state, action) => {
        state.loading = false;
        state.progress = action.payload.progress;
        state.userProgress = action.payload.user;
        state.status = action.payload.status;
        state.error = null;
      })
      .addCase(completeLesson.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to complete lesson";
      })
      // Retry Lesson
      .addCase(retryLesson.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(retryLesson.fulfilled, (state) => {
        state.loading = false;
        state.progress = null;
        state.error = null;
      })
      .addCase(retryLesson.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to retry lesson";
      });
  },
});

export const { clearCurrentLesson } = lessonSlice.actions;
export default lessonSlice.reducer;
