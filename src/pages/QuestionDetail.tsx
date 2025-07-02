
import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Bookmark, BookmarkCheck, CheckCircle, Circle, Lightbulb, Brain, MessageSquare, Code, FileText, Send, CheckIcon, AlertCircle, Play, Eye, Zap, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { useCompanyQuestions } from "@/hooks/useCompanyQuestions";
import { useAuth } from "@/hooks/useAuth";
import { useGeminiAI } from "@/hooks/useGeminiAI";

export default function QuestionDetail() {
  const { companyId, questionId } = useParams<{ companyId: string; questionId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const companyName = location.state?.companyName || "Company";
  const { user } = useAuth();
  
  const { questions, userProgress, updateUserProgress, loading } = useCompanyQuestions(companyId);
  const { generateResponse, loading: aiLoading } = useGeminiAI();
  
  const [userAnswer, setUserAnswer] = useState("");
  const [userNotes, setUserNotes] = useState("");
  const [activeTab, setActiveTab] = useState("question");
  const [validationResult, setValidationResult] = useState<{
    isCorrect: boolean;
    feedback: string;
    suggestedSolution?: string;
  } | null>(null);
  const [showValidation, setShowValidation] = useState(false);

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
      case 'Easy': return 'bg-green-100 text-green-800 border-green-300';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Hard': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
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

  const handleStartSolving = () => {
    setActiveTab("solve");
  };

  const handleSubmitForValidation = async () => {
    if (!question || !userAnswer.trim()) return;

    setShowValidation(false);
    
    const validationPrompt = `
Please analyze the following interview question and the user's submitted answer. Provide feedback on whether the answer is correct or not.

**Question:** ${question.title}
**Question Type:** ${question.question_type}
**Difficulty:** ${question.difficulty}
**Question Content:** ${question.content}

**User's Answer:** ${userAnswer}

Please respond in the following JSON format:
{
  "isCorrect": true/false,
  "feedback": "Brief feedback explaining why the answer is correct or incorrect",
  "suggestedSolution": "If incorrect, provide a better solution or approach (optional if correct)"
}

Be thorough but concise in your evaluation. Consider accuracy, completeness, and best practices.
    `;

    try {
      const aiResponse = await generateResponse(validationPrompt);
      
      if (aiResponse) {
        try {
          const parsedResponse = JSON.parse(aiResponse);
          setValidationResult(parsedResponse);
        } catch {
          const isCorrect = aiResponse.toLowerCase().includes("correct") && 
                           !aiResponse.toLowerCase().includes("not correct") &&
                           !aiResponse.toLowerCase().includes("incorrect");
          
          setValidationResult({
            isCorrect,
            feedback: aiResponse,
            suggestedSolution: !isCorrect ? "Please review the AI feedback above for guidance." : undefined
          });
        }
        setShowValidation(true);
      }
    } catch (error) {
      console.error('Error validating answer:', error);
      setValidationResult({
        isCorrect: false,
        feedback: "Sorry, there was an error validating your answer. Please try again.",
        suggestedSolution: "Please check your connection and try again."
      });
      setShowValidation(true);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 max-w-6xl">
        <div className="space-y-6">
          <div className="h-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded-3xl animate-pulse"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-96 bg-gray-200 rounded-2xl animate-pulse"></div>
            </div>
            <div className="space-y-4">
              <div className="h-48 bg-gray-200 rounded-2xl animate-pulse"></div>
              <div className="h-32 bg-gray-200 rounded-2xl animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="container mx-auto py-8 max-w-6xl">
        <Card className="bg-gradient-to-br from-muted/20 to-muted/5 border-2 border-dashed border-border/50">
          <CardContent className="text-center py-16">
            <div className="bg-muted/30 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-semibold text-foreground mb-2">Question not found</h3>
            <p className="text-muted-foreground text-lg max-w-md mx-auto mb-6">
              The question you're looking for doesn't exist or has been removed.
            </p>
            <Button 
              onClick={() => navigate(`/company-questions/${companyId}`, { state: { companyName } })}
              className="bg-primary hover:bg-primary/90"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Questions
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-6xl space-y-8">
      {/* Enhanced Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-blue-950/20 dark:via-background dark:to-purple-950/20 border border-blue-200/50 dark:border-blue-800/30 p-8">
        <div className="absolute top-4 right-4 opacity-10">
          <Brain className="h-32 w-32 text-blue-600" />
        </div>
        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate(`/company-questions/${companyId}`, { state: { companyName } })}
                className="p-3 bg-white/50 hover:bg-white/80 dark:bg-white/10 dark:hover:bg-white/20 rounded-xl border border-border/50"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="bg-blue-500/20 p-3 rounded-2xl">
                {getTypeIcon(question.question_type)}
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Badge variant="outline" className="text-xs bg-white/60 dark:bg-white/10">
                    {companyName}
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className={`text-xs border-2 ${getDifficultyColor(question.difficulty)}`}
                  >
                    {question.difficulty}
                  </Badge>
                  <Badge variant="outline" className="text-xs bg-white/60 dark:bg-white/10">
                    <span className="mr-1">{getTypeIcon(question.question_type)}</span>
                    {question.question_type}
                  </Badge>
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {question.title}
                </h1>
              </div>
            </div>
            
            {user && (
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBookmarkToggle}
                  className={`transition-all duration-300 ${
                    progress?.bookmarked 
                      ? "bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200" 
                      : "bg-white/50 hover:bg-blue-50 border-border/50"
                  }`}
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
                  className={`transition-all duration-300 ${
                    progress?.solved 
                      ? "bg-green-100 text-green-700 border-green-300 hover:bg-green-200" 
                      : "bg-white/50 hover:bg-green-50 border-border/50"
                  }`}
                >
                  {progress?.solved ? (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  ) : (
                    <Circle className="h-4 w-4 mr-2" />
                  )}
                  {progress?.solved ? "Solved" : "Mark Solved"}
                </Button>
                <Button
                  onClick={handleStartSolving}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Solving
                </Button>
              </div>
            )}
          </div>

          {/* Tags */}
          {question.tags && question.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {question.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs bg-white/40 dark:bg-white/10">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Question Content */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-muted/30">
              <TabsTrigger value="question" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Question
              </TabsTrigger>
              <TabsTrigger value="solve" className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                Solve
              </TabsTrigger>
              <TabsTrigger value="notes" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Notes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="question" className="space-y-6 mt-6">
              <Card className="border-2 border-border/50">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-blue-600" />
                    Question Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <div className="text-foreground whitespace-pre-wrap leading-relaxed text-base">
                      {question.content}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="solve" className="space-y-6 mt-6">
              {user ? (
                <Card className="border-2 border-border/50">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Zap className="h-5 w-5 text-green-600" />
                      Your Solution
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="space-y-4">
                      <label className="text-sm font-medium text-foreground">Write your answer below:</label>
                      <Textarea
                        placeholder="Start typing your solution here..."
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        rows={12}
                        className="font-mono text-sm bg-background/50 border-2 border-border/50 focus:border-primary/50 resize-none"
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button 
                        onClick={handleSaveAnswer} 
                        variant="outline" 
                        className="flex-1 border-2"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Save Progress
                      </Button>
                      <Button 
                        onClick={handleSubmitForValidation}
                        disabled={!userAnswer.trim() || aiLoading}
                        className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white border-0"
                      >
                        {aiLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Validating...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            Submit Answer
                          </>
                        )}
                      </Button>
                    </div>

                    {/* Validation Result */}
                    {showValidation && validationResult && (
                      <Alert className={`border-2 ${validationResult.isCorrect ? "border-green-500 bg-green-50 dark:bg-green-950/20" : "border-red-500 bg-red-50 dark:bg-red-950/20"}`}>
                        <div className="flex items-start space-x-3">
                          {validationResult.isCorrect ? (
                            <CheckIcon className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
                          ) : (
                            <AlertCircle className="h-6 w-6 text-red-600 mt-0.5 flex-shrink-0" />
                          )}
                          <div className="space-y-3 flex-1">
                            <AlertDescription className={`font-semibold text-base ${validationResult.isCorrect ? "text-green-800 dark:text-green-200" : "text-red-800 dark:text-red-200"}`}>
                              {validationResult.isCorrect ? "✅ Excellent! Your answer is correct." : "❌ Your answer needs improvement."}
                            </AlertDescription>
                            <AlertDescription className={`${validationResult.isCorrect ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"}`}>
                              {validationResult.feedback}
                            </AlertDescription>
                            {!validationResult.isCorrect && validationResult.suggestedSolution && (
                              <div className="mt-4 p-4 bg-white dark:bg-background rounded-xl border-2 border-border/50">
                                <p className="font-semibold text-foreground mb-2 flex items-center gap-2">
                                  <Lightbulb className="h-4 w-4 text-yellow-500" />
                                  Suggested Solution:
                                </p>
                                <p className="text-foreground whitespace-pre-wrap leading-relaxed">{validationResult.suggestedSolution}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-2 border-dashed border-border/50">
                  <CardContent className="text-center py-12">
                    <div className="bg-muted/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <Star className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Sign in to solve questions</h3>
                    <p className="text-muted-foreground mb-6">
                      Create an account to track your progress and submit solutions
                    </p>
                    <Button 
                      onClick={() => navigate('/auth')}
                      className="bg-primary hover:bg-primary/90"
                    >
                      Sign In
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="notes" className="space-y-6 mt-6">
              {user ? (
                <Card className="border-2 border-border/50">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <FileText className="h-5 w-5 text-purple-600" />
                      Personal Notes
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <Textarea
                      placeholder="Add your notes, insights, key points, or approach here..."
                      value={userNotes}
                      onChange={(e) => setUserNotes(e.target.value)}
                      rows={8}
                      className="bg-background/50 border-2 border-border/50 focus:border-primary/50 resize-none"
                    />
                    <Button onClick={handleSaveAnswer} className="w-full bg-primary hover:bg-primary/90">
                      <FileText className="h-4 w-4 mr-2" />
                      Save Notes
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-2 border-dashed border-border/50">
                  <CardContent className="text-center py-12">
                    <div className="bg-muted/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Sign in to take notes</h3>
                    <p className="text-muted-foreground mb-6">
                      Keep track of your thoughts and insights for each question
                    </p>
                    <Button 
                      onClick={() => navigate('/auth')}
                      className="bg-primary hover:bg-primary/90"
                    >
                      Sign In
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* AI Assistance Sidebar */}
        <div className="space-y-6">
          {question.ai_hint && (
            <Card className="border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-600" />
                  AI Hint
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-yellow-800 dark:text-yellow-200 leading-relaxed">{question.ai_hint}</p>
              </CardContent>
            </Card>
          )}

          {question.ai_explanation && (
            <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Brain className="h-5 w-5 text-blue-600" />
                  AI Explanation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">{question.ai_explanation}</p>
              </CardContent>
            </Card>
          )}

          {/* Quick Stats */}
          <Card className="border-2 border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant={progress?.solved ? "default" : "secondary"}>
                  {progress?.solved ? "Solved" : "Unsolved"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Bookmarked</span>
                <Badge variant={progress?.bookmarked ? "default" : "outline"}>
                  {progress?.bookmarked ? "Yes" : "No"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Type</span>
                <Badge variant="outline">{question.question_type}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Difficulty</span>
                <Badge variant="outline" className={getDifficultyColor(question.difficulty)}>
                  {question.difficulty}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
