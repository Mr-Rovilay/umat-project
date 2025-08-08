import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slice/authSlice';
import departmentReducer from './slice/departmentSlice';
import dashboardReducer from './slice/departmentSlice';
import programReducer from './slice/programSlice';

export const Store = configureStore({
  reducer: {
    auth: authReducer,
  department: departmentReducer,
  dashboard: dashboardReducer,
  program: programReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export default Store;