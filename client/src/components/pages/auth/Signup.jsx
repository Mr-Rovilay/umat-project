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
import { Link, useNavigate } from "react-router-dom";
import {
  clearError as clearAuthError,
  clearRegistrationSuccess,
  // generateReferenceNumber,
  registerUser,
} from "@/redux/slice/authSlice";
import { getAllDepartments, clearError as clearDepartmentError } from "@/redux/slice/departmentSlice";
import { getAllPrograms, clearError as clearProgramError } from "@/redux/slice/programSlice";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Zod schema for form validation
const registerSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    referenceNumber: z.string().min(1, "Reference number is required"),
    department: z.string().min(1, "Department is required"),
    program: z.string().min(1, "Program is required"),
    level: z.string().min(1, "Level is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading: authLoading, registrationSuccess, error: authError } = useSelector((state) => state.auth);
  const { departments, isLoading: deptLoading, error: deptError } = useSelector((state) => state.departments);
  const { programs, isLoading: progLoading, error: progError } = useSelector((state) => state.programs);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState("");

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      // referenceNumber: generateReferenceNumber(),
      referenceNumber: "",
      department: "",
      program: "",
      level: "",
    },
  });

  // Fetch departments on mount
  useEffect(() => {
    dispatch(getAllDepartments());
  }, [dispatch]);

  // Fetch programs when department changes
  useEffect(() => {
    if (selectedDepartment) {
      dispatch(getAllPrograms(selectedDepartment));
      setValue("program", ""); // Reset program when department changes
    }
  }, [selectedDepartment, dispatch, setValue]);

  // Handle successful registration
  useEffect(() => {
    if (registrationSuccess) {
      toast.success("Registration Successful! Your account has been created.");
      navigate("/student/dashboard");
      reset();
      dispatch(clearRegistrationSuccess());
    }
  }, [registrationSuccess, navigate, reset, dispatch]);

  // Clear errors on unmount
  useEffect(() => {
    return () => {
      dispatch(clearAuthError());
      dispatch(clearDepartmentError());
      dispatch(clearProgramError());
    };
  }, [dispatch]);

  // Form submission
  const onSubmit = async (data) => {
    try {
      const registrationData = { ...data };
      registrationData.owingStatus = true; // Set default owing status
      await dispatch(registerUser(registrationData)).unwrap();
      window.location.reload(); // Reload to reflect changes
    } catch (err) {
      toast.error(`Registration Failed: ${err}`);
    }
  };

  // Generate new reference number
  // const handleGenerateReference = () => {
  //   const newRefNumber = generateReferenceNumber();
  //   setValue("referenceNumber", newRefNumber);
  //   toast.success("New reference number generated");
  // };

  return (
    <div className="max-pad-container flex items-center justify-center pt-10 dark:bg-gray-900">
      <Card className="w-full max-w-md bg-white dark:bg-gray-800 shadow-xl border-0">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Student Registration</CardTitle>
          <CardDescription className="text-muted-foreground">
            Create your account to get started
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* First Name and Last Name */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="flex items-center gap-2">
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
                      className="border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
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
                <Label htmlFor="lastName" className="flex items-center gap-2">
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
                      className="border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
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

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
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
                    className="border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
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

            {/* Department */}
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Controller
                name="department"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded"
                    onChange={(e) => {
                      field.onChange(e);
                      setSelectedDepartment(e.target.value);
                    }}
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept._id} value={dept._id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                )}
              />
              {errors.department && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {errors.department.message}
                </p>
              )}
              {deptLoading && <p className="text-sm text-gray-500">Loading departments...</p>}
              {deptError && (
                <p className="text-sm text-red-600 dark:text-red-400">{deptError}</p>
              )}
            </div>

            {/* Program */}
            <div className="space-y-2">
              <Label htmlFor="program">Program</Label>
              <Controller
                name="program"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded"
                    disabled={!selectedDepartment || progLoading}
                  >
                    <option value="">Select Program</option>
                    {programs.map((prog) => (
                      <option key={prog._id} value={prog._id}>
                        {prog.name}
                      </option>
                    ))}
                  </select>
                )}
              />
              {errors.program && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {errors.program.message}
                </p>
              )}
              {progLoading && <p className="text-sm text-gray-500">Loading programs...</p>}
              {progError && (
                <p className="text-sm text-red-600 dark:text-red-400">{progError}</p>
              )}
            </div>

            {/* Level */}
            <div className="space-y-2">
              <Label htmlFor="level">Level</Label>
              <Controller
                name="level"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded"
                  >
                    <option value="">Select Level</option>
                    {["100", "200", "300", "400"].map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                )}
              />
              {errors.level && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {errors.level.message}
                </p>
              )}
            </div>

            {/* Reference Number */}
            <div className="space-y-2">
              <Label htmlFor="referenceNumber" className="flex items-center gap-2">
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
                     placeholder="REF-NUMBER"
                      className="border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white bg-gray-50 dark:bg-gray-600"
                      {...field}
                    />
                  )}
                />
                {/* <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleGenerateReference}
                >
                  <RefreshCw className="w-4 h-4" />
                </Button> */}
              </div>
              {errors.referenceNumber && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {errors.referenceNumber.message}
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

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="flex items-center gap-2">
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
                      className="border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white pr-10"
                      {...field}
                    />
                  )}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-semibold py-3 hover:brightness-110 disabled:opacity-60"
              disabled={authLoading || deptLoading || progLoading}
            >
              {authLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          {/* Error Display */}
          {(authError || deptError || progError) && (
            <div className="mt-4">
              <Alert variant="destructive">
                <AlertDescription>{authError || deptError || progError}</AlertDescription>
              </Alert>
            </div>
          )}

          {/* Sign-in Link */}
          <div className="text-center text-sm text-gray-600 dark:text-gray-400 pt-2">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;