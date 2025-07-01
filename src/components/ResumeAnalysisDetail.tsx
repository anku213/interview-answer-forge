
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileText, Download, CheckCircle2, AlertTriangle, XCircle, Star, Lightbulb, TrendingUp, Target, Layout } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  overall_score: number | null;
  status: string;
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

  const cleanText = (text: string | null) => {
    if (!text) return '';
    return text
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/^\* /gm, '• ')
      .replace(/^- /gm, '• ')
      .trim();
  };

  const scoreConfig = getScoreConfig(analysis.overall_score);
  const ScoreIcon = scoreConfig.icon;

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

            {/* Status Card */}
            <div className="bg-purple-50 rounded-xl p-6 text-center border border-purple-200">
              <div className="bg-purple-500 p-3 rounded-full w-fit mx-auto mb-3">
                <CheckCircle2 className="h-6 w-6 text-white" />
              </div>
              <Badge className="bg-purple-100 text-purple-800 mb-2">
                {analysis.status === 'completed' ? 'Completed' : 'Processing'}
              </Badge>
              <p className="text-sm text-purple-600">Status</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Feedback Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formatting Analysis */}
        {analysis.ai_feedback_formatting && (
          <Card className="hover:shadow-lg transition-shadow border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <Layout className="h-6 w-6 text-blue-600" />
                </div>
                Formatting & Design
              </CardTitle>
              <CardDescription className="text-base">
                Visual presentation, layout, and professional appearance analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
                <p className="whitespace-pre-wrap text-base">{cleanText(analysis.ai_feedback_formatting)}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Keywords Analysis */}
        {analysis.ai_feedback_keywords && (
          <Card className="hover:shadow-lg transition-shadow border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="bg-green-100 p-3 rounded-xl">
                  <Target className="h-6 w-6 text-green-600" />
                </div>
                Keywords & Skills
              </CardTitle>
              <CardDescription className="text-base">
                Industry-relevant terms and technical skills assessment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
                <p className="whitespace-pre-wrap text-base">{cleanText(analysis.ai_feedback_keywords)}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Structure Analysis */}
        {analysis.ai_feedback_structure && (
          <Card className="hover:shadow-lg transition-shadow border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="bg-purple-100 p-3 rounded-xl">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
                Structure & Organization
              </CardTitle>
              <CardDescription className="text-base">
                Content flow, section arrangement, and logical organization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
                <p className="whitespace-pre-wrap text-base">{cleanText(analysis.ai_feedback_structure)}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Improvement Suggestions */}
        {analysis.improvement_suggestions && (
          <Card className="hover:shadow-lg transition-shadow border-0 shadow-md bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="bg-orange-100 p-3 rounded-xl">
                  <Lightbulb className="h-6 w-6 text-orange-600" />
                </div>
                Improvement Recommendations
              </CardTitle>
              <CardDescription className="text-base">
                Actionable suggestions to enhance your resume effectiveness
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
                <p className="whitespace-pre-wrap text-base">{cleanText(analysis.improvement_suggestions)}</p>
              </div>
            </CardContent>
          </Card>
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
