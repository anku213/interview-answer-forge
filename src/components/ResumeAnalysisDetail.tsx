
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, FileText, Download, CheckCircle2, AlertTriangle, XCircle, Star, Lightbulb } from "lucide-react";
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
    if (!score) return <AlertTriangle className="h-6 w-6" />;
    if (score >= 80) return <CheckCircle2 className="h-6 w-6" />;
    if (score >= 60) return <Star className="h-6 w-6" />;
    return <XCircle className="h-6 w-6" />;
  };

  const getScoreStatus = (score: number | null) => {
    if (!score) return { text: 'No Score', color: 'bg-gray-100 text-gray-800' };
    if (score >= 80) return { text: 'Excellent', color: 'bg-green-100 text-green-800' };
    if (score >= 60) return { text: 'Good', color: 'bg-yellow-100 text-yellow-800' };
    return { text: 'Needs Improvement', color: 'bg-red-100 text-red-800' };
  };

  const cleanText = (text: string | null) => {
    if (!text) return '';
    return text
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove **bold** formatting
      .replace(/\*(.*?)\*/g, '$1') // Remove *italic* formatting
      .replace(/^\* /gm, '• ') // Convert * to bullet points
      .replace(/^- /gm, '• ') // Convert - to bullet points
      .trim();
  };

  const scoreStatus = getScoreStatus(analysis.overall_score);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to History
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <FileText className="h-8 w-8 text-blue-600" />
              {analysis.resume_file_name}
            </h1>
            <p className="text-gray-600 mt-1">
              Analyzed on {format(new Date(analysis.created_at), 'MMMM dd, yyyy')}
            </p>
          </div>
        </div>
        {analysis.resume_file_url && (
          <Button
            variant="outline"
            onClick={() => window.open(analysis.resume_file_url!, '_blank')}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download Resume
          </Button>
        )}
      </div>

      {/* Overview Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-xl text-gray-900">Analysis Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className={`flex items-center justify-center gap-3 mb-3 ${getScoreColor(analysis.overall_score)}`}>
                {getScoreIcon(analysis.overall_score)}
                <span className="text-4xl font-bold">{analysis.overall_score || 'N/A'}</span>
                {analysis.overall_score && <span className="text-2xl text-gray-400">/100</span>}
              </div>
              <Badge className={scoreStatus.color}>{scoreStatus.text}</Badge>
              <p className="text-sm text-gray-600 mt-1">Overall Score</p>
            </div>
            <div className="text-center">
              <div className="text-xl font-semibold mb-3 text-gray-900">{analysis.job_role}</div>
              <p className="text-sm text-gray-600">Target Role</p>
            </div>
            <div className="text-center">
              <Badge variant="outline" className="mb-3 text-sm">
                {analysis.experience_level || 'Not Specified'}
              </Badge>
              <p className="text-sm text-gray-600">Experience Level</p>
            </div>
            <div className="text-center">
              <Badge className="bg-blue-100 text-blue-800 mb-3">
                {analysis.status === 'completed' ? 'Completed' : 'Processing'}
              </Badge>
              <p className="text-sm text-gray-600">Status</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Feedback */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formatting Analysis */}
        {analysis.ai_feedback_formatting && (
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-blue-600" />
                </div>
                Formatting & Design
              </CardTitle>
              <CardDescription>
                Visual presentation, layout, and professional appearance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
                <p className="whitespace-pre-wrap">{cleanText(analysis.ai_feedback_formatting)}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Keywords Analysis */}
        {analysis.ai_feedback_keywords && (
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Star className="h-5 w-5 text-green-600" />
                </div>
                Keywords & Skills
              </CardTitle>
              <CardDescription>
                Industry-relevant terms and technical skills assessment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
                <p className="whitespace-pre-wrap">{cleanText(analysis.ai_feedback_keywords)}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Structure Analysis */}
        {analysis.ai_feedback_structure && (
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FileText className="h-5 w-5 text-purple-600" />
                </div>
                Structure & Organization
              </CardTitle>
              <CardDescription>
                Content flow, section arrangement, and logical organization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
                <p className="whitespace-pre-wrap">{cleanText(analysis.ai_feedback_structure)}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Improvement Suggestions */}
        {analysis.improvement_suggestions && (
          <Card className="hover:shadow-md transition-shadow border-orange-200 bg-orange-50/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Lightbulb className="h-5 w-5 text-orange-600" />
                </div>
                Improvement Recommendations
              </CardTitle>
              <CardDescription>
                Actionable suggestions to enhance your resume
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
                <p className="whitespace-pre-wrap">{cleanText(analysis.improvement_suggestions)}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Action Buttons */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center gap-4">
            <Button onClick={onBack} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              View All Analyses
            </Button>
            {analysis.resume_file_url && (
              <Button 
                variant="outline"
                onClick={() => window.open(analysis.resume_file_url!, '_blank')}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download Resume
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
