
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, MessageSquare, Calendar, User, Settings, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreateInterviewModal } from "@/components/CreateInterviewModal";
import { useAIInterviews } from "@/hooks/useAIInterviews";
import { useAuth } from "@/hooks/useAuth";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const AIInterview = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { interviews, loading, createInterview, deleteInterview, isCreating, isDeleting } = useAIInterviews();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreateInterview = async (data: {
    title: string;
    technology: string;
    experience_level: string;
    difficulty_level: string;
  }) => {
    try {
      const newInterview = await createInterview(data);
      setIsCreateModalOpen(false);
      navigate(`/ai-interview/${newInterview.id}`);
    } catch (error) {
      console.error('Failed to create interview:', error);
    }
  };

  const handleDeleteInterview = async (interviewId: string) => {
    try {
      await deleteInterview(interviewId);
    } catch (error) {
      console.error('Failed to delete interview:', error);
    }
  };

  const handleStartInterview = (interviewId: string) => {
    navigate(`/ai-interview/${interviewId}`);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'hard':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">AI Interview Practice</h1>
            <p className="text-muted-foreground mt-2">
              Practice technical interviews with AI-powered mock interviews
            </p>
          </div>
        </div>
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mt-2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Interview Practice</h1>
          <p className="text-muted-foreground mt-2">
            Practice technical interviews with AI-powered mock interviews
          </p>
        </div>
        <Button 
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2"
          disabled={isCreating}
        >
          <Plus className="h-4 w-4" />
          {isCreating ? 'Creating...' : 'New Interview'}
        </Button>
      </div>

      {interviews.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No interviews yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first AI interview to start practicing
            </p>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Interview
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {interviews.map((interview) => (
            <Card key={interview.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{interview.title}</CardTitle>
                    <CardDescription className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Settings className="h-3 w-3" />
                        {interview.technology}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {interview.experience_level}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(interview.created_at)}
                      </span>
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getDifficultyColor(interview.difficulty_level)}>
                      {interview.difficulty_level}
                    </Badge>
                    <Badge className={getStatusColor(interview.status)}>
                      {interview.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Practice {interview.technology} interview questions at {interview.difficulty_level.toLowerCase()} level
                  </p>
                  <div className="flex items-center gap-2">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          disabled={isDeleting}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Interview</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{interview.title}"? This action cannot be undone and will also delete all associated chat history.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteInterview(interview.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <Button 
                      onClick={() => handleStartInterview(interview.id)}
                      size="sm"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Start Interview
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CreateInterviewModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSubmit={handleCreateInterview}
      />
    </div>
  );
};

export default AIInterview;
