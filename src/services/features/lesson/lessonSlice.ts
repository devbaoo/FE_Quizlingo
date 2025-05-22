import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance, { ApiError } from "@/services/constant/axiosInstance";
import {
  GET_LESSONS_ENDPOINT,
  GET_LESSON_BY_ID_ENDPOINT,
  COMPLETE_LESSON_ENDPOINT,
  RETRY_LESSON_ENDPOINT,
  GET_CHECK_COMPLETED_LESSON_ENDPOINT,
} from "@/services/constant/apiConfig";
import {
  ILesson,
  LessonProgress,
  UserProgress,
  QuestionResult,
} from "@/interfaces/ILesson";
import { message as antMessage } from "antd";

interface LessonState {
  lessons: ILesson[];
  currentLesson: ILesson | null;
  loading: boolean;
  error: string | null;
  progress: LessonProgress | null;
  userProgress: UserProgress | null;
  status: string | null;
  completedLessons: { [key: string]: boolean };
}

const initialState: LessonState = {
  lessons: [],
  currentLesson: null,
  loading: false,
  error: null,
  progress: null,
  userProgress: null,
  status: null,
  completedLessons: {},
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
    const errorMessage = error.message || "Failed to complete lesson";
    if (errorMessage === "Bài học đã được hoàn thành trước đó") {
      antMessage.info({
        content: "Bài học đã được hoàn thành trước đó",
        className: "font-baloo",
        duration: 3,
      });
    }
    return rejectWithValue({ message: errorMessage });
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

export const checkLessonCompletion = createAsyncThunk<
  { completed: boolean; progress: LessonProgress },
  string,
  { rejectValue: { message: string } }
>("lesson/checkCompletion", async (lessonId, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(
      GET_CHECK_COMPLETED_LESSON_ENDPOINT(lessonId)
    );
    return response.data;
  } catch (err: unknown) {
    const error = err as ApiError;
    const message = error.message || "Failed to check lesson completion";
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
      })
      // Check Lesson Completion
      .addCase(checkLessonCompletion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkLessonCompletion.fulfilled, (state, action) => {
        state.loading = false;
        if (!state.completedLessons) state.completedLessons = {};
        state.completedLessons[action.meta.arg] = action.payload.completed;
        state.error = null;
      })
      .addCase(checkLessonCompletion.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to check lesson completion";
      });
  },
});

export const { clearCurrentLesson } = lessonSlice.actions;
export default lessonSlice.reducer;
