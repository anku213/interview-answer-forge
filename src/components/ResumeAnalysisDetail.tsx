
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, FileText, Star, AlertTriangle, CheckCircle, Download } from "lucide-react";
import { format } from "date-fns";

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
  const getScoreColor = (score: number | null) => {
    if (!score) return 'text-gray-500';
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number | null) => {
    if (!score) return <AlertTriangle className="h-5 w-5" />;
    if (score >= 80) return <CheckCircle className="h-5 w-5" />;
    if (score >= 60) return <Star className="h-5 w-5" />;
    return <AlertTriangle className="h-5 w-5" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to List
        </Button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6" />
            {analysis.resume_file_name}
          </h2>
          <p className="text-gray-600">
            Analyzed on {format(new Date(analysis.created_at), 'MMMM dd, yyyy')}
          </p>
        </div>
        {analysis.resume_file_url && (
          <Button
            variant="outline"
            onClick={() => window.open(analysis.resume_file_url!, '_blank')}
          >
            <Download className="h-4 w-4 mr-2" />
            Download Resume
          </Button>
        )}
      </div>

      {/* Overview Card */}
      <Card>
        <CardHeader>
          <CardTitle>Analysis Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className={`text-4xl font-bold mb-2 ${getScoreColor(analysis.overall_score)} flex items-center justify-center gap-2`}>
                {getScoreIcon(analysis.overall_score)}
                {analysis.overall_score || 'N/A'}/100
              </div>
              <p className="text-sm text-gray-600">Overall Score</p>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold mb-2">{analysis.job_role}</div>
              <p className="text-sm text-gray-600">Target Role</p>
            </div>
            <div className="text-center">
              <Badge variant="outline" className="mb-2">
                {analysis.experience_level || 'Not Specified'}
              </Badge>
              <p className="text-sm text-gray-600">Experience Level</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Feedback */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formatting Feedback */}
        {analysis.ai_feedback_formatting && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
                Formatting Analysis
              </CardTitle>
              <CardDescription>
                Visual design, layout, and presentation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <p className="whitespace-pre-wrap">{analysis.ai_feedback_formatting}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Keywords Feedback */}
        {analysis.ai_feedback_keywords && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                Keywords Analysis
              </CardTitle>
              <CardDescription>
                Relevant industry terms and skills
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <p className="whitespace-pre-wrap">{analysis.ai_feedback_keywords}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Structure Feedback */}
        {analysis.ai_feedback_structure && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="h-3 w-3 bg-purple-500 rounded-full"></div>
                Structure Analysis
              </CardTitle>
              <CardDescription>
                Organization and flow of information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <p className="whitespace-pre-wrap">{analysis.ai_feedback_structure}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Improvement Suggestions */}
        {analysis.improvement_suggestions && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="h-3 w-3 bg-orange-500 rounded-full"></div>
                Improvement Suggestions
              </CardTitle>
              <CardDescription>
                Actionable recommendations for enhancement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <p className="whitespace-pre-wrap">{analysis.improvement_suggestions}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Action Buttons */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center gap-4">
            <Button onClick={onBack}>
              View All Analyses
            </Button>
            {analysis.resume_file_url && (
              <Button 
                variant="outline"
                onClick={() => window.open(analysis.resume_file_url!, '_blank')}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Resume
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
