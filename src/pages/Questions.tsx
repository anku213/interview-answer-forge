
import { useState } from "react";
import { QuestionList } from "@/components/QuestionList";
import { QuestionEditor } from "@/components/QuestionEditor";
import { useSupabaseQuestions } from "@/hooks/useSupabaseQuestions";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Question } from "@/types/Question";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";

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
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/30 border-t-primary mx-auto"></div>
            <p className="mt-4 text-lg font-medium text-muted-foreground">Loading questions...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="space-y-4 sm:space-y-6">
        {/* Question Module Header */}
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground truncate">Question Management</h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Manage your collection of {convertedQuestions.length} interview questions
            </p>
          </div>
          
          <Button 
            onClick={handleNewQuestion}
            className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-primary-foreground w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Question
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
          />
        </div>

        {/* Content Area */}
        {isEditing ? (
          <div className="bg-background/60 backdrop-blur-sm border border-border/50 rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8">
            <QuestionEditor
              question={editingQuestion}
              onSave={handleSaveQuestion}
              onCancel={handleCancelEdit}
            />
          </div>
        ) : (
          <div className="bg-background/40 backdrop-blur-sm border border-border/30 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
            <QuestionList
              questions={convertedQuestions}
              onEdit={handleEditQuestion}
              onDelete={handleDeleteQuestion}
              searchTerm={searchTerm}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default Questions;
