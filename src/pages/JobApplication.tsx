
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Settings, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";

const JobApplication = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    companyEmail: "",
    emailSubject: "",
    coverLetter: "",
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check if SMTP credentials are configured
  const smtpEmail = localStorage.getItem("smtpEmail");
  const smtpPassword = localStorage.getItem("smtpPassword");
  const isSmtpConfigured = smtpEmail && smtpPassword;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        toast({
          title: "Invalid File Type",
          description: "Please upload a PDF file only.",
          variant: "destructive"
        });
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File Too Large",
          description: "Please upload a file under 5MB.",
          variant: "destructive"
        });
        return;
      }
      setResumeFile(file);
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data:application/pdf;base64, prefix
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter your full name.",
        variant: "destructive"
      });
      return false;
    }
    if (!formData.email.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter your email address.",
        variant: "destructive"
      });
      return false;
    }
    if (!formData.companyEmail.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter the company email address.",
        variant: "destructive"
      });
      return false;
    }
    if (!formData.emailSubject.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter an email subject.",
        variant: "destructive"
      });
      return false;
    }
    if (!formData.coverLetter.trim()) {
      toast({
        title: "Validation Error",
        description: "Please write a cover letter.",
        variant: "destructive"
      });
      return false;
    }
    if (!resumeFile) {
      toast({
        title: "Validation Error",
        description: "Please upload your resume.",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isSmtpConfigured) {
      toast({
        title: "SMTP Not Configured",
        description: "Please configure your SMTP settings first.",
        variant: "destructive"
      });
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const resumeBase64 = await convertFileToBase64(resumeFile!);
      
      const payload = {
        name: formData.fullName,
        email: formData.email,
        companyEmail: formData.companyEmail,
        emailSubject: formData.emailSubject,
        coverLetter: formData.coverLetter,
        resumeBase64,
        resumeFileName: resumeFile!.name,
        smtpEmail,
        smtpPassword
      };

      const response = await fetch("https://email-sender-7c1r.onrender.com/api/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast({
          title: "Application Submitted",
          description: "Your job application has been sent successfully!",
        });
        
        // Reset form
        setFormData({
          fullName: "",
          email: "",
          companyEmail: "",
          emailSubject: "",
          coverLetter: "",
        });
        setResumeFile(null);
        
        // Reset file input
        const fileInput = document.getElementById("resume-upload") as HTMLInputElement;
        if (fileInput) {
          fileInput.value = "";
        }
      } else {
        const errorData = await response.json();
        toast({
          title: "Submission Failed",
          description: errorData.message || "Failed to send your application. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      toast({
        title: "Network Error",
        description: "Failed to send your application. Please check your connection and try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Job Application Portal
          </h1>
          <p className="text-gray-600 mt-2">Submit your application with all required details</p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate("/settings")}
          className="flex items-center gap-2"
        >
          <Settings className="h-4 w-4" />
          SMTP Settings
        </Button>
      </div>

      {!isSmtpConfigured && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <span className="text-amber-800">
            Please configure SMTP settings first to enable email sending
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="fullName">
                Full Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">
                Your Email Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email address"
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>Company Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="companyEmail">
                Company Email Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="companyEmail"
                name="companyEmail"
                type="email"
                value={formData.companyEmail}
                onChange={handleInputChange}
                placeholder="Enter company email (where to send application)"
                required
              />
              <p className="text-sm text-gray-500 mt-1">This email will receive your job application</p>
            </div>
            <div>
              <Label htmlFor="emailSubject">
                Email Subject <span className="text-red-500">*</span>
              </Label>
              <Input
                id="emailSubject"
                name="emailSubject"
                value={formData.emailSubject}
                onChange={handleInputChange}
                placeholder="e.g., Application for Software Developer Position"
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Application Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="coverLetter">
                Cover Letter <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="coverLetter"
                name="coverLetter"
                value={formData.coverLetter}
                onChange={handleInputChange}
                placeholder="Write your cover letter here..."
                rows={8}
                required
              />
            </div>
            <div>
              <Label htmlFor="resume-upload">
                Upload Resume <span className="text-red-500">*</span>
              </Label>
              <div className="flex items-center gap-4">
                <Input
                  id="resume-upload"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
                <Upload className="h-4 w-4 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500 mt-1">PDF only, maximum 5MB file size</p>
              {resumeFile && (
                <p className="text-sm text-green-600 mt-1">
                  Selected: {resumeFile.name}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Button
          type="submit"
          disabled={!isSmtpConfigured || isSubmitting}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3"
        >
          {isSubmitting ? "Submitting Application..." : "Submit Application"}
        </Button>
      </form>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Application Guidelines:
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">Fill out all required fields completely</span>
            </div>
            <div className="flex items-center gap-2 text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">Write a compelling cover letter</span>
            </div>
            <div className="flex items-center gap-2 text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">Resume must be PDF format, under 5MB</span>
            </div>
            <div className="flex items-center gap-2 text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">Provide clear email subject line</span>
            </div>
            <div className="flex items-center gap-2 text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">Use professional email addresses</span>
            </div>
            <div className="flex items-center gap-2 text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">Configure SMTP settings first</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobApplication;
