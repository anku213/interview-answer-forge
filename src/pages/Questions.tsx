
import { useState, useEffect } from "react";
import { QuestionList } from "@/components/QuestionList";
import { QuestionEditor } from "@/components/QuestionEditor";
import { useSupabaseQuestions } from "@/hooks/useSupabaseQuestions";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, BookOpen, Target, Trophy, TrendingUp } from "lucide-react";
import { Question } from "@/types/Question";

interface QuestionsProps {
  searchTerm?: string;
}

const Questions = ({ searchTerm = "" }: QuestionsProps) => {
  const [showEditor, setShowEditor] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { user } = useAuth();
  const { questions: supabaseQuestions, loading, deleteQuestion } = useSupabaseQuestions();

  // Convert SupabaseQuestion to Question format
  const questions: Question[] = supabaseQuestions.map(q => ({
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

  const categoryStats = questions.reduce((acc, question) => {
    acc[question.category] = (acc[question.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="container mx-auto p-6 space-y-8">
        {/* Enhanced Header Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white p-8 shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-3 rounded-2xl">
                    <BookOpen className="h-8 w-8" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold">Question Bank</h1>
                    <p className="text-xl text-blue-100 mt-1">Master your interview skills</p>
                  </div>
                </div>
                
                <p className="text-lg text-blue-50 max-w-2xl leading-relaxed">
                  Practice coding questions, build your skills, and prepare for technical interviews. 
                  {searchTerm && ` Showing results for "${searchTerm}"`}
                </p>
              </div>
              
              <Button
                onClick={() => {
                  setEditingQuestion(null);
                  setShowEditor(true);
                }}
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all duration-200 px-8 py-4 text-lg font-semibold"
              >
                <Plus className="h-6 w-6 mr-2" />
                Add New Question
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="bg-blue-500 p-3 rounded-xl">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-800 mb-1">{questions.length}</div>
              <p className="text-sm text-blue-600 font-medium">Total Questions</p>
              <p className="text-xs text-blue-500 mt-1">Available to practice</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="bg-green-500 p-3 rounded-xl">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-800 mb-1">
                {Object.keys(categoryStats).length}
              </div>
              <p className="text-sm text-green-600 font-medium">Categories</p>
              <p className="text-xs text-green-500 mt-1">Different topics</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="bg-purple-500 p-3 rounded-xl">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-800 mb-1">
                {new Set(questions.map(q => q.language)).size}
              </div>
              <p className="text-sm text-purple-600 font-medium">Languages</p>
              <p className="text-xs text-purple-500 mt-1">Programming languages</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="bg-orange-500 p-3 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <TrendingUp className="h-5 w-5 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-800 mb-1">
                {Math.round((questions.length > 0 ? 1 : 0) * 100)}%
              </div>
              <p className="text-sm text-orange-600 font-medium">Progress</p>
              <p className="text-xs text-orange-500 mt-1">Questions completed</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        {showEditor ? (
          <Card className="shadow-xl border-0 bg-white">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
              <CardTitle className="text-2xl font-semibold text-gray-800">
                {editingQuestion ? 'Edit Question' : 'Create New Question'}
              </CardTitle>
              <CardDescription className="text-lg">
                {editingQuestion ? 'Update your existing question' : 'Add a new coding question to your collection'}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
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
              <CardTitle className="text-2xl font-semibold text-gray-800">Your Questions</CardTitle>
              <CardDescription className="text-lg">
                {filteredQuestions.length} question{filteredQuestions.length !== 1 ? 's' : ''} found
                {searchTerm && ` matching "${searchTerm}"`}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <span className="mt-4 text-lg font-medium text-gray-600">Loading questions...</span>
                    <p className="text-sm text-gray-500 mt-1">Preparing your question bank</p>
                  </div>
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
    </div>
  );
};

export default Questions;
