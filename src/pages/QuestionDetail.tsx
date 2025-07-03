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
  const { companyId, questionId, id } = useParams<{ companyId?: string; questionId?: string; id?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const companyName = location.state?.companyName || "Company";
  const { user } = useAuth();
  
  // Determine if this is a company question or regular question
  const isCompanyQuestion = Boolean(companyId && questionId);
  const actualQuestionId = isCompanyQuestion ? questionId : id;
  
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

  const question = questions.find(q => q.id === actualQuestionId);
  const progress = actualQuestionId ? userProgress[actualQuestionId] : undefined;

  useEffect(() => {
    if (progress) {
      setUserAnswer(progress.user_answer || "");
      setUserNotes(progress.notes || "");
    }
  }, [progress]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/20 dark:text-green-400 dark:border-green-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-700';
      case 'Hard': return 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/20 dark:text-red-400 dark:border-red-700';
      default: return 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600';
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
    if (!actualQuestionId) return;
    updateUserProgress(actualQuestionId, {
      bookmarked: !progress?.bookmarked
    });
  };

  const handleSolvedToggle = () => {
    if (!actualQuestionId) return;
    updateUserProgress(actualQuestionId, {
      solved: !progress?.solved
    });
  };

  const handleSaveAnswer = () => {
    if (!actualQuestionId) return;
    updateUserProgress(actualQuestionId, {
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

  const handleBackNavigation = () => {
    if (isCompanyQuestion) {
      navigate(`/company-questions/${companyId}`, { state: { companyName } });
    } else {
      navigate('/questions');
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
              onClick={handleBackNavigation}
              className="bg-primary hover:bg-primary/90"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {isCompanyQuestion ? 'Back to Questions' : 'Back to Questions'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto py-8 max-w-7xl space-y-8">
        {/* Modern Header */}
        <div className="relative overflow-hidden rounded-3xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-cyan-500/5"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-full blur-3xl"></div>
          
          <div className="relative p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                <Button 
                  variant="ghost" 
                  onClick={handleBackNavigation}
                  className="p-3 bg-white/50 hover:bg-white/80 dark:bg-slate-700/50 dark:hover:bg-slate-700/80 rounded-xl border border-slate-200/50 dark:border-slate-600/50 shadow-sm"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-2xl shadow-lg">
                  {getTypeIcon(question.question_type)}
                  <div className="text-white text-xs mt-1 font-medium">
                    {question.question_type}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center flex-wrap gap-2">
                    {isCompanyQuestion && (
                      <Badge variant="outline" className="px-3 py-1 bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800">
                        {companyName}
                      </Badge>
                    )}
                    <Badge 
                      variant="outline" 
                      className={`px-3 py-1 border-2 font-medium ${getDifficultyColor(question.difficulty)}`}
                    >
                      {question.difficulty}
                    </Badge>
                    <Badge variant="outline" className="px-3 py-1 bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600">
                      <span className="mr-1">{getTypeIcon(question.question_type)}</span>
                      {question.question_type}
                    </Badge>
                  </div>
                  
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                    {question.title}
                  </h1>
                  
                  {question.tags && question.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {question.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs px-2 py-1 bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  )}
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
                        ? "bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-700" 
                        : "bg-white/50 hover:bg-blue-50 border-slate-200 dark:bg-slate-700/50 dark:hover:bg-blue-900/20 dark:border-slate-600"
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
                        ? "bg-green-100 text-green-700 border-green-300 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700" 
                        : "bg-white/50 hover:bg-green-50 border-slate-200 dark:bg-slate-700/50 dark:hover:bg-green-900/20 dark:border-slate-600"
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
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Solving
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Question Content - 3/4 width */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
                <TabsTrigger value="question" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                  <Eye className="h-4 w-4" />
                  Question
                </TabsTrigger>
                <TabsTrigger value="solve" className="flex items-center gap-2 data-[state=active]:bg-green-500 data-[state=active]:text-white">
                  <Code className="h-4 w-4" />
                  Solve
                </TabsTrigger>
                <TabsTrigger value="notes" className="flex items-center gap-2 data-[state=active]:bg-purple-500 data-[state=active]:text-white">
                  <FileText className="h-4 w-4" />
                  Notes
                </TabsTrigger>
              </TabsList>

              <TabsContent value="question" className="space-y-6 mt-6">
                <Card className="border-2 border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-b border-slate-200/50 dark:border-slate-700/50">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      Question Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="prose prose-lg max-w-none dark:prose-invert prose-slate">
                      <div className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                        {question.content}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              
              <TabsContent value="solve" className="space-y-6 mt-6">
                {user ? (
                  <Card className="border-2 border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-b border-slate-200/50 dark:border-slate-700/50">
                      <CardTitle className="text-xl flex items-center gap-2">
                        <Zap className="h-5 w-5 text-green-600 dark:text-green-400" />
                        Your Solution
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                      <div className="space-y-4">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Write your answer below:</label>
                        <Textarea
                          placeholder="Start typing your solution here..."
                          value={userAnswer}
                          onChange={(e) => setUserAnswer(e.target.value)}
                          rows={12}
                          className="font-mono text-sm bg-slate-50/50 dark:bg-slate-900/50 border-2 border-slate-200/50 dark:border-slate-700/50 focus:border-blue-500/50 dark:focus:border-blue-400/50 resize-none rounded-xl"
                        />
                      </div>
                      
                      <Separator className="bg-slate-200 dark:bg-slate-700" />
                      
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button 
                          onClick={handleSaveAnswer} 
                          variant="outline" 
                          className="flex-1 border-2 bg-white/50 dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Save Progress
                        </Button>
                        <Button 
                          onClick={handleSubmitForValidation}
                          disabled={!userAnswer.trim() || aiLoading}
                          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
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
                        <Alert className={`border-2 rounded-xl ${validationResult.isCorrect ? "border-green-500 bg-green-50 dark:bg-green-950/20" : "border-red-500 bg-red-50 dark:bg-red-950/20"}`}>
                          <div className="flex items-start space-x-3">
                            {validationResult.isCorrect ? (
                              <CheckIcon className="h-6 w-6 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                            ) : (
                              <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                            )}
                            <div className="space-y-3 flex-1">
                              <AlertDescription className={`font-semibold text-base ${validationResult.isCorrect ? "text-green-800 dark:text-green-200" : "text-red-800 dark:text-red-200"}`}>
                                {validationResult.isCorrect ? "✅ Excellent! Your answer is correct." : "❌ Your answer needs improvement."}
                              </AlertDescription>
                              <AlertDescription className={`${validationResult.isCorrect ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"}`}>
                                {validationResult.feedback}
                              </AlertDescription>
                              {!validationResult.isCorrect && validationResult.suggestedSolution && (
                                <div className="mt-4 p-4 bg-white dark:bg-slate-800 rounded-xl border-2 border-slate-200/50 dark:border-slate-700/50">
                                  <p className="font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                                    <Lightbulb className="h-4 w-4 text-yellow-500" />
                                    Suggested Solution:
                                  </p>
                                  <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap leading-relaxed">{validationResult.suggestedSolution}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </Alert>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="border-2 border-dashed border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50">
                    <CardContent className="text-center py-12">
                      <div className="bg-slate-100 dark:bg-slate-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <Star className="h-8 w-8 text-slate-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">Sign in to solve questions</h3>
                      <p className="text-slate-500 dark:text-slate-400 mb-6">
                        Create an account to track your progress and submit solutions
                      </p>
                      <Button 
                        onClick={() => navigate('/auth')}
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        Sign In
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="notes" className="space-y-6 mt-6">
                {user ? (
                  <Card className="border-2 border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-b border-slate-200/50 dark:border-slate-700/50">
                      <CardTitle className="text-xl flex items-center gap-2">
                        <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        Personal Notes
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 space-y-4">
                      <Textarea
                        placeholder="Add your notes, insights, key points, or approach here..."
                        value={userNotes}
                        onChange={(e) => setUserNotes(e.target.value)}
                        rows={8}
                        className="bg-slate-50/50 dark:bg-slate-900/50 border-2 border-slate-200/50 dark:border-slate-700/50 focus:border-purple-500/50 dark:focus:border-purple-400/50 resize-none rounded-xl"
                      />
                      <Button onClick={handleSaveAnswer} className="w-full bg-purple-500 hover:bg-purple-600 text-white">
                        <FileText className="h-4 w-4 mr-2" />
                        Save Notes
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="border-2 border-dashed border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50">
                    <CardContent className="text-center py-12">
                      <div className="bg-slate-100 dark:bg-slate-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <FileText className="h-8 w-8 text-slate-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">Sign in to take notes</h3>
                      <p className="text-slate-500 dark:text-slate-400 mb-6">
                        Keep track of your thoughts and insights for each question
                      </p>
                      <Button 
                        onClick={() => navigate('/auth')}
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        Sign In
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* AI Assistance Sidebar - 1/4 width */}
          <div className="space-y-6">
            {question.ai_hint && (
              <Card className="border-2 border-yellow-200 dark:border-yellow-700/50 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                    AI Hint
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-yellow-800 dark:text-yellow-200 leading-relaxed">{question.ai_hint}</p>
                </CardContent>
              </Card>
            )}

            {question.ai_explanation && (
              <Card className="border-2 border-blue-200 dark:border-blue-700/50 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Brain className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    AI Explanation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">{question.ai_explanation}</p>
                </CardContent>
              </Card>
            )}

            {/* Quick Stats */}
            <Card className="border-2 border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Status</span>
                  <Badge variant={progress?.solved ? "default" : "secondary"} className={progress?.solved ? "bg-green-500" : ""}>
                    {progress?.solved ? "Solved" : "Unsolved"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Bookmarked</span>
                  <Badge variant={progress?.bookmarked ? "default" : "outline"} className={progress?.bookmarked ? "bg-blue-500" : ""}>
                    {progress?.bookmarked ? "Yes" : "No"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Type</span>
                  <Badge variant="outline">{question.question_type}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Difficulty</span>
                  <Badge variant="outline" className={getDifficultyColor(question.difficulty)}>
                    {question.difficulty}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
