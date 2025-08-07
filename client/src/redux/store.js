import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slice/authSlice';
import departmentReducer from './slice/departmentSlice';

export const Store = configureStore({
  reducer: {
    auth: authReducer,
  department: departmentReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export default Store;