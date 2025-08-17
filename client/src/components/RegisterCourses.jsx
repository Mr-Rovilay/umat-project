import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  BookOpen,
  Upload,
  FileText,
  CreditCard,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  Loader2,
} from "lucide-react";
// Redux actions
import { getAllPrograms } from "@/redux/slice/programSlice";
import {
  fetchAvailableCourses,
  registerCourses,
} from "@/redux/slice/courseSlice";
import { initializePayment } from "@/redux/slice/paymentSlice";
import { clearError } from "@/redux/slice/authSlice";

const RegisterCourses = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // Redux state
  const { programs, isLoading: programsLoading } = useSelector(
    (state) => state.programs
  );
  const {
    availableCourses,
    isLoading: coursesLoading,
    error,
  } = useSelector((state) => state.courses);
  const { user } = useSelector((state) => state.auth);
  const {
    paymentDetails,
    isLoading: paymentLoading,
    error: paymentError,
  } = useSelector((state) => state.payment);
  // Local state
  const [formData, setFormData] = useState({
    program: "",
    level: "",
    semester: "",
  });
  const [files, setFiles] = useState({
    courseRegistrationSlip: null,
    schoolFeesReceipt: null,
    hallDuesReceipt: null,
  });
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationData, setRegistrationData] = useState(null);
  const [showPaymentScreen, setShowPaymentScreen] = useState(false);

  // Get user's program ID - handle both cases where program might be an object or just an ID
  const userProgramId = user?.program?._id || user?.program;

  // Fetch programs on component mount
  useEffect(() => {
    dispatch(getAllPrograms());
  }, [dispatch]);

  // Set the user's program as default when programs are loaded
  useEffect(() => {
    if (programs.length > 0 && userProgramId && !formData.program) {
      const userProgram = programs.find((p) => p._id === userProgramId);
      if (userProgram) {
        setFormData((prev) => ({
          ...prev,
          program: userProgram._id,
        }));
      }
    }
  }, [programs, userProgramId, formData.program]);

  // Fetch available courses when program, level, or semester changes
  useEffect(() => {
    if (formData.program && formData.level && formData.semester) {
      dispatch(
        fetchAvailableCourses({
          program: formData.program,
          level: formData.level,
          semester: formData.semester,
        })
      );
    }
  }, [formData, dispatch]);

  // Handle errors from Redux
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // Handle payment errors
  useEffect(() => {
    if (paymentError) {
      toast.error(paymentError);
      dispatch(clearError());
    }
  }, [paymentError, dispatch]);

  // Handle payment initialization success
  useEffect(() => {
    if (paymentDetails && paymentDetails.authorization_url) {
      // Redirect to Paystack payment page
      window.location.href = paymentDetails.authorization_url;
    }
  }, [paymentDetails]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files: fileList } = e.target;
    if (fileList && fileList[0]) {
      setFiles((prev) => ({
        ...prev,
        [name]: fileList[0],
      }));
    }
  };

  const validateForm = () => {
    if (!formData.program || !formData.level || !formData.semester) {
      toast.error("Please select program, level, and semester");
      return false;
    }
    if (!files.courseRegistrationSlip) {
      toast.error("Course registration slip is required");
      return false;
    }
    if (
      formData.semester === "First Semester" &&
      (!files.schoolFeesReceipt || !files.hallDuesReceipt)
    ) {
      toast.error(
        "School fees receipt and hall dues receipt are required for first semester"
      );
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      // Prepare data for the Redux thunk
      const registrationData = {
        program: formData.program,
        level: formData.level,
        semester: formData.semester,
        courseRegistrationSlip: files.courseRegistrationSlip,
        schoolFeesReceipt: files.schoolFeesReceipt,
        hallDuesReceipt: files.hallDuesReceipt,
      };
      const result = await dispatch(registerCourses(registrationData));
      if (result.meta.requestStatus === "fulfilled") {
        const response = result.payload;
        if (response.success && response.data) {
          if (response.data.paymentRequired) {
            const registrationId =
              response.data.data?.registrationId ||
              response.data.registrationId ||
              response.data._id;
            if (!registrationId) {
              console.error(
                "Registration ID not found in response:",
                response.data
              );
              toast.error(
                "Registration succeeded but no registration ID was returned"
              );
              return;
            }

            // Get the program object from the response
            const programInfo =
              response.data.data?.registrationInfo?.program ||
              response.data.registration?.program ||
              response.data.program;

            setRegistrationData({
              registrationId: registrationId,
              program: programInfo,
              level:
                response.data.data?.registrationInfo?.level || formData.level,
              semester:
                response.data.data?.registrationInfo?.semester ||
                formData.semester,
              totalUnits: response.data.data?.registrationInfo?.totalUnits || 0,
              paymentDetails: response.data.data?.paymentDetails || {
                amount:
                  response.data.data?.paymentDetails?.amount ||
                  (formData.semester === "First Semester" ? 3 : 3.5),
                type:
                  response.data.data?.paymentDetails?.type ||
                  (formData.semester === "First Semester"
                    ? "departmental_dues"
                    : "school_fees"),
                reference: response.data.data?.paymentDetails?.reference || "",
                description:
                  response.data.data?.paymentDetails?.description ||
                  `${
                    formData.semester === "First Semester"
                      ? "Departmental dues"
                      : "School fees"
                  } for ${formData.semester} - ${formData.level} level`,
              },
              // Store the full registration data
              registration:
                response.data.data?.registration || response.data.registration,
            });
            setShowPaymentScreen(true);
            toast.success(response.message || "Registration successful");
          } else {
            // Get the program object from the response
            const programInfo =
              response.data.registration?.program || response.data.program;

            setRegistrationData({
              registration: response.data.registration,
              program: programInfo,
              level: response.data.registration?.level || formData.level,
              semester:
                response.data.registration?.semester || formData.semester,
            });
            setRegistrationSuccess(true);
            toast.success(response.message || "Registration successful");
          }
        } else {
          toast.error(response.message || "Registration failed");
        }
      } else {
        const errorMessage = result.payload || "Failed to register courses";
        toast.error(errorMessage);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to register courses";
      toast.error(errorMessage);
      console.error("Registration error:", error);
    }
  };

  const handlePayment = async () => {
    if (!registrationData || !registrationData.registrationId) {
      toast.error("Registration information is missing");
      return;
    }
    try {
      const paymentData = {
        registrationId: registrationData.registrationId,
        amount:
          registrationData.paymentDetails?.amount ||
          (registrationData.semester === "First Semester" ? 3 : 3.5),
        paymentType:
          registrationData.paymentDetails?.type ||
          (registrationData.semester === "First Semester"
            ? "departmental_dues"
            : "school_fees"),
      };
      const result = await dispatch(initializePayment(paymentData));
      if (result.meta.requestStatus === "rejected") {
        const errorMessage = result.payload || "Failed to initialize payment";
        toast.error(errorMessage);
        console.error("Payment initialization failed:", errorMessage);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to initialize payment";
      toast.error(errorMessage);
      console.error("Payment initialization error:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      program: userProgramId || "", // Reset to user's program if available
      level: "",
      semester: "",
    });
    setFiles({
      courseRegistrationSlip: null,
      schoolFeesReceipt: null,
      hallDuesReceipt: null,
    });
    setRegistrationSuccess(false);
    setRegistrationData(null);
    setShowPaymentScreen(false);
  };

  if (registrationSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-pad-container mx-auto">
          <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-emerald-200 dark:border-emerald-700 shadow-lg">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/20">
                  <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
                  Registration Successful!
                </h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  You have successfully registered for the semester.
                </p>
                <div className="mt-6 bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-left">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Registration Details
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <p>
                      <span className="font-medium">Program:</span>{" "}
                      {registrationData.registration?.program?.name ||
                        registrationData.program}
                    </p>
                    <p>
                      <span className="font-medium">Level:</span>{" "}
                      {registrationData.registration?.level ||
                        registrationData.level}
                    </p>
                    <p>
                      <span className="font-medium">Semester:</span>{" "}
                      {registrationData.registration?.semester ||
                        registrationData.semester}
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex justify-center space-x-4">
                  <Button
                    onClick={() => navigate("/student/dashboard")}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    Back to Dashboard
                  </Button>
                  <Button variant="outline" onClick={resetForm}>
                    Register for Another Semester
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (showPaymentScreen && registrationData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-emerald-200 dark:border-emerald-700 shadow-lg">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/20">
                  <CreditCard className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
                  Payment Required
                </h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Complete your registration by making the required payment
                </p>
                <div className="mt-6 bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-left">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Payment Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Payment Type:
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {registrationData.paymentDetails?.type ===
                        "departmental_dues"
                          ? "Departmental Dues"
                          : "School Fees"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Amount:
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        GH₵{" "}
                        {(
                          registrationData.paymentDetails?.amount ||
                          (registrationData.semester === "First Semester"
                            ? 3
                            : 3.5)
                        ).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Description:
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {registrationData.paymentDetails?.description ||
                          `${
                            registrationData.semester === "First Semester"
                              ? "Departmental dues"
                              : "School fees"
                          } for ${registrationData.semester} - ${
                            registrationData.level
                          } level`}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-left">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Registration Details
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <p>
                      <span className="font-medium">Program:</span>{" "}
                      {(() => {
                        // Try to get program name from various possible locations
                        if (registrationData.registration?.program?.name) {
                          return registrationData.registration.program.name;
                        } else if (
                          registrationData.data?.registration?.program?.name
                        ) {
                          return registrationData.data.registration.program
                            .name;
                        } else if (registrationData.program?.name) {
                          return registrationData.program.name;
                        }
                        return "N/A";
                      })()}
                    </p>
                    <p>
                      <span className="font-medium">Department:</span>{" "}
                      {(() => {
                        // Try to get user's department from various possible locations
                        let userDept = null;

                        // Try from registration data
                        if (
                          registrationData.registration?.student?.department
                        ) {
                          userDept =
                            registrationData.registration.student.department;
                        } else if (
                          registrationData.data?.registration?.student
                            ?.department
                        ) {
                          userDept =
                            registrationData.data.registration.student
                              .department;
                        } else if (
                          registrationData.data?.registrationInfo?.student
                            ?.department
                        ) {
                          userDept =
                            registrationData.data.registrationInfo.student
                              .department;
                        }

                        if (!userDept) return "N/A";

                        // Handle if department is an array of objects
                        if (Array.isArray(userDept)) {
                          return userDept
                            .map((d) => d.name || d)
                            .filter(Boolean)
                            .join(", ");
                        }

                        // Handle if department is an object
                        if (typeof userDept === "object" && userDept !== null) {
                          return userDept.name || "N/A";
                        }

                        // Handle if department is just a string
                        return userDept;
                      })()}
                    </p>
                    <p>
                      <span className="font-medium">Level:</span>{" "}
                      {registrationData.level}
                    </p>
                    <p>
                      <span className="font-medium">Semester:</span>{" "}
                      {registrationData.semester}
                    </p>
                  </div>
                </div>
                <div className="mt-8 flex justify-center space-x-4">
                  <Button
                    onClick={handlePayment}
                    disabled={paymentLoading}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    {paymentLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Pay Now
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate("/student/dashboard")}
                  >
                    Back to Dashboard
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="max-pad-container bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl shadow-lg mb-6">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
            Semester Registration
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Register for the semester and complete the required payments
          </p>
        </div>
        {/* Back to Dashboard */}
        <Button
          onClick={() => navigate("/student/dashboard")}
          className="mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-emerald-200 dark:border-emerald-700 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">
              Semester Registration Form
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Academic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Academic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="program">Program</Label>
                    <Select
                      value={formData.program}
                      onValueChange={(value) =>
                        handleInputChange({
                          target: { name: "program", value },
                        })
                      }
                      disabled={programsLoading}
                    >
                      <SelectTrigger className="bg-white/50 dark:bg-gray-900/50 border-emerald-200 dark:border-emerald-700">
                        <SelectValue
                          placeholder={
                            programsLoading
                              ? "Loading programs..."
                              : userProgramId
                              ? "Select your program"
                              : "No program assigned"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {userProgramId ? (
                          (programs || [])
                            .filter(
                              (program) =>
                                program && program._id === userProgramId
                            )
                            .map((program) => (
                              <SelectItem key={program._id} value={program._id}>
                                {program.name}
                              </SelectItem>
                            ))
                        ) : (
                          <SelectItem value="no-program" disabled>
                            No program assigned
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="level">Level</Label>
                    <Select
                      value={formData.level}
                      onValueChange={(value) =>
                        handleInputChange({ target: { name: "level", value } })
                      }
                    >
                      <SelectTrigger className="bg-white/50 dark:bg-gray-900/50 border-emerald-200 dark:border-emerald-700">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="100">100 Level</SelectItem>
                        <SelectItem value="200">200 Level</SelectItem>
                        <SelectItem value="300">300 Level</SelectItem>
                        <SelectItem value="400">400 Level</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="semester">Semester</Label>
                    <Select
                      value={formData.semester}
                      onValueChange={(value) =>
                        handleInputChange({
                          target: { name: "semester", value },
                        })
                      }
                    >
                      <SelectTrigger className="bg-white/50 dark:bg-gray-900/50 border-emerald-200 dark:border-emerald-700">
                        <SelectValue placeholder="Select semester" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="First Semester">
                          First Semester
                        </SelectItem>
                        <SelectItem value="Second Semester">
                          Second Semester
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              {/* Document Upload */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Required Documents
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="courseRegistrationSlip">
                      Course Registration Slip *
                    </Label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md">
                      <div className="space-y-1 text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600 dark:text-gray-400">
                          <label
                            htmlFor="courseRegistrationSlip"
                            className="relative cursor-pointer bg-white dark:bg-gray-900 rounded-md font-medium text-emerald-600 hover:text-emerald-500 focus-within:outline-none"
                          >
                            <span>Upload a file</span>
                            <Input
                              id="courseRegistrationSlip"
                              name="courseRegistrationSlip"
                              type="file"
                              className="sr-only"
                              onChange={handleFileChange}
                              accept="image/*,.pdf"
                            />
                          </label>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          PNG, JPG, PDF up to 10MB
                        </p>
                        {files.courseRegistrationSlip && (
                          <p className="text-xs text-emerald-600 dark:text-emerald-400">
                            {files.courseRegistrationSlip.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="schoolFeesReceipt">
                      School Fees Receipt{" "}
                      {formData.semester === "First Semester"
                        ? "*"
                        : "(Optional)"}
                    </Label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md">
                      <div className="space-y-1 text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600 dark:text-gray-400">
                          <label
                            htmlFor="schoolFeesReceipt"
                            className="relative cursor-pointer bg-white dark:bg-gray-900 rounded-md font-medium text-emerald-600 hover:text-emerald-500 focus-within:outline-none"
                          >
                            <span>Upload a file</span>
                            <Input
                              id="schoolFeesReceipt"
                              name="schoolFeesReceipt"
                              type="file"
                              className="sr-only"
                              onChange={handleFileChange}
                              accept="image/*,.pdf"
                            />
                          </label>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          PNG, JPG, PDF up to 10MB
                        </p>
                        {files.schoolFeesReceipt && (
                          <p className="text-xs text-emerald-600 dark:text-emerald-400">
                            {files.schoolFeesReceipt.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  {formData.semester === "First Semester" && (
                    <div>
                      <Label htmlFor="hallDuesReceipt">
                        Hall Dues Receipt *
                      </Label>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md">
                        <div className="space-y-1 text-center">
                          <Upload className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="flex text-sm text-gray-600 dark:text-gray-400">
                            <label
                              htmlFor="hallDuesReceipt"
                              className="relative cursor-pointer bg-white dark:bg-gray-900 rounded-md font-medium text-emerald-600 hover:text-emerald-500 focus-within:outline-none"
                            >
                              <span>Upload a file</span>
                              <Input
                                id="hallDuesReceipt"
                                name="hallDuesReceipt"
                                type="file"
                                className="sr-only"
                                onChange={handleFileChange}
                                accept="image/*,.pdf"
                              />
                            </label>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            PNG, JPG, PDF up to 10MB
                          </p>
                          {files.hallDuesReceipt && (
                            <p className="text-xs text-emerald-600 dark:text-emerald-400">
                              {files.hallDuesReceipt.name}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/* Semester Requirements Notice */}
              <Alert className="border-blue-200 bg-blue-50/50 dark:bg-blue-900/20 dark:border-blue-800">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800 dark:text-blue-200">
                  {formData.semester === "First Semester"
                    ? "First semester requires course registration slip, school fees receipt, and hall dues receipt. Departmental dues payment will be required after registration."
                    : "Second semester requires only course registration slip. School fees receipt is optional if you have already paid."}
                </AlertDescription>
              </Alert>
              {/* Submit Button */}
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={
                    coursesLoading ||
                    !formData.program ||
                    !formData.level ||
                    !formData.semester
                  }
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  {coursesLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FileText className="mr-2 h-4 w-4" />
                      Register for Semester
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default RegisterCourses;
