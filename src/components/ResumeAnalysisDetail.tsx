
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileText, Download, CheckCircle2, AlertTriangle, XCircle, Star, Lightbulb, TrendingUp, Target, Layout, Mail, MailCheck } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface StructuredFeedback {
  feedback?: {
    formatting_and_design?: string[];
    keywords_and_skills?: string[];
    structure_and_organization?: string[];
    improvement_recommendations?: string[];
  };
  strengths?: string[];
  priority_improvements?: string[];
}

interface ResumeAnalysis {
  id: string;
  resume_file_name: string;
  resume_file_url: string | null;
  job_role: string;
  experience_level: string | null;
  user_email: string | null;
  ai_feedback_formatting: string | null;
  ai_feedback_keywords: string | null;
  ai_feedback_structure: string | null;
  improvement_suggestions: string | null;
  structured_feedback: StructuredFeedback | null;
  overall_score: number | null;
  status: string;
  email_sent: boolean | null;
  email_sent_at: string | null;
  created_at: string;
}

interface ResumeAnalysisDetailProps {
  analysis: ResumeAnalysis;
  onBack: () => void;
}

export const ResumeAnalysisDetail: React.FC<ResumeAnalysisDetailProps> = ({ 
  analysis, 
  onBack 
}) => {
  const { toast } = useToast();

  const handleDownload = async () => {
    if (!analysis.resume_file_url) return;
    
    try {
      // Extract the file path from the URL
      const urlParts = analysis.resume_file_url.split('/');
      const bucketIndex = urlParts.findIndex(part => part === 'resumes');
      if (bucketIndex === -1) {
        throw new Error('Invalid file URL');
      }
      
      const filePath = urlParts.slice(bucketIndex + 1).join('/');
      
      // Download the file using Supabase storage
      const { data, error } = await supabase.storage
        .from('resumes')
        .download(filePath);

      if (error) {
        throw error;
      }

      // Create a blob URL and trigger download
      const blob = new Blob([data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = analysis.resume_file_name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Download started",
        description: "Your resume is being downloaded.",
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download failed",
        description: "Failed to download the resume. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getScoreConfig = (score: number | null) => {
    if (!score) return { 
      color: 'text-gray-500', 
      bgColor: 'bg-gray-50', 
      icon: AlertTriangle, 
      status: 'No Score',
      statusColor: 'bg-gray-100 text-gray-800'
    };
    if (score >= 80) return { 
      color: 'text-green-600', 
      bgColor: 'bg-green-50', 
      icon: CheckCircle2, 
      status: 'Excellent',
      statusColor: 'bg-green-100 text-green-800'
    };
    if (score >= 60) return { 
      color: 'text-yellow-600', 
      bgColor: 'bg-yellow-50', 
      icon: Star, 
      status: 'Good',
      statusColor: 'bg-yellow-100 text-yellow-800'
    };
    return { 
      color: 'text-red-600', 
      bgColor: 'bg-red-50', 
      icon: XCircle, 
      status: 'Needs Improvement',
      statusColor: 'bg-red-100 text-red-800'
    };
  };

  const scoreConfig = getScoreConfig(analysis.overall_score);
  const ScoreIcon = scoreConfig.icon;

  // Use structured feedback if available, otherwise fall back to legacy format
  const structuredFeedback = analysis.structured_feedback;
  const hasStructuredFeedback = structuredFeedback && structuredFeedback.feedback;

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to History
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-xl">
                <FileText className="h-6 w-6 text-white" />
              </div>
              {analysis.resume_file_name}
            </h1>
            <p className="text-muted-foreground mt-1 text-lg">
              Analyzed on {format(new Date(analysis.created_at), 'MMMM dd, yyyy')}
            </p>
          </div>
        </div>
        {analysis.resume_file_url && (
          <Button onClick={handleDownload} className="flex items-center gap-2 px-6">
            <Download className="h-4 w-4" />
            Download Resume
          </Button>
        )}
      </div>

      {/* Email Status Alert */}
      {analysis.email_sent && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <MailCheck className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-green-800 font-medium">Email Report Sent</p>
                <p className="text-green-700 text-sm">
                  Detailed analysis sent to {analysis.user_email} on {format(new Date(analysis.email_sent_at!), 'MMM dd, yyyy at h:mm a')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Overview Card */}
      <Card className="bg-gradient-to-r from-blue-50 via-purple-50 to-blue-50 border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-3">
            <TrendingUp className="h-6 w-6 text-blue-600" />
            Analysis Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Score Card */}
            <div className={`${scoreConfig.bgColor} rounded-xl p-6 text-center border`}>
              <div className={`flex items-center justify-center gap-3 mb-4 ${scoreConfig.color}`}>
                <ScoreIcon className="h-8 w-8" />
                <span className="text-4xl font-bold">
                  {analysis.overall_score || 'N/A'}
                </span>
                {analysis.overall_score && <span className="text-2xl text-gray-400">/100</span>}
              </div>
              <Badge className={scoreConfig.statusColor}>{scoreConfig.status}</Badge>
              <p className="text-sm text-muted-foreground mt-2">Overall Score</p>
            </div>

            {/* Job Role Card */}
            <div className="bg-blue-50 rounded-xl p-6 text-center border border-blue-200">
              <div className="bg-blue-500 p-3 rounded-full w-fit mx-auto mb-3">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div className="text-xl font-semibold text-blue-700 mb-2">
                {analysis.job_role}
              </div>
              <p className="text-sm text-blue-600">Target Role</p>
            </div>

            {/* Experience Level Card */}
            <div className="bg-green-50 rounded-xl p-6 text-center border border-green-200">
              <div className="bg-green-500 p-3 rounded-full w-fit mx-auto mb-3">
                <Star className="h-6 w-6 text-white" />
              </div>
              <Badge variant="outline" className="mb-2 border-green-300 text-green-700">
                {analysis.experience_level || 'Not Specified'}
              </Badge>
              <p className="text-sm text-green-600">Experience Level</p>
            </div>

            {/* Email Status Card */}
            <div className="bg-purple-50 rounded-xl p-6 text-center border border-purple-200">
              <div className="bg-purple-500 p-3 rounded-full w-fit mx-auto mb-3">
                {analysis.email_sent ? <MailCheck className="h-6 w-6 text-white" /> : <Mail className="h-6 w-6 text-white" />}
              </div>
              <Badge className={analysis.email_sent ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                {analysis.email_sent ? 'Email Sent' : 'No Email'}
              </Badge>
              <p className="text-sm text-purple-600">Report Status</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Insights - New structured format */}
      {hasStructuredFeedback && (
        <>
          {/* Strengths */}
          {structuredFeedback.strengths && structuredFeedback.strengths.length > 0 && (
            <Card className="hover:shadow-lg transition-shadow border-0 shadow-md bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="bg-green-100 p-3 rounded-xl">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  </div>
                  ✨ Key Strengths
                </CardTitle>
                <CardDescription className="text-base">
                  What's working well in your resume
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {structuredFeedback.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2.5 flex-shrink-0"></div>
                      <span className="text-gray-700 leading-relaxed">{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Priority Improvements */}
          {structuredFeedback.priority_improvements && structuredFeedback.priority_improvements.length > 0 && (
            <Card className="hover:shadow-lg transition-shadow border-0 shadow-md bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="bg-amber-100 p-3 rounded-xl">
                    <Target className="h-6 w-6 text-amber-600" />
                  </div>
                  🎯 Priority Improvements
                </CardTitle>
                <CardDescription className="text-base">
                  Most important changes to make first
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {structuredFeedback.priority_improvements.map((improvement, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                        {index + 1}
                      </div>
                      <span className="text-gray-700 leading-relaxed">{improvement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Detailed Feedback Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {hasStructuredFeedback ? (
          // New structured feedback format
          <>
            {structuredFeedback.feedback.formatting_and_design && structuredFeedback.feedback.formatting_and_design.length > 0 && (
              <Card className="hover:shadow-lg transition-shadow border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="bg-blue-100 p-3 rounded-xl">
                      <Layout className="h-6 w-6 text-blue-600" />
                    </div>
                    🎨 Formatting & Design
                  </CardTitle>
                  <CardDescription className="text-base">
                    Visual presentation and ATS compatibility
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {structuredFeedback.feedback.formatting_and_design.map((point, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2.5 flex-shrink-0"></div>
                        <span className="text-gray-700 leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {structuredFeedback.feedback.keywords_and_skills && structuredFeedback.feedback.keywords_and_skills.length > 0 && (
              <Card className="hover:shadow-lg transition-shadow border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="bg-green-100 p-3 rounded-xl">
                      <Target className="h-6 w-6 text-green-600" />
                    </div>
                    🔑 Keywords & Skills
                  </CardTitle>
                  <CardDescription className="text-base">
                    Industry-relevant terms and technical skills
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {structuredFeedback.feedback.keywords_and_skills.map((point, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2.5 flex-shrink-0"></div>
                        <span className="text-gray-700 leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {structuredFeedback.feedback.structure_and_organization && structuredFeedback.feedback.structure_and_organization.length > 0 && (
              <Card className="hover:shadow-lg transition-shadow border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="bg-purple-100 p-3 rounded-xl">
                      <FileText className="h-6 w-6 text-purple-600" />
                    </div>
                    📋 Structure & Organization
                  </CardTitle>
                  <CardDescription className="text-base">
                    Content flow and logical organization
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {structuredFeedback.feedback.structure_and_organization.map((point, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2.5 flex-shrink-0"></div>
                        <span className="text-gray-700 leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {structuredFeedback.feedback.improvement_recommendations && structuredFeedback.feedback.improvement_recommendations.length > 0 && (
              <Card className="hover:shadow-lg transition-shadow border-0 shadow-md bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="bg-orange-100 p-3 rounded-xl">
                      <Lightbulb className="h-6 w-6 text-orange-600" />
                    </div>
                    💡 Actionable Recommendations
                  </CardTitle>
                  <CardDescription className="text-base">
                    Specific steps to enhance your resume
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {structuredFeedback.feedback.improvement_recommendations.map((point, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2.5 flex-shrink-0"></div>
                        <span className="text-gray-700 leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          // Fallback to legacy format
          <>
            {analysis.ai_feedback_formatting && (
              <Card className="hover:shadow-lg transition-shadow border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="bg-blue-100 p-3 rounded-xl">
                      <Layout className="h-6 w-6 text-blue-600" />
                    </div>
                    Formatting & Design
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{analysis.ai_feedback_formatting}</p>
                </CardContent>
              </Card>
            )}

            {analysis.ai_feedback_keywords && (
              <Card className="hover:shadow-lg transition-shadow border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="bg-green-100 p-3 rounded-xl">
                      <Target className="h-6 w-6 text-green-600" />
                    </div>
                    Keywords & Skills
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{analysis.ai_feedback_keywords}</p>
                </CardContent>
              </Card>
            )}

            {analysis.ai_feedback_structure && (
              <Card className="hover:shadow-lg transition-shadow border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="bg-purple-100 p-3 rounded-xl">
                      <FileText className="h-6 w-6 text-purple-600" />
                    </div>
                    Structure & Organization
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{analysis.ai_feedback_structure}</p>
                </CardContent>
              </Card>
            )}

            {analysis.improvement_suggestions && (
              <Card className="hover:shadow-lg transition-shadow border-0 shadow-md bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="bg-orange-100 p-3 rounded-xl">
                      <Lightbulb className="h-6 w-6 text-orange-600" />
                    </div>
                    Improvement Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{analysis.improvement_suggestions}</p>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>

      {/* Bottom Action Section */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-8">
          <div className="flex justify-center gap-4">
            <Button onClick={onBack} variant="outline" size="lg" className="px-8">
              <ArrowLeft className="h-5 w-5 mr-2" />
              View All Analyses
            </Button>
            {analysis.resume_file_url && (
              <Button onClick={handleDownload} size="lg" className="px-8">
                <Download className="h-5 w-5 mr-2" />
                Download Resume
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
