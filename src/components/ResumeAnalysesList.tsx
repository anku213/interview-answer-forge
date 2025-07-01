
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Download, Eye, Calendar, Briefcase, Star, AlertCircle, CheckCircle2 } from "lucide-react";
import { useResumeAnalyses } from "@/hooks/useResumeAnalyzer";
import { ResumeAnalysisDetail } from "@/components/ResumeAnalysisDetail";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const ResumeAnalysesList = () => {
  const { data: analyses, isLoading, error } = useResumeAnalyses();
  const [selectedAnalysis, setSelectedAnalysis] = React.useState<string | null>(null);
  const { toast } = useToast();

  const handleDownload = async (fileUrl: string, fileName: string) => {
    try {
      // Extract the file path from the URL
      const urlParts = fileUrl.split('/');
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
      link.download = fileName;
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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="hover:shadow-lg transition-shadow">
              <CardHeader className="space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="text-center p-8">
        <CardContent>
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
          <h3 className="text-lg font-semibold text-red-600 mb-2">Failed to load analysis history</h3>
          <p className="text-sm text-muted-foreground">{error.message}</p>
        </CardContent>
      </Card>
    );
  }

  if (!analyses || analyses.length === 0) {
    return (
      <Card className="text-center p-12">
        <CardContent>
          <div className="bg-blue-50 p-6 rounded-full w-fit mx-auto mb-6">
            <FileText className="h-16 w-16 text-blue-500" />
          </div>
          <h3 className="text-2xl font-semibold mb-3">No analyses yet</h3>
          <p className="text-muted-foreground text-lg">
            Upload your first resume to get started with AI-powered analysis!
          </p>
        </CardContent>
      </Card>
    );
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'completed': 
        return { 
          color: 'bg-green-100 text-green-800 border-green-200', 
          icon: CheckCircle2,
          text: 'Completed'
        };
      case 'processing': 
        return { 
          color: 'bg-blue-100 text-blue-800 border-blue-200', 
          icon: AlertCircle,
          text: 'Processing'
        };
      case 'failed': 
        return { 
          color: 'bg-red-100 text-red-800 border-red-200', 
          icon: AlertCircle,
          text: 'Failed'
        };
      default: 
        return { 
          color: 'bg-gray-100 text-gray-800 border-gray-200', 
          icon: AlertCircle,
          text: 'Unknown'
        };
    }
  };

  const getScoreConfig = (score: number | null) => {
    if (!score) return { color: 'text-gray-500', bgColor: 'bg-gray-100' };
    if (score >= 80) return { color: 'text-green-600', bgColor: 'bg-green-50' };
    if (score >= 60) return { color: 'text-yellow-600', bgColor: 'bg-yellow-50' };
    return { color: 'text-red-600', bgColor: 'bg-red-50' };
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
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {analyses.map((analysis) => {
          const statusConfig = getStatusConfig(analysis.status);
          const scoreConfig = getScoreConfig(analysis.overall_score);
          const StatusIcon = statusConfig.icon;

          return (
            <Card key={analysis.id} className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02] border-0 shadow-md">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="flex items-center gap-3 text-lg truncate">
                      <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <span className="truncate">{analysis.resume_file_name}</span>
                    </CardTitle>
                    <CardDescription className="flex items-center gap-3 mt-3">
                      <span className="flex items-center gap-1.5">
                        <Briefcase className="h-4 w-4" />
                        <span className="font-medium">{analysis.job_role}</span>
                      </span>
                    </CardDescription>
                  </div>
                  <Badge className={`${statusConfig.color} flex items-center gap-1.5 px-3 py-1`}>
                    <StatusIcon className="h-3 w-3" />
                    {statusConfig.text}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Score Display */}
                {analysis.overall_score && (
                  <div className={`${scoreConfig.bgColor} rounded-lg p-4`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Star className={`h-5 w-5 ${scoreConfig.color}`} />
                        <span className="font-medium">Overall Score</span>
                      </div>
                      <div className={`text-2xl font-bold ${scoreConfig.color}`}>
                        {analysis.overall_score}/100
                      </div>
                    </div>
                  </div>
                )}

                {/* Metadata */}
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Analyzed on {format(new Date(analysis.created_at), 'MMM dd, yyyy')}</span>
                  </div>
                  {analysis.experience_level && (
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {analysis.experience_level}
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                {analysis.status === 'completed' && (
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => setSelectedAnalysis(analysis.id)}
                      className="flex-1"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    {analysis.resume_file_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(analysis.resume_file_url!, analysis.resume_file_name)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
