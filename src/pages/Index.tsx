
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { QuestionList } from "@/components/QuestionList";
import { QuestionEditor } from "@/components/QuestionEditor";
import { useSupabaseQuestions, SupabaseQuestion } from "@/hooks/useSupabaseQuestions";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Question } from "@/types/Question";

const Index = () => {
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
    // Convert Question format to SupabaseQuestion format for the API
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
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/30 border-t-primary mx-auto"></div>
            <p className="mt-4 text-lg font-medium text-muted-foreground">Loading your questions...</p>
            <p className="text-sm text-muted-foreground/70">Setting up your interview prep workspace</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
        <Header
          onNewQuestion={handleNewQuestion}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
        
        <main className="container mx-auto px-6 py-8">
          {isEditing ? (
            <div className="max-w-6xl mx-auto">
              <div className="bg-background/60 backdrop-blur-sm border border-border/50 rounded-2xl shadow-xl p-8">
                <QuestionEditor
                  question={editingQuestion}
                  onSave={handleSaveQuestion}
                  onCancel={handleCancelEdit}
                />
              </div>
            </div>
          ) : (
            <div className="max-w-7xl mx-auto">
              {/* Dashboard Header */}
              <div className="mb-8">
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-bold text-foreground mb-2">
                    Your Interview Questions
                  </h2>
                  <p className="text-muted-foreground text-lg">
                    {convertedQuestions.length === 0 
                      ? "Start building your interview question collection" 
                      : `Manage your collection of ${convertedQuestions.length} interview questions`
                    }
                  </p>
                </div>
                
                {/* Stats Cards */}
                {convertedQuestions.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-primary font-semibold text-sm uppercase tracking-wide">Total Questions</p>
                          <p className="text-3xl font-bold text-primary">{convertedQuestions.length}</p>
                        </div>
                        <div className="bg-primary/10 p-3 rounded-lg">
                          <span className="text-2xl">📚</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20 rounded-xl p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-green-600 font-semibold text-sm uppercase tracking-wide">Categories</p>
                          <p className="text-3xl font-bold text-green-600">
                            {new Set(convertedQuestions.map(q => q.category)).size}
                          </p>
                        </div>
                        <div className="bg-green-500/10 p-3 rounded-lg">
                          <span className="text-2xl">🏷️</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 rounded-xl p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-purple-600 font-semibold text-sm uppercase tracking-wide">Languages</p>
                          <p className="text-3xl font-bold text-purple-600">
                            {new Set(convertedQuestions.map(q => q.language)).size}
                          </p>
                        </div>
                        <div className="bg-purple-500/10 p-3 rounded-lg">
                          <span className="text-2xl">💻</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Questions List */}
              <div className="bg-background/40 backdrop-blur-sm border border-border/30 rounded-2xl shadow-lg p-6">
                <QuestionList
                  questions={convertedQuestions}
                  onEdit={handleEditQuestion}
                  onDelete={handleDeleteQuestion}
                  searchTerm={searchTerm}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                />
              </div>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default Index;
