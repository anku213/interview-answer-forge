
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
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Welcome to Interview Prep
          </h1>
          <p className="text-muted-foreground text-lg">
            Master your coding interviews with organized questions and practice
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary font-semibold text-sm uppercase tracking-wide">Total Questions</p>
                <p className="text-3xl font-bold text-primary">{stats.totalQuestions}</p>
              </div>
              <div className="bg-primary/10 p-3 rounded-lg">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 font-semibold text-sm uppercase tracking-wide">Categories</p>
                <p className="text-3xl font-bold text-green-600">{stats.categories}</p>
              </div>
              <div className="bg-green-500/10 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 font-semibold text-sm uppercase tracking-wide">Languages</p>
                <p className="text-3xl font-bold text-purple-600">{stats.languages}</p>
              </div>
              <div className="bg-purple-500/10 p-3 rounded-lg">
                <Code className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-background/40 backdrop-blur-sm border border-border/30 rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-foreground mb-6">Quick Actions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-foreground mb-2">Manage Questions</h3>
              <p className="text-muted-foreground mb-4">
                View, edit, and organize your interview questions collection
              </p>
              <Button onClick={handleNavigateToQuestions} className="w-full">
                <BookOpen className="h-4 w-4 mr-2" />
                Go to Questions
              </Button>
            </div>
            
            <div className="bg-gradient-to-br from-secondary/5 to-secondary/10 border border-secondary/20 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-foreground mb-2">Add New Question</h3>
              <p className="text-muted-foreground mb-4">
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
          <div className="text-center py-12">
            <div className="bg-muted/20 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No questions yet</h3>
            <p className="text-muted-foreground mb-6">
              Start building your interview question collection to track your progress
            </p>
            <Button onClick={handleNavigateToQuestions}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Question
            </Button>
          </div>
        ) : (
          <div className="bg-background/40 backdrop-blur-sm border border-border/30 rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Recent Questions</h2>
            <div className="space-y-3">
              {convertedQuestions.slice(0, 5).map((question) => (
                <div key={question.id} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                  <div>
                    <h4 className="font-medium text-foreground">{question.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {question.category} • {question.language}
                    </p>
                  </div>
                  <Button size="sm" variant="outline" onClick={handleNavigateToQuestions}>
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
