import AdminDashboard from "./components/pages/Dashboard/AdminDashboard";
import Login from "./components/pages/auth/Login";
import Signup from "./components/pages/auth/Signup";
import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import Home from "./components/pages/Home/Home";
import { useEffect } from "react";
import { getUser } from "./redux/slice/authSlice";
import { useSelector } from "react-redux";
import Store from "./redux/store";

const App = () => {
  const { isAuthenticated, user,  isLoading } = useSelector((state) => state.auth);
  console.log(isAuthenticated, user)
    // Check authentication on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        await Store.dispatch(getUser());
      } catch (error) {
        console.error("Failed to load user", error);
      } finally {
        // isLoading(false);
      }
    };

    fetchUser();
  }, []);



  return (
    <div className="">
      <>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={<Home />}
          />
          {/* <Route path="/news" element={<NewsPage />} /> */}
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </>
    </div>
  );
};

export default App;
