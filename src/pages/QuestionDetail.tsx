
import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Bookmark, BookmarkCheck, CheckCircle, Circle, Lightbulb, Brain, MessageSquare, Code, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCompanyQuestions } from "@/hooks/useCompanyQuestions";
import { useAuth } from "@/hooks/useAuth";

export default function QuestionDetail() {
  const { companyId, questionId } = useParams<{ companyId: string; questionId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const companyName = location.state?.companyName || "Company";
  const { user } = useAuth();
  
  const { questions, userProgress, updateUserProgress, loading } = useCompanyQuestions(companyId);
  const [userAnswer, setUserAnswer] = useState("");
  const [userNotes, setUserNotes] = useState("");

  const question = questions.find(q => q.id === questionId);
  const progress = questionId ? userProgress[questionId] : undefined;

  useEffect(() => {
    if (progress) {
      setUserAnswer(progress.user_answer || "");
      setUserNotes(progress.notes || "");
    }
  }, [progress]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Coding': return <Code className="h-4 w-4" />;
      case 'Theoretical': return <MessageSquare className="h-4 w-4" />;
      case 'MCQ': return <FileText className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const handleBookmarkToggle = () => {
    if (!questionId) return;
    updateUserProgress(questionId, {
      bookmarked: !progress?.bookmarked
    });
  };

  const handleSolvedToggle = () => {
    if (!questionId) return;
    updateUserProgress(questionId, {
      solved: !progress?.solved
    });
  };

  const handleSaveAnswer = () => {
    if (!questionId) return;
    updateUserProgress(questionId, {
      user_answer: userAnswer,
      notes: userNotes
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="space-y-6">
          <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-96 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">Question not found.</p>
          <Button 
            onClick={() => navigate(`/company-questions/${companyId}`)}
            className="mt-4"
          >
            Back to Questions
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate(`/company-questions/${companyId}`, { state: { companyName } })}
            className="p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <Badge variant="outline" className="text-xs">
                {companyName}
              </Badge>
              <Badge 
                variant="secondary" 
                className={`text-xs ${getDifficultyColor(question.difficulty)}`}
              >
                {question.difficulty}
              </Badge>
              <Badge variant="outline" className="text-xs">
                <span className="mr-1">{getTypeIcon(question.question_type)}</span>
                {question.question_type}
              </Badge>
            </div>
            <h1 className="text-2xl font-bold text-foreground">{question.title}</h1>
          </div>
        </div>
        
        {user && (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBookmarkToggle}
              className={progress?.bookmarked ? "text-blue-600 border-blue-600" : ""}
            >
              {progress?.bookmarked ? (
                <BookmarkCheck className="h-4 w-4 mr-2" />
              ) : (
                <Bookmark className="h-4 w-4 mr-2" />
              )}
              {progress?.bookmarked ? "Bookmarked" : "Bookmark"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSolvedToggle}
              className={progress?.solved ? "text-green-600 border-green-600" : ""}
            >
              {progress?.solved ? (
                <CheckCircle className="h-4 w-4 mr-2" />
              ) : (
                <Circle className="h-4 w-4 mr-2" />
              )}
              {progress?.solved ? "Solved" : "Mark as Solved"}
            </Button>
          </div>
        )}
      </div>

      {/* Tags */}
      {question.tags && question.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {question.tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Question Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Question</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <p className="whitespace-pre-wrap text-foreground">{question.content}</p>
              </div>
            </CardContent>
          </Card>

          {/* User Answer Section */}
          {user && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Solution</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Tabs defaultValue="answer" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="answer">Answer</TabsTrigger>
                    <TabsTrigger value="notes">Notes</TabsTrigger>
                  </TabsList>
                  <TabsContent value="answer" className="space-y-4">
                    <Textarea
                      placeholder="Write your solution here..."
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      rows={10}
                      className="font-mono text-sm"
                    />
                  </TabsContent>
                  <TabsContent value="notes" className="space-y-4">
                    <Textarea
                      placeholder="Add your notes, approach, or key insights..."
                      value={userNotes}
                      onChange={(e) => setUserNotes(e.target.value)}
                      rows={6}
                    />
                  </TabsContent>
                </Tabs>
                <Button onClick={handleSaveAnswer} className="w-full">
                  Save Progress
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* AI Assistance Sidebar */}
        <div className="space-y-4">
          {question.ai_hint && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center">
                  <Lightbulb className="h-4 w-4 mr-2 text-yellow-500" />
                  Hint
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{question.ai_hint}</p>
              </CardContent>
            </Card>
          )}

          {question.ai_explanation && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center">
                  <Brain className="h-4 w-4 mr-2 text-blue-500" />
                  Explanation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{question.ai_explanation}</p>
              </CardContent>
            </Card>
          )}

          {!user && (
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground text-center mb-4">
                  Sign in to track your progress and save solutions
                </p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/auth')}
                >
                  Sign In
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
