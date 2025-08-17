import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import { getUser } from "./redux/slice/authSlice";
import Navbar from "./components/Navbar";
import Home from "./components/pages/Home/Home";
import Login from "./components/pages/auth/Login";
import Signup from "./components/pages/auth/Signup";
import StudentDashboard from "./components/pages/Dashboard/StudentDashboard";
import AdminDepartmentManagement from "./components/pages/AdminDepartmentManagement";
import AdminDashboard from "./components/pages/Dashboard/AdminDashboard";
import DepartmentsPage from "./components/pages/DepartmentsPage";
import ProgramsPage from "./components/pages/ProgramsPage";
import Store from "./redux/store";
import AdminProgramManagement from "./components/pages/AdminProgramManagement";
import RegisterCourses from "./components/RegisterCourses";
import MyCourses from "./components/pages/MyCourses";
import News from "./components/pages/News";
import CreateNewsPost from "./components/pages/CreateNewsPost";
import Profile from "./components/pages/Profile";
import PaymentConfirmation from "./components/pages/PaymentConfirmation";
import PaymentHistory from "./components/pages/PaymentHistory";
import PaymentCallback from "./components/PaymentCallback ";
import RegistrationDetails from "./components/pages/RegistrationDetails";
import ProgramDetailPage from "./components/pages/ProgramDetailPage";

function App() {
  useEffect(() => {
    const fetchUser = async () => {
      try {
        await Store.dispatch(getUser());
      } catch (error) {
        console.error("Failed to load user", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/programs" element={<ProgramsPage />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute role="student">
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="/programs/:id" element={<ProgramDetailPage />} />
          <Route path="/departments" element={<DepartmentsPage />} />
          <Route path="/news" element={<News />} />
          <Route
            path="/news/create"
            element={
              <ProtectedRoute role="admin">
                <CreateNewsPost />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/registration/:registrationId"
            element={
              <ProtectedRoute role="admin">
                <RegistrationDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/news/edit/:id"
            element={
              <ProtectedRoute role="admin">
                <CreateNewsPost />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/departments"
            element={
              <ProtectedRoute role="admin">
                <AdminDepartmentManagement />
              </ProtectedRoute>
            }
          />
          {/* <Route
            path="/courses/available"
            element={
              <ProtectedRoute role="student">
                <AvailableCourses />
              </ProtectedRoute>
            }
          /> */}
          <Route
            path="/payments/verify/:reference"
            element={
              <ProtectedRoute role="student">
                <PaymentConfirmation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/payments/history"
            element={
              <ProtectedRoute role="student">
                <PaymentHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment/callback"
            element={
              <ProtectedRoute role="student">
                <PaymentCallback />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses/register"
            element={
              <ProtectedRoute role="student">
                <RegisterCourses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses/my-courses"
            element={
              <ProtectedRoute role="student">
                <MyCourses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/programs"
            element={
              <ProtectedRoute role="admin">
                <AdminProgramManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute role="student">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
