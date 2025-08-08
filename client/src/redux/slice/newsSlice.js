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
  async (data, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('content', data.content);
      formData.append('department', data.department);
      formData.append('allowLikes', data.allowLikes);
      formData.append('allowComments', data.allowComments);
      formData.append('allowReactions', data.allowReactions);
      if (data.images) {
        data.images.forEach((image) => formData.append('images', image));
      }
      const response = await api.post('/api/news', formData);
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
      const formData = new FormData();
      if (data.title) formData.append('title', data.title);
      if (data.content) formData.append('content', data.content);
      if (data.department) formData.append('department', data.department);
      if (data.allowLikes !== undefined) formData.append('allowLikes', data.allowLikes);
      if (data.allowComments !== undefined) formData.append('allowComments', data.allowComments);
      if (data.allowReactions !== undefined) formData.append('allowReactions', data.allowReactions);
      if (data.removeImages) formData.append('removeImages', JSON.stringify(data.removeImages));
      if (data.images) {
        data.images.forEach((image) => formData.append('images', image));
      }
      const response = await api.put(`/api/news/${id}`, formData);
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
      const response = await api.post(`/news/${id}/like`);
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