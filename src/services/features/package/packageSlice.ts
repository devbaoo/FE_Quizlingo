import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiMethods } from "@/services/constant/axiosInstance";
import { GET_USER_PACKAGES_ENDPOINT, CREATE_PACKAGE_PURCHASE_ENDPOINT, GET_USER_ACTIVE_PACKAGE_ENDPOINT } from "@/services/constant/apiConfig";
import { ApiError } from "@/services/constant/axiosInstance";

export interface IPackageFeature {
  doubleXP: boolean;
  unlimitedLives: boolean;
}

export interface IPackage {
  _id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  isActive: boolean;
  discount: number;
  discountEndDate: string;
  features: IPackageFeature;
  createdAt: string;
  updatedAt: string;
}

interface PackageResponse {
  success: boolean;
  message: string;
  packages: IPackage[];
}

interface PurchaseResponse {
  success: boolean;
  message: string;
  purchaseInfo: {
    transactionId: string;
    amount: number;
    paymentMethod: string;
    paymentUrl: string;
    qrCode: string;
    orderCode: string;
  };
}

interface ActivePackageResponse {
  success: boolean;
  message: string;
  hasActivePackage: boolean;
  activePackage?: {
    _id: string;
    startDate: string;
    endDate: string;
    package: IPackage;
  };
}

interface PackageState {
  packages: IPackage[];
  loading: boolean;
  error: string | null;
  purchaseLoading: boolean;
  purchaseError: string | null;
  paymentUrl: string | null;
  hasActivePackage: boolean;
  activePackageLoading: boolean;
}

const initialState: PackageState = {
  packages: [],
  loading: false,
  error: null,
  purchaseLoading: false,
  purchaseError: null,
  paymentUrl: null,
  hasActivePackage: false,
  activePackageLoading: false,
};

export const fetchActivePackages = createAsyncThunk(
  "package/fetchActivePackages",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiMethods.get<PackageResponse>(GET_USER_PACKAGES_ENDPOINT);
      const data = response.data as unknown as PackageResponse;
      return data;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.message || "Failed to fetch packages");
    }
  }
);

export const purchasePackage = createAsyncThunk(
  "package/purchasePackage",
  async (packageId: string, { rejectWithValue }) => {
    try {
      const response = await apiMethods.post<PurchaseResponse>(
        CREATE_PACKAGE_PURCHASE_ENDPOINT,
        {
          packageId,
          paymentMethod: "payos"
        }
      );
      
      const data = response.data as unknown as PurchaseResponse;
      if (data.success && data.purchaseInfo) {
        return {
          paymentUrl: data.purchaseInfo.paymentUrl
        };
      } else {
        return rejectWithValue(data.message || "Failed to purchase package");
      }
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.message || "Failed to purchase package");
    }
  }
);

export const checkActivePackage = createAsyncThunk(
  "package/checkActivePackage",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiMethods.get<ActivePackageResponse>(GET_USER_ACTIVE_PACKAGE_ENDPOINT);
      return response.data as unknown as ActivePackageResponse;
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError.response?.status === 404) {
        return { 
          success: true,
          message: "No active package",
          hasActivePackage: false 
        } as ActivePackageResponse;
      }
      return rejectWithValue(apiError.message || "Failed to check active package");
    }
  }
);

const packageSlice = createSlice({
  name: "package",
  initialState,
  reducers: {
    clearPurchaseState: (state) => {
      state.purchaseLoading = false;
      state.purchaseError = null;
      state.paymentUrl = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchActivePackages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActivePackages.fulfilled, (state, action) => {
        state.loading = false;
        state.packages = action.payload.packages;
      })
      .addCase(fetchActivePackages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(purchasePackage.pending, (state) => {
        state.purchaseLoading = true;
        state.purchaseError = null;
      })
      .addCase(purchasePackage.fulfilled, (state, action) => {
        state.purchaseLoading = false;
        state.paymentUrl = action.payload.paymentUrl;
      })
      .addCase(purchasePackage.rejected, (state, action) => {
        state.purchaseLoading = false;
        state.purchaseError = action.payload as string;
      })
      .addCase(checkActivePackage.pending, (state) => {
        state.activePackageLoading = true;
      })
      .addCase(checkActivePackage.fulfilled, (state, action) => {
        state.activePackageLoading = false;
        state.hasActivePackage = action.payload.hasActivePackage || false;
      })
      .addCase(checkActivePackage.rejected, (state) => {
        state.activePackageLoading = false;
        state.hasActivePackage = false;
      });
  },
});

export const { clearPurchaseState } = packageSlice.actions;
export default packageSlice.reducer; 