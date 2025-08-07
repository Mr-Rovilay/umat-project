import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slice/authSlice';

export const Store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export default Store;