import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { logoutUser } from './authSlice';
import api from '@/utils/server';

const initialState = {
  stats: {
    courses: 0,
    students: 0,
    departments: 0,
    programs: 0,
    newsPosts: 0,
    pendingTasks: 0,
  },
  isLoading: false,
  error: null,
};

export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/admin/analytics');
      return response.data.stats;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard stats');
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, () => {
        return initialState;
      });
  },
});

export const { clearError } = dashboardSlice.actions;
export default dashboardSlice.reducer;