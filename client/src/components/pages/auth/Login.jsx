import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Shield,
} from "lucide-react";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { clearError, loginUser } from "@/redux/slice/authSlice";

// Dynamic Zod schema for login validation
const getLoginSchema = (isAdminLogin) =>
  z
    .object({
      email: z.string().email("Please enter a valid email address"),
      password: z.string().min(6, "Password must be at least 6 characters"),
      secretKey: isAdminLogin
        ? z.string().min(8, "Secret key must be at least 8 characters")
        : z.string().optional(),
      rememberMe: z.boolean().optional(),
})
    .refine(
      (data) => {
        if (isAdminLogin && !data.secretKey) return false;
        return true;
      },
      {
        message: "Secret key is required for admin login",
        path: ["secretKey"],
      }
    );

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, isAuthenticated, user, error } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(getLoginSchema(isAdminLogin)),
    defaultValues: {
      email: "",
      password: "",
      secretKey: "",
      rememberMe: false,
    },
  });

  // Update schema when isAdminLogin changes
  useEffect(() => {
    reset({ email: "", password: "", secretKey: "", rememberMe: false });
  }, [isAdminLogin, reset]);

  // Redirect based on user role
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "student") {
        navigate("/student/dashboard");
      } else if (user.role === "admin") {
        navigate("/dashboard");
      } else {
        toast.error("Unknown user role. Please contact support.");
        navigate("/");
      }
    }
  }, [isAuthenticated, user, navigate]);

  // Clear errors on unmount
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // Form submission
  const onSubmit = async (data) => {
    try {
      const loginData = {
        email: data.email,
        password: data.password,
        ...(isAdminLogin && data.secretKey && { secretKey: data.secretKey }),
        rememberMe: data.rememberMe,
      };
      await dispatch(loginUser(loginData)).unwrap();
      toast.success("Login successful! Redirecting to dashboard...");
      window.location.reload(); // Reload to update user state
    } catch (err) {
      toast.error(`Login Failed: ${err}`);
    }
  };

  // Toggle between student and admin login
  const toggleAdminLogin = () => {
    setIsToggling(true);
    setIsAdminLogin((prev) => !prev);
    setTimeout(() => setIsToggling(false), 300); // Prevent rapid toggling
  };

  return (
    <div className="h-screen flex items-center justify-center p-4 dark:bg-gray-900">
      <Card className="w-full max-w-md bg-white dark:bg-gray-800 shadow-xl border-0">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription className="text-muted-foreground">
            Sign in to your {isAdminLogin ? "admin" : "student"} account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </Label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    id="email"
                    type="email"
                    placeholder="john.doe@example.com"
                    className="border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    {...field}
                  />
                )}
              />
              {errors.email && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Password
              </Label>
              <div className="relative">
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white pr-10"
                      {...field}
                    />
                  )}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Secret Key (for Admin Login) */}
            {isAdminLogin && (
              <div className="space-y-2">
                <Label htmlFor="secretKey" className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Admin Secret Key
                </Label>
                <Controller
                  name="secretKey"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="secretKey"
                      type="text"
                      placeholder="Enter admin secret key"
                      className="border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      {...field}
                    />
                  )}
                />
                {errors.secretKey && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors.secretKey.message}
                  </p>
                )}
              </div>
            )}

            {/* Remember Me and Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Controller
                  name="rememberMe"
                  control={control}
                  render={({ field }) => (
                    <input
                      id="rememberMe"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  )}
                />
                <Label htmlFor="rememberMe" className="text-sm text-gray-700 dark:text-gray-300">
                  Remember me
                </Label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 hover:underline dark:text-blue-400"
              >
                Forgot password?
              </Link>
            </div>

            {/* Toggle Admin/Student Login */}
            <div className="text-center">
              <Button
                type="button"
                variant="link"
                onClick={toggleAdminLogin}
                className="text-blue-600 hover:underline dark:text-blue-400"
                disabled={isToggling}
              >
                {isAdminLogin ? "Switch to Student Login" : "Switch to Admin Login"}
              </Button>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-semibold py-3 hover:brightness-110 disabled:opacity-60"
              disabled={isLoading || isToggling}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Error Display */}
          {error && (
            <div className="mt-4">
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </div>
          )}

          {/* Signup Link */}
          <div className="text-center text-sm text-gray-600 dark:text-gray-400 pt-2">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-500 hover:underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;