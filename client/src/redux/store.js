import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import departmentReducer from "./slice/departmentSlice";
import programReducer from "./slice/programSlice";
import courseReducer from "./slice/courseSlice";
import newsReducer from './slice/newsSlice';
import dashboardReducer from './slice/dashboardSlice';
import paymentReducer from './slice/paymentSlice';
import departmentAdminReducer from './slice/departmentAdminSlice';

export const Store = configureStore({
  reducer: {
    auth: authReducer,
    departments: departmentReducer,
    programs: programReducer,
    courses: courseReducer,
    news: newsReducer,
    dashboard: dashboardReducer,
    payment: paymentReducer,
    departmentAdmin: departmentAdminReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});

export default Store;
