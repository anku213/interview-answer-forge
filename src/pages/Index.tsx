
import { useState } from "react";
import { Header } from "@/components/Header";
import { QuestionList } from "@/components/QuestionList";
import { QuestionEditor } from "@/components/QuestionEditor";
import { useQuestions } from "@/hooks/useQuestions";
import { Question } from "@/types/Question";

const Index = () => {
  const { questions, addQuestion, updateQuestion, deleteQuestion } = useQuestions();
  const [searchTerm, setSearchTerm] = useState("");
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

  const handleSaveQuestion = (questionData: Omit<Question, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingQuestion) {
      updateQuestion(editingQuestion.id, questionData);
    } else {
      addQuestion(questionData);
    }
    setIsEditing(false);
    setEditingQuestion(undefined);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingQuestion(undefined);
  };

  const handleDeleteQuestion = (id: string) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      deleteQuestion(id);
    }
  };

  return (
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
            questions={questions}
            onEdit={handleEditQuestion}
            onDelete={handleDeleteQuestion}
            searchTerm={searchTerm}
          />
        )}
      </main>
    </div>
  );
};

export default Index;
