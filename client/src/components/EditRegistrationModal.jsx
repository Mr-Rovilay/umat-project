// components/EditRegistrationModal.jsx
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, FileText, AlertCircle, Loader2 } from "lucide-react";

const EditRegistrationModal = ({ 
  registration, 
  isOpen, 
  onClose, 
  onSubmit, 
  isLoading 
}) => {
  const [files, setFiles] = useState({
    courseRegistrationSlip: null,
    schoolFeesReceipt: null,
    hallDuesReceipt: null,
  });
  const [previewUrls, setPreviewUrls] = useState({
    courseRegistrationSlip: null,
    schoolFeesReceipt: null,
    hallDuesReceipt: null,
  });

  // Initialize with current document URLs
  useEffect(() => {
    if (registration && registration.uploads) {
      setPreviewUrls({
        courseRegistrationSlip: registration.uploads.courseRegistrationSlip?.url || null,
        schoolFeesReceipt: registration.uploads.schoolFeesReceipt?.url || null,
        hallDuesReceipt: registration.uploads.hallDuesReceipt?.url || null,
      });
    }
  }, [registration]);

  const handleFileChange = (e) => {
    const { name, files: fileList } = e.target;
    if (fileList && fileList[0]) {
      const file = fileList[0];
      setFiles((prev) => ({
        ...prev,
        [name]: file,
      }));
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrls((prev) => ({
          ...prev,
          [name]: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    
    // Only append files that have been changed
    if (files.courseRegistrationSlip) {
      formData.append('courseRegistrationSlip', files.courseRegistrationSlip);
    }
    
    if (files.schoolFeesReceipt) {
      formData.append('schoolFeesReceipt', files.schoolFeesReceipt);
    }
    
    if (files.hallDuesReceipt) {
      formData.append('hallDuesReceipt', files.hallDuesReceipt);
    }
    
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Registration Documents</DialogTitle>
          <DialogDescription>
            Update your registration documents. Only upload files that need to be changed.
          </DialogDescription>
        </DialogHeader>
        
        <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800 dark:text-amber-200">
            You can only edit your registration within 7 days of the original registration.
          </AlertDescription>
        </Alert>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="courseRegistrationSlip">Course Registration Slip</Label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md">
                <div className="space-y-1 text-center">
                  {previewUrls.courseRegistrationSlip ? (
                    <div className="flex flex-col items-center">
                      <FileText className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Current file uploaded
                      </p>
                      <label
                        htmlFor="courseRegistrationSlip"
                        className="relative cursor-pointer bg-white dark:bg-gray-900 rounded-md font-medium text-emerald-600 hover:text-emerald-500 focus-within:outline-none mt-2"
                      >
                        <span>Replace File</span>
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
                  ) : (
                    <>
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
                    </>
                  )}
                  {files.courseRegistrationSlip && (
                    <p className="text-xs text-emerald-600 dark:text-emerald-400">
                      {files.courseRegistrationSlip.name}
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            <div>
              <Label htmlFor="schoolFeesReceipt">School Fees Receipt</Label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md">
                <div className="space-y-1 text-center">
                  {previewUrls.schoolFeesReceipt ? (
                    <div className="flex flex-col items-center">
                      <FileText className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Current file uploaded
                      </p>
                      <label
                        htmlFor="schoolFeesReceipt"
                        className="relative cursor-pointer bg-white dark:bg-gray-900 rounded-md font-medium text-emerald-600 hover:text-emerald-500 focus-within:outline-none mt-2"
                      >
                        <span>Replace File</span>
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
                  ) : (
                    <>
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
                    </>
                  )}
                  {files.schoolFeesReceipt && (
                    <p className="text-xs text-emerald-600 dark:text-emerald-400">
                      {files.schoolFeesReceipt.name}
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            {registration.semester === "First Semester" && (
              <div>
                <Label htmlFor="hallDuesReceipt">Hall Dues Receipt</Label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md">
                  <div className="space-y-1 text-center">
                    {previewUrls.hallDuesReceipt ? (
                      <div className="flex flex-col items-center">
                        <FileText className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Current file uploaded
                        </p>
                        <label
                          htmlFor="hallDuesReceipt"
                          className="relative cursor-pointer bg-white dark:bg-gray-900 rounded-md font-medium text-emerald-600 hover:text-emerald-500 focus-within:outline-none mt-2"
                        >
                          <span>Replace File</span>
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
                    ) : (
                      <>
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
                      </>
                    )}
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
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Documents"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditRegistrationModal;