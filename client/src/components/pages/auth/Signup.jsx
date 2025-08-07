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
  RefreshCw,
  User,
  Mail,
  Phone,
  Lock,
  Hash,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
  clearError,
  clearRegistrationSuccess,
  generateReferenceNumber,
  registerUser,
} from "@/redux/slice/authSlice";

const registerSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    referenceNumber: z.string().min(1, "Reference number is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const Signup = () => {
  const dispatch = useDispatch();
    const navigate = useNavigate()
  const { isLoading, registrationSuccess } = useSelector(
    (state) => state.auth
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      referenceNumber: generateReferenceNumber(),
    },
  });

  useEffect(() => {
    if (registrationSuccess) {
      toast.success("Registration Successful! Your account has been created.");
      reset();
      dispatch(clearRegistrationSuccess());
      navigate("/student/dashboard")

    }
  }, [registrationSuccess, reset, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const onSubmit = async (data) => {
    try {
      const { confirmPassword, ...registrationData } = data;
      await dispatch(registerUser(registrationData)).unwrap();
    } catch (error) {
      toast.error(`Registration Failed: ${error}`);
    }
  };

  const handleGenerateReference = () => {
    const newRefNumber = generateReferenceNumber();
    setValue("referenceNumber", newRefNumber);
    toast.success("A new reference number has been generated.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-10">
      <div className="w-full max-w-md gradient-card shadow-card border-0">
        {/* Logo and Title */}

        <Card className="bg-white dark:bg-gray-800 shadow-xl border-0 overflow-hidden">
          <CardHeader className="text-center">
            <div>
              <CardTitle className="text-2xl font-bold">
                Student Registration
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Create your account to get started
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="firstName"
                    className="text-gray-700 dark:text-gray-300 flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    First Name
                  </Label>
                  <Controller
                    name="firstName"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="John"
                        className="border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-blue-500 focus:ring-blue-500"
                        {...field}
                      />
                    )}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="lastName"
                    className="text-gray-700 dark:text-gray-300 flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    Last Name
                  </Label>
                  <Controller
                    name="lastName"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Doe"
                        className="border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-blue-500 focus:ring-blue-500"
                        {...field}
                      />
                    )}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-gray-700 dark:text-gray-300 flex items-center gap-2"
                >
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
                      className="border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-blue-500 focus:ring-blue-500"
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

              <div className="space-y-2">
                <Label
                  htmlFor="phone"
                  className="text-gray-700 dark:text-gray-300 flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  Phone Number
                </Label>
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1234567890"
                      className="border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-blue-500 focus:ring-blue-500"
                      {...field}
                    />
                  )}
                />
                {errors.phone && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="referenceNumber"
                  className="text-gray-700 dark:text-gray-300 flex items-center gap-2"
                >
                  <Hash className="w-4 h-4" />
                  Reference Number
                </Label>
                <div className="flex gap-2">
                  <Controller
                    name="referenceNumber"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="referenceNumber"
                        type="text"
                        readOnly
                        className="border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-blue-500 focus:ring-blue-500 bg-gray-50 dark:bg-gray-600"
                        {...field}
                      />
                    )}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleGenerateReference}
                    className="border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
                {errors.referenceNumber && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors.referenceNumber.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-gray-700 dark:text-gray-300 flex items-center gap-2"
                >
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
                        className="border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-blue-500 focus:ring-blue-500 pr-10"
                        {...field}
                      />
                    )}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-gray-700 dark:text-gray-300 flex items-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  Confirm Password
                </Label>
                <div className="relative">
                  <Controller
                    name="confirmPassword"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-blue-500 focus:ring-blue-500 pr-10"
                        {...field}
                      />
                    )}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full rounded-lg bg-gradient-to-r from-emerald-600 via-green-700 to-teal-700 text-white font-semibold py-3 shadow-md hover:shadow-lg hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-600 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <div className="text-center text-sm text-gray-600 dark:text-gray-400 pt-2">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-black dark:text-white font-medium transition-colors duration-300"
              >
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
