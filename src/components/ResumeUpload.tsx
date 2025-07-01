
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, FileText, Loader2 } from "lucide-react";
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* File Upload Area */}
      <div className="space-y-4">
        <Label htmlFor="resume">Resume (PDF only)</Label>
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragOver
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          {file ? (
            <div className="flex items-center justify-center space-x-2">
              <FileText className="h-8 w-8 text-green-600" />
              <div>
                <p className="font-medium text-green-700">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
          ) : (
            <div>
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-700 mb-2">
                Drop your resume here, or click to browse
              </p>
              <p className="text-sm text-gray-500">PDF files only, max 10MB</p>
            </div>
          )}
          <Input
            id="resume"
            type="file"
            accept=".pdf"
            onChange={(e) => {
              const files = e.target.files;
              if (files && files.length > 0) {
                handleFileSelect(files[0]);
              }
            }}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            className="mt-4"
            onClick={() => document.getElementById("resume")?.click()}
          >
            Choose File
          </Button>
        </div>
      </div>

      {/* Job Role Selection */}
      <div className="space-y-2">
        <Label htmlFor="jobRole">Target Job Role *</Label>
        <Select value={jobRole} onValueChange={setJobRole}>
          <SelectTrigger>
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

      {/* Experience Level */}
      <div className="space-y-2">
        <Label htmlFor="experienceLevel">Experience Level</Label>
        <Select value={experienceLevel} onValueChange={setExperienceLevel}>
          <SelectTrigger>
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

      {/* Email (Optional) */}
      <div className="space-y-2">
        <Label htmlFor="email">Email (Optional)</Label>
        <Input
          id="email"
          type="email"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
          placeholder="your.email@example.com"
        />
        <p className="text-sm text-gray-500">
          Provide your email to receive analysis results and for better tracking.
        </p>
      </div>

      <Button 
        type="submit" 
        className="w-full" 
        disabled={loading || !file || !jobRole}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyzing Resume...
          </>
        ) : (
          <>
            <FileText className="mr-2 h-4 w-4" />
            Analyze Resume
          </>
        )}
      </Button>
    </form>
  );
};
