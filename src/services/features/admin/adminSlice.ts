import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiMethods } from "@/services/constant/axiosInstance";
import {
  GET_USERS_ENDPOINT,
  DELETE_USER_ENDPOINT,
  GET_PACKAGES_ENDPOINT,
  DELETE_PACKAGES_ENDPOINT,
  UPDATE_PACKAGES_ENDPOINT,
  CREATE_PACKAGES_ENDPOINT,
  GET_TOTAL_USERS_ENDPOINT,
  GET_TOTAL_LESSONS_ENDPOINT,
  GET_TOTAL_LEVELS_ENDPOINT,
  GET_TOTAL_SKILLS_ENDPOINT,
  GET_TOTAL_USERS_BY_LEVEL_ENDPOINT,
  GET_TOTAL_USERS_BY_SKILL_ENDPOINT,
  GET_TOTAL_USERS_BY_MONTH_ENDPOINT,
} from "@/services/constant/apiConfig";
import { ApiError } from "@/services/constant/axiosInstance";
import {
  IAdmin,
  IPackage,
  IPackageUpdateCreate,
} from "@/interfaces/IAdmin";

interface UsersResponse {
  success: boolean;
  count: number;
  users: IAdmin[];
}

interface DashboardStats {
  totalUsers: number;
  totalLessons: number;
  totalLevels: number;
  totalSkills: number;
}

interface UserByLevel {
  _id: string;
  type: string;
  value: number;
}

interface UserBySkill {
  _id: string;
  type: string;
  value: number;
}

interface UserByMonth {
  month: string;
  total: number;
}

interface AdminState {
  users: IAdmin[];
  packages: IPackage[];
  loading: boolean;
  error: string | null;
  count: number;
  dashboardStats: DashboardStats | null;
  usersByLevel: UserByLevel[];
  usersBySkill: UserBySkill[];
  usersByMonth: UserByMonth[];
  dashboardLoading: boolean;
}

const initialState: AdminState = {
  users: [],
  packages: [],
  loading: false,
  error: null,
  count: 0,
  dashboardStats: null,
  usersByLevel: [],
  usersBySkill: [],
  usersByMonth: [],
  dashboardLoading: false,
};

export interface PackageResponse {
  success: boolean;
  message: string;
  packages: IPackage[];
}

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

export const fetchPackages = createAsyncThunk(
  "admin/fetchPackages",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiMethods.get<PackageResponse>(
        GET_PACKAGES_ENDPOINT
      );
      const data = response.data as unknown as PackageResponse;
      return data;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.message || "Failed to fetch packages");
    }
  }
);

export const deletePackage = createAsyncThunk(
  "admin/deletePackage",
  async (packageId: string, { rejectWithValue }) => {
    try {
      const response = await apiMethods.delete(
        DELETE_PACKAGES_ENDPOINT(packageId)
      );
      return { packageId, message: response.data.message };
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.message || "Failed to delete package");
    }
  }
);

export const createPackage = createAsyncThunk(
  "admin/createPackage",
  async (newPackage: IPackageUpdateCreate, { rejectWithValue }) => {
    try {
      const response = await apiMethods.post(
        CREATE_PACKAGES_ENDPOINT,
        newPackage
      );
      return response.data as unknown as PackageResponse;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.message || "Failed to create package");
    }
  }
);

export const updatePackage = createAsyncThunk(
  "admin/updatePackage",
  async (
    {
      packageId,
      updatedPackage,
    }: {
      packageId: string;
      updatedPackage: IPackageUpdateCreate;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiMethods.put(
        UPDATE_PACKAGES_ENDPOINT(packageId),
        updatedPackage
      );
      return response.data as unknown as IPackageUpdateCreate;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.message || "Failed to update package");
    }
  }
);

export const fetchDashboardStats = createAsyncThunk(
  "admin/fetchDashboardStats",
  async (_, { rejectWithValue }) => {
    try {
      const [totalUsers, totalLessons, totalLevels, totalSkills] = await Promise.all([
        apiMethods.get(GET_TOTAL_USERS_ENDPOINT),
        apiMethods.get(GET_TOTAL_LESSONS_ENDPOINT),
        apiMethods.get(GET_TOTAL_LEVELS_ENDPOINT),
        apiMethods.get(GET_TOTAL_SKILLS_ENDPOINT),
      ]);

      console.log('Dashboard API Responses:', {
        totalUsers: totalUsers.data,
        totalLessons: totalLessons.data,
        totalLevels: totalLevels.data,
        totalSkills: totalSkills.data,
      });

      return {
        totalUsers: (totalUsers.data as any).count || (totalUsers.data as any).total || 0,
        totalLessons: (totalLessons.data as any).count || (totalLessons.data as any).total || 0,
        totalLevels: (totalLevels.data as any).count || (totalLevels.data as any).total || 0,
        totalSkills: (totalSkills.data as any).count || (totalSkills.data as any).total || 0,
      };
    } catch (error) {
      const apiError = error as ApiError;
      console.error('Dashboard stats error:', apiError);
      return rejectWithValue(apiError.message || "Failed to fetch dashboard stats");
    }
  }
);

export const fetchUsersByLevel = createAsyncThunk(
  "admin/fetchUsersByLevel",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiMethods.get(GET_TOTAL_USERS_BY_LEVEL_ENDPOINT);
      console.log('Users by level response:', response.data);
      return (response.data as any).data || [];
    } catch (error) {
      const apiError = error as ApiError;
      console.error('Users by level error:', apiError);
      return rejectWithValue(apiError.message || "Failed to fetch users by level");
    }
  }
);

export const fetchUsersBySkill = createAsyncThunk(
  "admin/fetchUsersBySkill",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiMethods.get(GET_TOTAL_USERS_BY_SKILL_ENDPOINT);
      console.log('Users by skill response:', response.data);
      return (response.data as any).data || [];
    } catch (error) {
      const apiError = error as ApiError;
      console.error('Users by skill error:', apiError);
      return rejectWithValue(apiError.message || "Failed to fetch users by skill");
    }
  }
);

export const fetchUsersByMonth = createAsyncThunk(
  "admin/fetchUsersByMonth",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiMethods.get(GET_TOTAL_USERS_BY_MONTH_ENDPOINT);
      console.log('Users by month response:', response.data);
      return (response.data as any).data || [];
    } catch (error) {
      const apiError = error as ApiError;
      console.error('Users by month error:', apiError);
      return rejectWithValue(apiError.message || "Failed to fetch users by month");
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
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
      })
      .addCase(fetchPackages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPackages.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          state.packages = action.payload.packages;
        }
      })
      .addCase(fetchPackages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Dashboard Stats
      .addCase(fetchDashboardStats.pending, (state) => {
        state.dashboardLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.dashboardLoading = false;
        state.dashboardStats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.dashboardLoading = false;
        state.error = action.payload as string;
      })
      // Users by Level
      .addCase(fetchUsersByLevel.pending, (state) => {
        state.dashboardLoading = true;
        state.error = null;
      })
      .addCase(fetchUsersByLevel.fulfilled, (state, action) => {
        state.dashboardLoading = false;
        state.usersByLevel = action.payload;
      })
      .addCase(fetchUsersByLevel.rejected, (state, action) => {
        state.dashboardLoading = false;
        state.error = action.payload as string;
      })
      // Users by Skill
      .addCase(fetchUsersBySkill.pending, (state) => {
        state.dashboardLoading = true;
        state.error = null;
      })
      .addCase(fetchUsersBySkill.fulfilled, (state, action) => {
        state.dashboardLoading = false;
        state.usersBySkill = action.payload;
      })
      .addCase(fetchUsersBySkill.rejected, (state, action) => {
        state.dashboardLoading = false;
        state.error = action.payload as string;
      })
      // Users by Month
      .addCase(fetchUsersByMonth.pending, (state) => {
        state.dashboardLoading = true;
        state.error = null;
      })
      .addCase(fetchUsersByMonth.fulfilled, (state, action) => {
        state.dashboardLoading = false;
        state.usersByMonth = action.payload;
      })
      .addCase(fetchUsersByMonth.rejected, (state, action) => {
        state.dashboardLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default adminSlice.reducer;
