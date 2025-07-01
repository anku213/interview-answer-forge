
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useResumeAnalyzer } from "@/hooks/useResumeAnalyzer";

const jobRoles = [
  "Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Data Scientist",
  "Product Manager",
  "UI/UX Designer",
  "DevOps Engineer",
  "Mobile Developer",
  "Machine Learning Engineer",
  "Business Analyst",
  "Project Manager",
  "Marketing Manager",
  "Sales Representative",
  "Financial Analyst",
  "Other"
];

const experienceLevels = [
  "Entry Level (0-2 years)",
  "Mid Level (3-5 years)",
  "Senior Level (6-10 years)",
  "Expert Level (10+ years)"
];

export const ResumeUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [jobRole, setJobRole] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const { analyzeResume, loading } = useResumeAnalyzer();
  const { toast } = useToast();

  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile.type !== "application/pdf") {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file.",
        variant: "destructive"
      });
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB.",
        variant: "destructive"
      });
      return;
    }

    setFile(selectedFile);
    // Simulate upload progress
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file || !jobRole) {
      toast({
        title: "Missing information",
        description: "Please upload a resume and select a job role.",
        variant: "destructive"
      });
      return;
    }

    try {
      await analyzeResume({
        file,
        jobRole,
        experienceLevel,
        userEmail: userEmail.trim() || undefined
      });
      
      // Reset form
      setFile(null);
      setJobRole("");
      setExperienceLevel("");
      setUserEmail("");
      setUploadProgress(0);
      
      toast({
        title: "Analysis started",
        description: "Your resume is being analyzed. This may take a few moments.",
      });
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis failed",
        description: "Failed to start resume analysis. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Step 1: File Upload */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium">
            1
          </div>
          <Label className="text-lg font-semibold text-gray-900">Upload Your Resume</Label>
        </div>
        
        <Card
          className={`border-2 border-dashed transition-all duration-200 ${
            dragOver
              ? "border-blue-500 bg-blue-50 scale-105"
              : file 
              ? "border-green-500 bg-green-50"
              : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <CardContent className="p-8 text-center">
            {file ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <CheckCircle2 className="h-12 w-12 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-green-700 text-lg">{file.name}</p>
                  <p className="text-sm text-gray-600">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                {uploadProgress < 100 && (
                  <div className="space-y-2 max-w-xs mx-auto">
                    <Progress value={uploadProgress} className="h-2" />
                    <p className="text-xs text-gray-500">Uploading... {uploadProgress}%</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <div className="p-4 bg-blue-100 rounded-full">
                    <Upload className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <div>
                  <p className="text-xl font-semibold text-gray-700 mb-2">
                    Drop your resume here, or click to browse
                  </p>
                  <p className="text-gray-500">PDF files only, max 10MB</p>
                </div>
              </div>
            )}
            <Input
              type="file"
              accept=".pdf"
              onChange={(e) => {
                const files = e.target.files;
                if (files && files.length > 0) {
                  handleFileSelect(files[0]);
                }
              }}
              className="hidden"
              id="resume-upload"
            />
            <Button
              type="button"
              variant="outline"
              className="mt-6"
              onClick={() => document.getElementById("resume-upload")?.click()}
            >
              Choose File
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Step 2: Job Role Selection */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium">
            2
          </div>
          <Label className="text-lg font-semibold text-gray-900">Select Target Job Role</Label>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="jobRole" className="text-sm font-medium">Job Role *</Label>
            <Select value={jobRole} onValueChange={setJobRole}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Select the job role you're applying for" />
              </SelectTrigger>
              <SelectContent>
                {jobRoles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label htmlFor="experienceLevel" className="text-sm font-medium">Experience Level</Label>
            <Select value={experienceLevel} onValueChange={setExperienceLevel}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Select your experience level (optional)" />
              </SelectTrigger>
              <SelectContent>
                {experienceLevels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-3">
          <Label htmlFor="email" className="text-sm font-medium">Email (Optional)</Label>
          <Input
            id="email"
            type="email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            placeholder="your.email@example.com"
            className="h-12"
          />
          <p className="text-sm text-gray-500">
            Provide your email to receive analysis results and for better tracking.
          </p>
        </div>
      </div>

      {/* Step 3: Analyze Button */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium">
            3
          </div>
          <Label className="text-lg font-semibold text-gray-900">Get Your Analysis</Label>
        </div>

        <div className="text-center">
          <Button 
            type="submit" 
            className="w-full md:w-auto px-12 py-6 text-lg font-semibold" 
            disabled={loading || !file || !jobRole}
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                Analyzing Resume...
              </>
            ) : (
              <>
                <FileText className="mr-3 h-5 w-5" />
                Analyze My Resume
              </>
            )}
          </Button>
          
          {loading && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-center gap-2 text-blue-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">AI is analyzing your resume...</span>
              </div>
              <p className="text-xs text-gray-500">This usually takes 30-60 seconds</p>
            </div>
          )}
        </div>
      </div>
    </form>
  );
};
