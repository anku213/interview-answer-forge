
import { useState, useEffect } from "react";
import { QuestionList } from "@/components/QuestionList";
import { QuestionEditor } from "@/components/QuestionEditor";
import { useSupabaseQuestions } from "@/hooks/useSupabaseQuestions";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, BookOpen, Target, Trophy } from "lucide-react";

interface QuestionsProps {
  searchTerm?: string;
}

const Questions = ({ searchTerm = "" }: QuestionsProps) => {
  const [showEditor, setShowEditor] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { user } = useAuth();
  const { questions, loading, deleteQuestion } = useSupabaseQuestions();

  // Filter questions based on search term and category
  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.answer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || question.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleRefetch = () => {
    // Since useSupabaseQuestions automatically refetches, we don't need to do anything here
    // The component will re-render when questions change
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Question Bank
          </h1>
          <p className="text-gray-600 max-w-2xl">
            Practice coding questions, build your skills, and prepare for technical interviews. 
            {searchTerm && ` Showing results for "${searchTerm}"`}
          </p>
        </div>
        
        <Button
          onClick={() => {
            setEditingQuestion(null);
            setShowEditor(true);
          }}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          size="lg"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add New Question
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-blue-700">
              <BookOpen className="h-5 w-5 mr-2" />
              Total Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-800">{questions.length}</div>
            <p className="text-sm text-blue-600 mt-1">Available to practice</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-green-700">
              <Target className="h-5 w-5 mr-2" />
              Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-800">
              {new Set(questions.map(q => q.category)).size}
            </div>
            <p className="text-sm text-green-600 mt-1">Different topics</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-purple-700">
              <Trophy className="h-5 w-5 mr-2" />
              Your Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-800">
              {Math.round((questions.length > 0 ? 1 : 0) * 100)}%
            </div>
            <p className="text-sm text-purple-600 mt-1">Questions completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      {showEditor ? (
        <Card className="shadow-xl border-0 bg-white">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
            <CardTitle className="text-xl font-semibold text-gray-800">
              {editingQuestion ? 'Edit Question' : 'Create New Question'}
            </CardTitle>
            <CardDescription>
              {editingQuestion ? 'Update your existing question' : 'Add a new coding question to your collection'}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <QuestionEditor
              question={editingQuestion}
              onSave={(question) => {
                handleRefetch();
                setShowEditor(false);
                setEditingQuestion(null);
              }}
              onCancel={() => {
                setShowEditor(false);
                setEditingQuestion(null);
              }}
            />
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-xl border-0 bg-white">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl font-semibold text-gray-800">Your Questions</CardTitle>
                <CardDescription>
                  {filteredQuestions.length} question{filteredQuestions.length !== 1 ? 's' : ''} found
                  {searchTerm && ` matching "${searchTerm}"`}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-gray-600">Loading questions...</span>
              </div>
            ) : (
              <QuestionList
                questions={filteredQuestions}
                onEdit={(question) => {
                  setEditingQuestion(question);
                  setShowEditor(true);
                }}
                onDelete={deleteQuestion}
                searchTerm={searchTerm}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Questions;
