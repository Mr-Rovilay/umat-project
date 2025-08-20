import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Hash,
  Calendar,
  Loader2,
  AlertCircle,
  GraduationCap,
  Clock,
  DollarSign,
  FileText,
  Edit,
  Upload,
} from "lucide-react";
import { clearError, fetchMyCourses, checkGracePeriod, updateRegistrationDocuments } from "@/redux/slice/courseSlice";
import PDFViewer from "../PDFViewer";
import EditRegistrationModal from "../EditRegistrationModal";

function MyCourses() {
  const dispatch = useDispatch();
  const { myCourses, isLoading, error, owingStatus } = useSelector(
    (state) => state.courses
  );
  const { user } = useSelector((state) => state.auth);
  
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    dispatch(fetchMyCourses());
  }, [dispatch]);

  const handleRetry = () => {
    dispatch(fetchMyCourses());
  };

  const handleEditClick = (registration) => {
    setSelectedRegistration(registration);
    // Check grace period before showing edit modal
    dispatch(checkGracePeriod(registration._id))
      .unwrap()
      .then((result) => {
        if (result.isWithinGracePeriod) {
          setShowEditModal(true);
        } else {
          toast.error("Grace period has expired. You can no longer edit this registration.");
        }
      })
      .catch(() => {
        toast.error("Failed to check grace period status");
      });
  };

  const handleUpdateDocuments = async (formData) => {
    try {
      await dispatch(updateRegistrationDocuments({
        registrationId: selectedRegistration._id,
        formData
      })).unwrap();
      
      toast.success("Registration documents updated successfully");
      setShowEditModal(false);
      setSelectedRegistration(null);
      
      // Refresh the courses list
      dispatch(fetchMyCourses());
    } catch (error) {
      toast.error(error || "Failed to update registration documents");
    }
  };

  // Function to get documents based on semester
  const getDocumentsForSemester = (registration) => {
    if (Array.isArray(registration.documents) && registration.documents.length > 0) {
      // If documents array exists, filter based on semester
      if (registration.semester === "Second Semester") {
        return registration.documents.filter(doc => 
          doc.type === "CourseRegistrationSlip" || doc.type === "SchoolFeesReceipt"
        );
      }
      return registration.documents;
    } else if (registration.uploads) {
      // If using uploads object, create array based on semester
      const documents = [
        {
          type: "CourseRegistrationSlip",
          ...registration.uploads.courseRegistrationSlip,
        },
        {
          type: "SchoolFeesReceipt",
          ...registration.uploads.schoolFeesReceipt,
        }
      ];
      
      // Only add hall dues receipt for first semester
      if (registration.semester === "First Semester") {
        documents.push({
          type: "HallDuesReceipt",
          ...registration.uploads.hallDuesReceipt,
        });
      }
      
      return documents;
    }
    
    return [];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-700 dark:text-gray-300">
            Loading your slips...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-pad-container mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl shadow-lg mb-6">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
            My Registration Slips
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            View your register slips and payment status for the current semester
          </p>
        </div>

        {/* Owing Status and Register Button */}
        <div className="mb-8">
          <Card className="border-emerald-200 dark:border-emerald-800 shadow-lg">
            <CardContent className="flex flex-col md:flex-row items-center justify-between py-6">
              <div className="flex items-center gap-3">
                <DollarSign className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  Owing Status:{" "}
                  {user.owingStatus === undefined || owingStatus ? (
                    <span className="text-red-600 dark:text-red-400">
                      Pending Payment
                    </span>
                  ) : (
                    <span className="text-green-600 dark:text-green-400">
                      Cleared
                    </span>
                  )}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert
            variant="destructive"
            className="mb-6 border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800"
          >
            <AlertDescription className="text-red-800 dark:text-red-200 flex items-center justify-between">
              <span>{error}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRetry}
                className="border-red-300 text-red-700 hover:bg-red-100 dark:border-red-700 dark:text-red-200 dark:hover:bg-red-900/30"
              >
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* No Slips Message */}
        {!isLoading && !error && myCourses.length === 0 && (
          <Card className="border-emerald-200 dark:border-emerald-800 shadow-lg mb-8">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 p-4 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                <Upload className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No Registration Slips Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
                You haven't uploaded any registration slips yet. Upload your course registration slip and payment receipts to get started.
              </p>
              <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                <Link to="/dashboard/register">
                  Register Now
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="space-y-6">
          {myCourses.map((registration) => {
            // Calculate if within grace period (7 days from creation)
            const now = new Date();
            const gracePeriodEnd = new Date(registration.createdAt);
            gracePeriodEnd.setDate(gracePeriodEnd.getDate() + 7);
            const isWithinGracePeriod = now <= gracePeriodEnd;
            const daysRemaining = isWithinGracePeriod 
              ? Math.ceil((gracePeriodEnd - now) / (1000 * 60 * 60 * 24))
              : 0;
            
            // Get documents based on semester
            const documents = getDocumentsForSemester(registration);
            
            return (
              <Card
                key={registration._id}
                className="border-emerald-200 dark:border-emerald-800 shadow-lg overflow-hidden"
              >
                <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 pb-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <CardTitle className="text-xl flex items-center text-emerald-800 dark:text-emerald-200">
                      <BookOpen className="mr-2 h-5 w-5" />
                      {registration.program?.name || "Unknown Program"} (
                      {registration.program?.degree || "N/A"})
                    </CardTitle>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1 border-emerald-200 text-emerald-700 dark:border-emerald-700 dark:text-emerald-300"
                      >
                        <Hash className="h-3 w-3" />
                        Level {registration.level || "N/A"}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1 border-emerald-200 text-emerald-700 dark:border-emerald-700 dark:text-emerald-300"
                      >
                        <Calendar className="h-3 w-3" />
                        {registration.semester || "N/A"}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1 border-emerald-200 text-emerald-700 dark:border-emerald-700 dark:text-emerald-300"
                      >
                        <Clock className="h-3 w-3" />
                        Registered{" "}
                        {registration.createdAt
                          ? format(
                              parseISO(registration.createdAt),
                              "MMM d, yyyy"
                            )
                          : "N/A"}
                      </Badge>
                      {isWithinGracePeriod && (
                        <Badge
                          variant="outline"
                          className="flex items-center gap-1 border-amber-200 text-amber-700 dark:border-amber-700 dark:text-amber-300"
                        >
                          <AlertCircle className="h-3 w-3" />
                          {daysRemaining} days left to edit
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  {/* Documents Status */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                        Document Status
                      </h4>
                      {isWithinGracePeriod && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditClick(registration)}
                          className="flex items-center gap-1 text-xs"
                        >
                          <Edit className="h-3 w-3" />
                          Edit Documents
                        </Button>
                      )}
                    </div>
                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {documents.length > 0 ? (
                        documents.map((doc, index) => (
                          <div
                            key={doc._id || index}
                            className="flex items-center gap-2 text-sm"
                          >
                            <FileText className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                            <span className="text-gray-600 dark:text-gray-400">
                              {doc.type}
                            </span>
                            <Badge
                              variant={doc.verified ? "success" : "warning"}
                              className={
                                doc.verified
                                  ? "bg-green-600 text-white"
                                  : "bg-yellow-600 text-white"
                              }
                            >
                              {doc.verified ? "Verified" : "Pending"}
                            </Badge>
                            {doc.url && (
                              <PDFViewer
                                url={doc.url}
                                title={`${doc.type} - ${registration.program?.name}`}
                              >
                                <Button
                                  variant="link"
                                  className="p-0 h-auto text-blue-600 hover:underline dark:text-blue-400"
                                >
                                  View
                                </Button>
                              </PDFViewer>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          No documents uploaded
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Edit Registration Modal */}
        {showEditModal && selectedRegistration && (
          <EditRegistrationModal
            registration={selectedRegistration}
            isOpen={showEditModal}
            onClose={() => {
              setShowEditModal(false);
              setSelectedRegistration(null);
            }}
            onSubmit={handleUpdateDocuments}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
}

export default MyCourses;