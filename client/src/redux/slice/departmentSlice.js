import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/utils/server';

// Async thunk to create a department
export const createDepartment = createAsyncThunk(
  'department/create',
  async (departmentData, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/departments', departmentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create department');
    }
  }
);

// Async thunk to get all departments
export const getAllDepartments = createAsyncThunk(
  'department/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/departments');
      return response.data.departments;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch departments');
    }
  }
);

// Async thunk to get a single department
export const getDepartment = createAsyncThunk(
  'department/getOne',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/departments/${id}`);
      return response.data.department;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch department');
    }
  }
);

// Async thunk to update a department
export const updateDepartment = createAsyncThunk(
  'department/update',
  async ({ id, departmentData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/departments/${id}`, departmentData);
      return response.data.department;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update department');
    }
  }
);

// Async thunk to delete a department
export const deleteDepartment = createAsyncThunk(
  'department/delete',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/api/departments/${id}`);
      return { id, message: response.data.message };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete department');
    }
  }
);

const departmentSlice = createSlice({
  name: 'departments',
  initialState: {
    departments: [],
    currentDepartment: null,
    isLoading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create department
      .addCase(createDepartment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createDepartment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.departments.push(action.payload.department);
        state.successMessage = action.payload.message;
      })
      .addCase(createDepartment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get all departments
      .addCase(getAllDepartments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllDepartments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.departments = action.payload;
      })
      .addCase(getAllDepartments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get single department
      .addCase(getDepartment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getDepartment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentDepartment = action.payload;
      })
      .addCase(getDepartment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update department
      .addCase(updateDepartment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateDepartment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.departments = state.departments.map((dept) =>
          dept._id === action.payload._id ? action.payload : dept
        );
        state.currentDepartment = action.payload;
        state.successMessage = 'Department updated successfully';
      })
      .addCase(updateDepartment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete department
      .addCase(deleteDepartment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(deleteDepartment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.departments = state.departments.filter((dept) => dept._id !== action.payload.id);
        state.successMessage = action.payload.message;
      })
      .addCase(deleteDepartment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSuccessMessage } = departmentSlice.actions;
export default departmentSlice.reducer;