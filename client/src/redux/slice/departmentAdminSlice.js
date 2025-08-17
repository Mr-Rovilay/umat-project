// redux/slice/departmentAdminSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/utils/server';

// Get department registration statistics
export const fetchDepartmentStats = createAsyncThunk(
  'departmentAdmin/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/department-admin/stats');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch department stats');
    }
  }
);

// Get online students count
const getDepartmentOnlineStudentsCount = createAsyncThunk(
  'departmentAdmin/getOnlineStudentsCount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/department-admin/online-students-count');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch online students count');
    }
  }
);
export { getDepartmentOnlineStudentsCount };

export const fetchStudentRegistrations = createAsyncThunk(
  'departmentAdmin/fetchStudentRegistrations',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/department-admin/registrations', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch student registrations');
    }
  }
);

// Verify student documents
export const verifyStudentDocuments = createAsyncThunk(
  'departmentAdmin/verifyDocuments',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/department-admin/verify-documents', data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to verify documents');
    }
  }
);

// Get student registration details
export const fetchStudentRegistrationDetails = createAsyncThunk(
  'departmentAdmin/fetchStudentRegistrationDetails',
  async (registrationId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/department-admin/registration/${registrationId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch registration details');
    }
  }
);

const initialState = {
  stats: {
    department: null,
    totalRegistrations: 0,
    registrationsBySemester: [],
    registrationsByLevel: [],
    pendingVerifications: [],
    paymentStats: [],
  },
  onlineStudents: {
    onlineStudentsCount: 0,
    totalStudentsCount: 0,
    onlinePercentage: 0,
    departmentId: null
  },
  registrations: [],
  registrationDetails: null,
  isLoading: false,
  error: null,
  verificationSuccess: false,
};

const departmentAdminSlice = createSlice({
  name: 'departmentAdmin',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearVerificationSuccess: (state) => {
      state.verificationSuccess = false;
    },
    resetRegistrationDetails: (state) => {
      state.registrationDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch department stats
      .addCase(fetchDepartmentStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDepartmentStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload;
        state.error = null;
      })
      .addCase(fetchDepartmentStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch online students count
      .addCase(getDepartmentOnlineStudentsCount.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getDepartmentOnlineStudentsCount.fulfilled, (state, action) => {
        state.isLoading = false;
        state.onlineStudents = action.payload;
        state.error = null;
      })
      .addCase(getDepartmentOnlineStudentsCount.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch student registrations
      .addCase(fetchStudentRegistrations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStudentRegistrations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.registrations = action.payload.registrations;
        state.error = null;
      })
      .addCase(fetchStudentRegistrations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Verify student documents
      .addCase(verifyStudentDocuments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.verificationSuccess = false;
      })
      .addCase(verifyStudentDocuments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.verificationSuccess = true;
        state.error = null;
      })
      .addCase(verifyStudentDocuments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.verificationSuccess = false;
      })
      // Fetch student registration details
      .addCase(fetchStudentRegistrationDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStudentRegistrationDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.registrationDetails = action.payload.registration;
        state.error = null;
      })
      .addCase(fetchStudentRegistrationDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  clearError, 
  clearVerificationSuccess, 
  resetRegistrationDetails 
} = departmentAdminSlice.actions;

export default departmentAdminSlice.reducer;