import api from '@/utils/server';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


const initialState = {
  availableCourses: [],
  myCourses: [],
  isLoading: false,
  error: null,
};

// Fetch available courses
export const fetchAvailableCourses = createAsyncThunk(
  'courses/fetchAvailableCourses',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/courses/available', { params });
      return response.data.courses;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch courses');
    }
  }
);

// Register courses
export const registerCourses = createAsyncThunk(
  'courses/registerCourses',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/courses/register', data);
      return response.data.registration;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to register courses');
    }
  }
);

// Fetch my registered courses
export const fetchMyCourses = createAsyncThunk(
  'courses/fetchMyCourses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/courses/my-courses');
      return response.data.registrations;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch registered courses');
    }
  }
);

// Create course(s)
export const createCourse = createAsyncThunk(
  'courses/createCourse',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/courses', data);
      return response.data.courses || response.data.course;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create course(s)');
    }
  }
);

// Update course
export const updateCourse = createAsyncThunk(
  'courses/updateCourse',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/courses/update${id}`, data);
      return response.data.course;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update course');
    }
  }
);

// Delete course
export const deleteCourse = createAsyncThunk(
  'courses/deleteCourse',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/api/courses/delete${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete course');
    }
  }
);

const courseSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch available courses
    builder
      .addCase(fetchAvailableCourses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAvailableCourses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.availableCourses = action.payload;
      })
      .addCase(fetchAvailableCourses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Register courses
    builder
      .addCase(registerCourses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerCourses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myCourses = [...state.myCourses, action.payload];
      })
      .addCase(registerCourses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Fetch my courses
    builder
      .addCase(fetchMyCourses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyCourses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myCourses = action.payload;
      })
      .addCase(fetchMyCourses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Create course
    builder
      .addCase(createCourse.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        state.isLoading = false;
        state.availableCourses = Array.isArray(action.payload)
          ? [...state.availableCourses, ...action.payload]
          : [...state.availableCourses, action.payload];
      })
      .addCase(createCourse.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Update course
    builder
      .addCase(updateCourse.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
        state.isLoading = false;
        state.availableCourses = state.availableCourses.map((course) =>
          course._id === action.payload._id ? action.payload : course
        );
      })
      .addCase(updateCourse.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Delete course
    builder
      .addCase(deleteCourse.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.isLoading = false;
        state.availableCourses = state.availableCourses.filter(
          (course) => course._id !== action.payload
        );
      })
      .addCase(deleteCourse.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Handle logout
    // builder.addCase(logoutUser.fulfilled, (state) => {
    //   return initialState;
    // });
  },
});

export const { clearError } = courseSlice.actions;
export default courseSlice.reducer;