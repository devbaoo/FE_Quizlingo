import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiMethods } from "@/services/constant/axiosInstance";
import {
  GET_ACTIVE_PACKAGES_ENDPOINT,
  GET_PACKAGE_DETAILS_ENDPOINT,
  GET_USER_ACTIVE_PACKAGE_ENDPOINT,
  CREATE_PACKAGE_PURCHASE_ENDPOINT,
  CHECK_PAYMENT_STATUS_ENDPOINT,
  CANCEL_PAYMENT_ENDPOINT,
  CHECK_USER_PACKAGES_ENDPOINT,
} from "@/services/constant/apiConfig";
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

interface PaymentStatusResponse {
  success: boolean;
  message: string;
  status: string;
}

interface PackageState {
  packages: IPackage[];
  packageDetails: IPackage | null;
  loading: boolean;
  error: string | null;
  purchaseLoading: boolean;
  purchaseError: string | null;
  paymentUrl: string | null;
  hasActivePackage: boolean;
  activePackage: any | null;
  activePackageLoading: boolean;
  paymentStatus: PaymentStatusResponse | null;
  paymentStatusLoading: boolean;
}

const initialState: PackageState = {
  packages: [],
  packageDetails: null,
  loading: false,
  error: null,
  purchaseLoading: false,
  purchaseError: null,
  paymentUrl: null,
  hasActivePackage: false,
  activePackage: null,
  activePackageLoading: false,
  paymentStatus: null,
  paymentStatusLoading: false,
};

export const fetchActivePackages = createAsyncThunk(
  "package/fetchActivePackages",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiMethods.get<PackageResponse>(
        GET_ACTIVE_PACKAGES_ENDPOINT
      );
      return response.data;
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
        { packageId, paymentMethod: "payos" }
      );
      return response.data;
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
      const response = await apiMethods.get<ActivePackageResponse>(
        GET_USER_ACTIVE_PACKAGE_ENDPOINT
      );
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError.response?.status === 404) {
        return {
          success: true,
          message: "No active package",
          hasActivePackage: false,
        };
      }
      return rejectWithValue(
        apiError.message || "Failed to check active package"
      );
    }
  }
);

export const getPackageDetails = createAsyncThunk(
  "package/getDetails",
  async (packageId: string, { rejectWithValue }) => {
    try {
      const response = await apiMethods.get(
        GET_PACKAGE_DETAILS_ENDPOINT(packageId)
      );
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(
        apiError.message || "Failed to get package details"
      );
    }
  }
);

export const checkPaymentStatus = createAsyncThunk(
  "package/checkPaymentStatus",
  async (transactionId: string, { rejectWithValue }) => {
    try {
      const response = await apiMethods.get(
        CHECK_PAYMENT_STATUS_ENDPOINT(transactionId)
      );
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(
        apiError.message || "Failed to check payment status"
      );
    }
  }
);

export const cancelPayment = createAsyncThunk(
  "package/cancelPayment",
  async (transactionId: string, { rejectWithValue }) => {
    try {
      const response = await apiMethods.delete(
        CANCEL_PAYMENT_ENDPOINT(transactionId)
      );
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.message || "Failed to cancel payment");
    }
  }
);

export const checkAndUpdateUserPackages = createAsyncThunk(
  "package/checkAndUpdate",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiMethods.get(CHECK_USER_PACKAGES_ENDPOINT);
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(
        apiError.message || "Failed to check user packages"
      );
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
    },
    clearPackageDetails: (state) => {
      state.packageDetails = null;
    },
    clearPaymentStatus: (state) => {
      state.paymentStatus = null;
    },
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
        state.paymentUrl = action.payload.purchaseInfo?.paymentUrl || null;
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
        state.hasActivePackage = action.payload.hasActivePackage;
        state.activePackage = action.payload.activePackage || null;
      })
      .addCase(checkActivePackage.rejected, (state) => {
        state.activePackageLoading = false;
        state.hasActivePackage = false;
      })
      .addCase(getPackageDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPackageDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.packageDetails = action.payload.package;
      })
      .addCase(getPackageDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(checkPaymentStatus.pending, (state) => {
        state.paymentStatusLoading = true;
      })
      .addCase(checkPaymentStatus.fulfilled, (state, action) => {
        state.paymentStatusLoading = false;
        state.paymentStatus = action.payload;
      })
      .addCase(checkPaymentStatus.rejected, (state, action) => {
        state.paymentStatusLoading = false;
        state.error = action.payload as string;
      })
      .addCase(cancelPayment.fulfilled, (state) => {
        state.paymentUrl = null;
      })
      .addCase(checkAndUpdateUserPackages.fulfilled, (state, action) => {
        state.hasActivePackage = action.payload.hasActivePackage;
        state.activePackage = action.payload.activePackage || null;
      });
  },
});

export const { clearPurchaseState, clearPackageDetails, clearPaymentStatus } =
  packageSlice.actions;
export default packageSlice.reducer;
