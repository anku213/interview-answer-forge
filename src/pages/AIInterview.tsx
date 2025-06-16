
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, MessageSquare, Clock, User, Calendar } from "lucide-react";
import { CreateInterviewModal } from "@/components/CreateInterviewModal";
import { useAIInterviews } from "@/hooks/useAIInterviews";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const AIInterview = () => {
  const navigate = useNavigate();
  const { interviews, loading, createInterview } = useAIInterviews();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreateInterview = async (interviewData: {
    title: string;
    technology: string;
    experience_level: string;
    difficulty_level: string;
  }) => {
    try {
      const newInterview = await createInterview(interviewData);
      setIsCreateModalOpen(false);
      // Navigate to the interview panel
      navigate(`/ai-interview/${newInterview.id}`);
    } catch (error) {
      console.error('Error creating interview:', error);
    }
  };

  const handleStartInterview = (interviewId: string) => {
    navigate(`/ai-interview/${interviewId}`);
  };

  const filteredInterviews = interviews.filter(interview =>
    interview.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    interview.technology.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/30 border-t-primary mx-auto"></div>
            <p className="mt-4 text-lg font-medium text-muted-foreground">Loading interviews...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">AI Interview</h1>
            <p className="text-muted-foreground">
              Practice technical interviews with AI-powered mock interviews
            </p>
          </div>
          
          <Button 
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-primary-foreground"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Interview
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search interviews..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Interviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInterviews.map((interview) => (
            <Card key={interview.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold line-clamp-2">
                      {interview.title}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {interview.technology}
                    </CardDescription>
                  </div>
                  <MessageSquare className="h-5 w-5 text-muted-foreground flex-shrink-0 ml-2" />
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge className={getStatusColor(interview.status)}>
                    {interview.status}
                  </Badge>
                  <Badge className={getDifficultyColor(interview.difficulty_level)}>
                    {interview.difficulty_level}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{interview.experience_level}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(interview.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                <Button 
                  onClick={() => handleStartInterview(interview.id)}
                  className="w-full"
                  variant={interview.status === 'completed' ? 'outline' : 'default'}
                >
                  {interview.status === 'completed' ? 'Review Interview' : 'Start Interview'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredInterviews.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No interviews found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? 'Try adjusting your search terms' : 'Create your first AI interview to get started'}
            </p>
            {!searchTerm && (
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Interview
              </Button>
            )}
          </div>
        )}

        {/* Create Interview Modal */}
        <CreateInterviewModal
          open={isCreateModalOpen}
          onOpenChange={setIsCreateModalOpen}
          onSubmit={handleCreateInterview}
        />
      </div>
    </ProtectedRoute>
  );
};

export default AIInterview;
