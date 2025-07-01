
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Download, Eye, Calendar, Briefcase } from "lucide-react";
import { useResumeAnalyses } from "@/hooks/useResumeAnalyzer";
import { ResumeAnalysisDetail } from "@/components/ResumeAnalysisDetail";
import { format } from "date-fns";

export const ResumeAnalysesList = () => {
  const { data: analyses, isLoading, error } = useResumeAnalyses();
  const [selectedAnalysis, setSelectedAnalysis] = React.useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-red-600">
            <p>Failed to load analysis history</p>
            <p className="text-sm text-gray-500 mt-1">{error.message}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analyses || analyses.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium">No analyses yet</p>
            <p className="text-sm">Upload your first resume to get started!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score: number | null) => {
    if (!score) return 'text-gray-500';
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (selectedAnalysis) {
    const analysis = analyses.find(a => a.id === selectedAnalysis);
    if (analysis) {
      return (
        <ResumeAnalysisDetail 
          analysis={analysis} 
          onBack={() => setSelectedAnalysis(null)} 
        />
      );
    }
  }

  return (
    <div className="space-y-4">
      {analyses.map((analysis) => (
        <Card key={analysis.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-5 w-5" />
                  {analysis.resume_file_name}
                </CardTitle>
                <CardDescription className="flex items-center gap-4 mt-2">
                  <span className="flex items-center gap-1">
                    <Briefcase className="h-4 w-4" />
                    {analysis.job_role}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(analysis.created_at), 'MMM dd, yyyy')}
                  </span>
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                {analysis.overall_score && (
                  <div className={`text-2xl font-bold ${getScoreColor(analysis.overall_score)}`}>
                    {analysis.overall_score}/100
                  </div>
                )}
                <Badge className={getStatusColor(analysis.status)}>
                  {analysis.status}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {analysis.experience_level && (
                  <p>Experience: {analysis.experience_level}</p>
                )}
                {analysis.user_email && (
                  <p>Email: {analysis.user_email}</p>
                )}
              </div>
              <div className="flex gap-2">
                {analysis.status === 'completed' && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedAnalysis(analysis.id)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                    {analysis.resume_file_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(analysis.resume_file_url!, '_blank')}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
