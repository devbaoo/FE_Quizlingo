import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance, { ApiError } from "@/services/constant/axiosInstance";
import { CHOOSE_SKILLS_ENDPOINT, GET_SKILLS_ENDPOINT } from "@/services/constant/apiConfig";

//skill
export interface Skill {
  _id: string;
  name: string;
  description: string;
  supportedTypes: string;
} 


// export interface Skill {
//   _id: string;
//   name: string;
//   description: string;
//   supportedTypes: string;
// } 

interface SkillState {
  skills: Skill[];
  loading: boolean;
  error: string | null;
}

const initialState: SkillState = {
  skills: [],
  loading: false,
  error: null,
};

export const fetchSkills = createAsyncThunk<
  { skills: Skill[] }, 
  void,
  { rejectValue: { message: string } }
>("skill/fetchSkills", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(GET_SKILLS_ENDPOINT);
    return response.data;
  } catch (err: unknown) {
    const error = err as ApiError;
    const message = error.message || "Failed to fetch skills";
    return rejectWithValue({ message });
  }
});

export const chooseSkills = createAsyncThunk<
  void,
  string[], 
  { rejectValue: { message: string } }
>("skill/chooseSkills", async (selectedSkillIds, { rejectWithValue }) => {
  try {
    await axiosInstance.post(CHOOSE_SKILLS_ENDPOINT, { 
      skills: selectedSkillIds });
  } catch (err: unknown) {
    const error = err as ApiError;
    const message = error.message || "Failed to choose skills"; 
    return rejectWithValue({ message });
  }
}); 

const skillSlice = createSlice({
  name: "skill",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSkills.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSkills.fulfilled, (state, action) => {
        state.loading = false;
        state.skills = action.payload.skills;
        state.error = null;
      })
      .addCase(fetchSkills.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch skills";
      });
  },
});

export default skillSlice.reducer;