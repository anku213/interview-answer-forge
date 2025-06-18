
import { useState } from "react";
import { QuestionList } from "@/components/QuestionList";
import { QuestionEditor } from "@/components/QuestionEditor";
import { useSupabaseQuestions } from "@/hooks/useSupabaseQuestions";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Question } from "@/types/Question";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, BookOpen, Code, Target, TrendingUp, Zap, Star, Filter } from "lucide-react";

const Questions = () => {
  const { questions, loading, addQuestion, updateQuestion, deleteQuestion } = useSupabaseQuestions();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isEditing, setIsEditing] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | undefined>();

  const handleNewQuestion = () => {
    setEditingQuestion(undefined);
    setIsEditing(true);
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setIsEditing(true);
  };

  const handleSaveQuestion = async (questionData: Omit<Question, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    const supabaseQuestionData = {
      title: questionData.title,
      answer: questionData.answer,
      code: questionData.code,
      language: questionData.language,
      category: questionData.category
    };

    if (editingQuestion) {
      await updateQuestion(editingQuestion.id, supabaseQuestionData);
    } else {
      await addQuestion(supabaseQuestionData);
    }
    setIsEditing(false);
    setEditingQuestion(undefined);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingQuestion(undefined);
  };

  const handleDeleteQuestion = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      await deleteQuestion(id);
    }
  };

  // Convert SupabaseQuestion to Question format for existing components
  const convertedQuestions: Question[] = questions.map(q => ({
    id: q.id,
    title: q.title,
    answer: q.answer,
    code: q.code,
    language: q.language,
    category: q.category,
    createdAt: q.created_at,
    updatedAt: q.updated_at,
    userId: q.user_id
  }));

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/30 border-t-primary mx-auto"></div>
              <Code className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-primary" />
            </div>
            <p className="mt-6 text-xl font-semibold text-foreground">Loading Questions</p>
            <p className="text-sm text-muted-foreground">Preparing your question collection...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="space-y-8">
        {/* Enhanced Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-50 via-green-50/30 to-white dark:from-green-950/20 dark:via-green-950/10 dark:to-background border border-green-200/50 dark:border-green-800/30 p-8">
          <div className="absolute top-4 right-4 opacity-10">
            <BookOpen className="h-32 w-32 text-green-600" />
          </div>
          <div className="relative">
            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="bg-green-500/20 p-3 rounded-2xl">
                    <Target className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
                      Question Management
                    </h1>
                    <p className="text-lg text-muted-foreground mt-1">
                      Manage your collection of {convertedQuestions.length} interview questions
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap gap-4">
                  <Badge variant="secondary" className="px-4 py-2 text-sm bg-white/60 dark:bg-white/10">
                    <BookOpen className="h-4 w-4 mr-2" />
                    {convertedQuestions.length} Questions
                  </Badge>
                  <Badge variant="secondary" className="px-4 py-2 text-sm bg-white/60 dark:bg-white/10">
                    <Code className="h-4 w-4 mr-2" />
                    {new Set(convertedQuestions.map(q => q.language)).size} Languages
                  </Badge>
                  <Badge variant="outline" className="px-4 py-2 text-sm border-green-300 dark:border-green-700">
                    <Star className="h-4 w-4 mr-2" />
                    Active Collection
                  </Badge>
                </div>
              </div>
              
              <Button 
                onClick={handleNewQuestion}
                className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto px-8 py-3"
                size="lg"
              >
                <div className="bg-white/20 p-1 rounded mr-3">
                  <Plus className="h-4 w-4" />
                </div>
                New Question
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Search */}
        <Card className="bg-gradient-to-r from-background via-background to-muted/10 border-2 border-border/50">
          <CardContent className="p-6">
            <div className="relative max-w-2xl mx-auto">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <Search className="text-muted-foreground h-5 w-5" />
              </div>
              <Input
                placeholder="Search questions by title, content, language, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-4 text-lg bg-background/50 border-2 border-border/50 focus:border-primary/50 rounded-xl transition-all duration-300"
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <Badge variant="outline" className="text-xs">
                  <Filter className="h-3 w-3 mr-1" />
                  Smart Search
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Area */}
        {isEditing ? (
          <Card className="bg-gradient-to-br from-background via-background to-muted/5 border-2 border-border/50 shadow-2xl">
            <CardHeader className="border-b border-border/50">
              <CardTitle className="text-2xl flex items-center">
                <div className="bg-primary/20 p-2 rounded-xl mr-3">
                  <Code className="h-6 w-6 text-primary" />
                </div>
                {editingQuestion ? 'Edit Question' : 'Create New Question'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <QuestionEditor
                question={editingQuestion}
                onSave={handleSaveQuestion}
                onCancel={handleCancelEdit}
              />
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-gradient-to-br from-background via-background to-muted/5 border-2 border-border/30 shadow-lg">
            <CardContent className="p-8">
              <QuestionList
                questions={convertedQuestions}
                onEdit={handleEditQuestion}
                onDelete={handleDeleteQuestion}
                searchTerm={searchTerm}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default Questions;
