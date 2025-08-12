// redux/slice/paymentSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/utils/server';

// Initialize payment
export const initializePayment = createAsyncThunk(
  'payment/initializePayment',
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/payments/initialize', paymentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to initialize payment');
    }
  }
);

// Verify payment
export const verifyPayment = createAsyncThunk(
  'payment/verifyPayment',
  async (reference, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/payments/verify/${reference}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to verify payment');
    }
  }
);

// Get payment history
export const getPaymentHistory = createAsyncThunk(
  'payment/getPaymentHistory',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/payments/history');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch payment history');
    }
  }
);

const paymentSlice = createSlice({
  name: 'payment',
  initialState: {
    paymentDetails: null,
    paymentVerification: null,
    paymentHistory: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetPayment: (state) => {
      state.paymentDetails = null;
      state.paymentVerification = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Initialize payment
      .addCase(initializePayment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(initializePayment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.paymentDetails = action.payload.data;
        state.error = null;
      })
      .addCase(initializePayment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Verify payment
      .addCase(verifyPayment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.paymentVerification = action.payload.data;
        state.error = null;
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get payment history
      .addCase(getPaymentHistory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getPaymentHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.paymentHistory = action.payload.data.payments;
        state.error = null;
      })
      .addCase(getPaymentHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, resetPayment } = paymentSlice.actions;
export default paymentSlice.reducer;