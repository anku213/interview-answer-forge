
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResumeUpload } from "@/components/ResumeUpload";
import { ResumeAnalysesList } from "@/components/ResumeAnalysesList";
import { FileText, Upload, History, CheckCircle2 } from "lucide-react";

const ResumeAnalyzer = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-600/10 p-3 rounded-2xl">
              <FileText className="h-10 w-10 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Resume Analyzer</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Get AI-powered insights on your resume with detailed feedback on formatting, keywords, structure, and personalized improvement suggestions.
          </p>
        </div>

        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 max-w-md mx-auto">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Analyze Resume
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Analysis History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload">
            <div className="max-w-4xl mx-auto">
              <Card className="shadow-lg border-0">
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-2xl text-gray-900">Upload & Analyze Your Resume</CardTitle>
                  <CardDescription className="text-gray-600 text-base">
                    Follow the steps below to get comprehensive feedback on your resume
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  {/* Step indicators */}
                  <div className="flex items-center justify-center mb-8">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium">
                          1
                        </div>
                        <span className="ml-2 text-sm font-medium text-gray-700">Upload Resume</span>
                      </div>
                      <div className="w-8 h-px bg-gray-300"></div>
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium">
                          2
                        </div>
                        <span className="ml-2 text-sm font-medium text-gray-700">Select Job Role</span>
                      </div>
                      <div className="w-8 h-px bg-gray-300"></div>
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium">
                          3
                        </div>
                        <span className="ml-2 text-sm font-medium text-gray-700">Get Analysis</span>
                      </div>
                    </div>
                  </div>

                  <ResumeUpload />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <div className="max-w-6xl mx-auto">
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl text-gray-900">
                    <History className="h-6 w-6" />
                    Your Analysis History
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-base">
                    View and manage your previous resume analyses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResumeAnalysesList />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ResumeAnalyzer;
