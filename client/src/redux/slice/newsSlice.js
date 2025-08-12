// redux/slice/newsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { logoutUser } from './authSlice';
import api from '@/utils/server';

const initialState = {
  newsPosts: [],
  isLoading: false,
  error: null,
};

// Fetch news posts by department
export const fetchNewsPosts = createAsyncThunk(
  'news/fetchNewsPosts',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/news', { params });
      return response.data.posts;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch news posts');
    }
  }
);

// Create news post
export const createNewsPost = createAsyncThunk(
  'news/createNewsPost',
  async (formData, { rejectWithValue }) => {
    try {
      // If formData is already a FormData object, use it directly
      // Otherwise, create a new FormData object from the data
      const payload = formData instanceof FormData 
        ? formData 
        : (() => {
            const newFormData = new FormData();
            Object.keys(formData).forEach(key => {
              if (key === 'images' && Array.isArray(formData[key])) {
                formData[key].forEach(file => newFormData.append('images', file));
              } else {
                newFormData.append(key, formData[key]);
              }
            });
            return newFormData;
          })();
      
      const response = await api.post('/api/news', payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.post;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create news post');
    }
  }
);

// Edit news post
export const editNewsPost = createAsyncThunk(
  'news/editNewsPost',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      // If data is already a FormData object, use it directly
      // Otherwise, create a new FormData object from the data
      const payload = data instanceof FormData 
        ? data 
        : (() => {
            const newFormData = new FormData();
            Object.keys(data).forEach(key => {
              if (key === 'images' && Array.isArray(data[key])) {
                data[key].forEach(file => newFormData.append('images', file));
              } else if (key === 'removeImages' && Array.isArray(data[key])) {
                newFormData.append('removeImages', JSON.stringify(data[key]));
              } else {
                newFormData.append(key, data[key]);
              }
            });
            return newFormData;
          })();
      
      const response = await api.put(`/api/news/${id}`, payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.post;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update news post');
    }
  }
);

// Delete news post
export const deleteNewsPost = createAsyncThunk(
  'news/deleteNewsPost',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/api/news/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete news post');
    }
  }
);

// Like news post
export const likeNewsPost = createAsyncThunk(
  'news/likeNewsPost',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/news/${id}/like`);
      return response.data.post;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to like news post');
    }
  }
);

// Comment on news post
export const commentNewsPost = createAsyncThunk(
  'news/commentNewsPost',
  async ({ id, content }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/news/${id}/comment`, { content });
      return response.data.post;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to comment on news post');
    }
  }
);

// React to news post
export const reactNewsPost = createAsyncThunk(
  'news/reactNewsPost',
  async ({ id, type }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/news/${id}/react`, { type });
      return response.data.post;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to react to news post');
    }
  }
);

const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch news posts
    builder
      .addCase(fetchNewsPosts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNewsPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.newsPosts = action.payload;
      })
      .addCase(fetchNewsPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Create news post
    builder
      .addCase(createNewsPost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createNewsPost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.newsPosts = [action.payload, ...state.newsPosts];
      })
      .addCase(createNewsPost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Edit news post
    builder
      .addCase(editNewsPost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(editNewsPost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.newsPosts = state.newsPosts.map((post) =>
          post._id === action.payload._id ? action.payload : post
        );
      })
      .addCase(editNewsPost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Delete news post
    builder
      .addCase(deleteNewsPost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteNewsPost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.newsPosts = state.newsPosts.filter((post) => post._id !== action.payload);
      })
      .addCase(deleteNewsPost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Like news post
    builder
      .addCase(likeNewsPost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(likeNewsPost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.newsPosts = state.newsPosts.map((post) =>
          post._id === action.payload._id ? action.payload : post
        );
      })
      .addCase(likeNewsPost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Comment news post
    builder
      .addCase(commentNewsPost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(commentNewsPost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.newsPosts = state.newsPosts.map((post) =>
          post._id === action.payload._id ? action.payload : post
        );
      })
      .addCase(commentNewsPost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // React news post
    builder
      .addCase(reactNewsPost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(reactNewsPost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.newsPosts = state.newsPosts.map((post) =>
          post._id === action.payload._id ? action.payload : post
        );
      })
      .addCase(reactNewsPost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Handle logout
    // builder.addCase(logoutUser.fulfilled, (state) => {
    //   return initialState;
    // });
  },
});

export const { clearError } = newsSlice.actions;
export default newsSlice.reducer;