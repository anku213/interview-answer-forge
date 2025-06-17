
import { useState } from "react";
import { useSupabaseQuestions } from "@/hooks/useSupabaseQuestions";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Plus, BookOpen, Code, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { questions, loading } = useSupabaseQuestions();
  const navigate = useNavigate();

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

  const handleNavigateToQuestions = () => {
    navigate('/questions');
  };

  const stats = {
    totalQuestions: convertedQuestions.length,
    categories: new Set(convertedQuestions.map(q => q.category)).size,
    languages: new Set(convertedQuestions.map(q => q.language)).size,
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/30 border-t-primary mx-auto"></div>
            <p className="mt-4 text-lg font-medium text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="space-y-6 sm:space-y-8">
        {/* Welcome Header */}
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Welcome to Interview Prep
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg px-4">
            Master your coding interviews with organized questions and practice
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-primary font-semibold text-xs sm:text-sm uppercase tracking-wide">Total Questions</p>
                <p className="text-2xl sm:text-3xl font-bold text-primary">{stats.totalQuestions}</p>
              </div>
              <div className="bg-primary/10 p-2 sm:p-3 rounded-lg flex-shrink-0">
                <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20 rounded-xl p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-green-600 font-semibold text-xs sm:text-sm uppercase tracking-wide">Categories</p>
                <p className="text-2xl sm:text-3xl font-bold text-green-600">{stats.categories}</p>
              </div>
              <div className="bg-green-500/10 p-2 sm:p-3 rounded-lg flex-shrink-0">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 rounded-xl p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-purple-600 font-semibold text-xs sm:text-sm uppercase tracking-wide">Languages</p>
                <p className="text-2xl sm:text-3xl font-bold text-purple-600">{stats.languages}</p>
              </div>
              <div className="bg-purple-500/10 p-2 sm:p-3 rounded-lg flex-shrink-0">
                <Code className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-background/40 backdrop-blur-sm border border-border/30 rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4 sm:mb-6">Quick Actions</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-xl p-4 sm:p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-foreground mb-2">Manage Questions</h3>
              <p className="text-muted-foreground mb-4 text-sm sm:text-base">
                View, edit, and organize your interview questions collection
              </p>
              <Button onClick={handleNavigateToQuestions} className="w-full">
                <BookOpen className="h-4 w-4 mr-2" />
                Go to Questions
              </Button>
            </div>
            
            <div className="bg-gradient-to-br from-secondary/5 to-secondary/10 border border-secondary/20 rounded-xl p-4 sm:p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-foreground mb-2">Add New Question</h3>
              <p className="text-muted-foreground mb-4 text-sm sm:text-base">
                Create a new interview question with code examples and explanations
              </p>
              <Button onClick={handleNavigateToQuestions} variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Create Question
              </Button>
            </div>
          </div>
        </div>

        {/* Recent Activity or Empty State */}
        {convertedQuestions.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <div className="bg-muted/20 rounded-full w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">No questions yet</h3>
            <p className="text-muted-foreground mb-4 sm:mb-6 px-4">
              Start building your interview question collection to track your progress
            </p>
            <Button onClick={handleNavigateToQuestions} className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Question
            </Button>
          </div>
        ) : (
          <div className="bg-background/40 backdrop-blur-sm border border-border/30 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-4">Recent Questions</h2>
            <div className="space-y-3">
              {convertedQuestions.slice(0, 5).map((question) => (
                <div key={question.id} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium text-foreground truncate">{question.title}</h4>
                    <p className="text-sm text-muted-foreground truncate">
                      {question.category} • {question.language}
                    </p>
                  </div>
                  <Button size="sm" variant="outline" onClick={handleNavigateToQuestions} className="ml-2 flex-shrink-0">
                    View
                  </Button>
                </div>
              ))}
            </div>
            {convertedQuestions.length > 5 && (
              <div className="mt-4 text-center">
                <Button variant="ghost" onClick={handleNavigateToQuestions}>
                  View All Questions
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
