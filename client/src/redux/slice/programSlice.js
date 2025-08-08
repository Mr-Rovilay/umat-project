import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/utils/server';

// Async thunk to create a program
export const createProgram = createAsyncThunk(
  'program/create',
  async (programData, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/programs', programData);
      return response.data.program;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create program');
    }
  }
);

// Async thunk to get all programs
export const getAllPrograms = createAsyncThunk(
  'program/getAll',
  async (departmentId, { rejectWithValue }) => {
    try {
      const url = departmentId ? `/api/programs?department=${departmentId}` : '/api/programs';
      const response = await api.get(url);
      return response.data.programs;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch programs');
    }
  }
);

// Async thunk to get a single program
export const getProgram = createAsyncThunk(
  'program/getOne',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/programs/${id}`);
      return response.data.program;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch program');
    }
  }
);

// Async thunk to update a program
export const updateProgram = createAsyncThunk(
  'program/update',
  async ({ id, programData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/programs/${id}`, programData);
      return response.data.program;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update program');
    }
  }
);

// Async thunk to delete a program
export const deleteProgram = createAsyncThunk(
  'program/delete',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/api/programs/${id}`);
      return { id, message: response.data.message };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete program');
    }
  }
);

const programSlice = createSlice({
  name: 'program',
  initialState: {
    programs: [],
    currentProgram: null,
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
      // Create program
      .addCase(createProgram.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createProgram.fulfilled, (state, action) => {
        state.isLoading = false;
        state.programs.push(action.payload);
        state.successMessage = 'Program created successfully';
      })
      .addCase(createProgram.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get all programs
      .addCase(getAllPrograms.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllPrograms.fulfilled, (state, action) => {
        state.isLoading = false;
        state.programs = action.payload;
      })
      .addCase(getAllPrograms.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get single program
      .addCase(getProgram.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProgram.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProgram = action.payload;
      })
      .addCase(getProgram.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update program
      .addCase(updateProgram.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateProgram.fulfilled, (state, action) => {
        state.isLoading = false;
        state.programs = state.programs.map((prog) =>
          prog._id === action.payload._id ? action.payload : prog
        );
        state.currentProgram = action.payload;
        state.successMessage = 'Program updated successfully';
      })
      .addCase(updateProgram.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete program
      .addCase(deleteProgram.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(deleteProgram.fulfilled, (state, action) => {
        state.isLoading = false;
        state.programs = state.programs.filter((prog) => prog._id !== action.payload.id);
        state.successMessage = action.payload.message;
      })
      .addCase(deleteProgram.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSuccessMessage } = programSlice.actions;
export default programSlice.reducer;