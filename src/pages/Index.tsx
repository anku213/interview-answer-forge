
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { QuestionList } from "@/components/QuestionList";
import { QuestionEditor } from "@/components/QuestionEditor";
import { useSupabaseQuestions, SupabaseQuestion } from "@/hooks/useSupabaseQuestions";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const Index = () => {
  const { questions, loading, addQuestion, updateQuestion, deleteQuestion } = useSupabaseQuestions();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isEditing, setIsEditing] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<SupabaseQuestion | undefined>();

  const handleNewQuestion = () => {
    setEditingQuestion(undefined);
    setIsEditing(true);
  };

  const handleEditQuestion = (question: SupabaseQuestion) => {
    setEditingQuestion(question);
    setIsEditing(true);
  };

  const handleSaveQuestion = async (questionData: Omit<SupabaseQuestion, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    if (editingQuestion) {
      await updateQuestion(editingQuestion.id, questionData);
    } else {
      await addQuestion(questionData);
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
  const convertedQuestions = questions.map(q => ({
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
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading questions...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Header
          onNewQuestion={handleNewQuestion}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
        
        <main className="container mx-auto px-6 py-6">
          {isEditing ? (
            <QuestionEditor
              question={editingQuestion}
              onSave={handleSaveQuestion}
              onCancel={handleCancelEdit}
            />
          ) : (
            <QuestionList
              questions={convertedQuestions}
              onEdit={handleEditQuestion}
              onDelete={handleDeleteQuestion}
              searchTerm={searchTerm}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default Index;
