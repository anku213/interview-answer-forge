
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResumeUpload } from "@/components/ResumeUpload";
import { ResumeAnalysesList } from "@/components/ResumeAnalysesList";
import { FileText, Upload, History, TrendingUp, Star, CheckCircle } from "lucide-react";

const ResumeAnalyzer = () => {
  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-2xl shadow-lg">
            <FileText className="h-8 w-8 text-white" />
          </div>
        </div>
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Resume Analyzer
          </h1>
          <p className="text-xl text-muted-foreground mt-2 max-w-2xl mx-auto">
            Get AI-powered insights on your resume with detailed feedback and personalized improvement suggestions
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-500 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-700">AI Analysis</p>
                <p className="text-blue-600">Smart feedback system</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-green-500 p-3 rounded-lg">
                <Star className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-700">Score Rating</p>
                <p className="text-green-600">Detailed scoring metrics</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-purple-500 p-3 rounded-lg">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-700">Improvements</p>
                <p className="text-purple-600">Actionable suggestions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto h-12">
          <TabsTrigger value="upload" className="flex items-center gap-2 text-base">
            <Upload className="h-5 w-5" />
            Analyze Resume
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2 text-base">
            <History className="h-5 w-5" />
            Analysis History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-8">
          <Card className="shadow-lg">
            <CardHeader className="text-center space-y-2">
              <CardTitle className="text-2xl flex items-center justify-center gap-3">
                <Upload className="h-6 w-6 text-blue-600" />
                Upload & Analyze Your Resume
              </CardTitle>
              <CardDescription className="text-base">
                Follow the simple steps below to get comprehensive AI-powered feedback on your resume
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <ResumeUpload />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <History className="h-6 w-6 text-blue-600" />
                Your Analysis History
              </CardTitle>
              <CardDescription className="text-base">
                View and manage your previous resume analyses with detailed insights
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <ResumeAnalysesList />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResumeAnalyzer;
