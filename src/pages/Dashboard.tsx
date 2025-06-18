import { useState } from "react";
import { useSupabaseQuestions } from "@/hooks/useSupabaseQuestions";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  BookOpen, 
  Code, 
  TrendingUp, 
  Target, 
  Flame, 
  Lightbulb, 
  MessageSquare, 
  Bookmark, 
  Play, 
  Clock,
  Trophy,
  Star,
  Zap,
  CheckCircle2,
  Calendar,
  Brain,
  Users
} from "lucide-react";
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

  const handleNavigateToAIInterview = () => {
    navigate('/ai-interview');
  };

  // Mock data for demo purposes - in real app, this would come from actual user data
  const stats = {
    totalQuestions: convertedQuestions.length,
    questionsSolved: Math.floor(convertedQuestions.length * 0.7), // 70% solved
    interviewsCompleted: 3,
    bookmarkedItems: Math.floor(convertedQuestions.length * 0.3),
    categories: new Set(convertedQuestions.map(q => q.category)).size,
    languages: new Set(convertedQuestions.map(q => q.language)).size,
    dailyGoalProgress: 60, // 60% of daily goal completed
    interviewPrepCompletion: 45, // 45% overall completion
    aiInterviewParticipation: 75, // 75% AI interview participation
    currentStreak: 5,
  };

  const recentActivities = [
    { id: 1, action: "Solved a JavaScript question", time: "2 hours ago", icon: Code },
    { id: 2, action: "Completed AI Interview on React", time: "1 day ago", icon: MessageSquare },
    { id: 3, action: "Bookmarked Array Algorithms", time: "2 days ago", icon: Bookmark },
    { id: 4, action: "Started Python practice session", time: "3 days ago", icon: Play },
  ];

  const motivationalTip = "Consistency beats intensity. Practice a little every day to build your coding skills!";

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/30 border-t-primary mx-auto"></div>
              <Brain className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-primary" />
            </div>
            <p className="mt-6 text-xl font-semibold text-foreground">Loading Dashboard</p>
            <p className="text-sm text-muted-foreground">Preparing your interview prep workspace...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="space-y-8">
        {/* Enhanced Welcome Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 p-8">
          <div className="absolute top-4 right-4 opacity-20">
            <Trophy className="h-24 w-24 text-primary" />
          </div>
          <div className="relative">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-primary/20 p-3 rounded-2xl">
                <Code className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Welcome to Interview Prep
                </h1>
                <p className="text-lg text-muted-foreground mt-1">
                  Your personalized dashboard for mastering coding interviews
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-6 mt-6">
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                <Calendar className="h-4 w-4 mr-2" />
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </Badge>
              <Badge variant="outline" className="px-4 py-2 text-sm border-primary/30">
                <Users className="h-4 w-4 mr-2" />
                Active Learner
              </Badge>
            </div>
          </div>
        </div>

        {/* Enhanced Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-blue-50/50 to-white dark:from-blue-950/50 dark:via-blue-950/30 dark:to-background border-blue-200/50 dark:border-blue-800/50 hover:shadow-lg transition-all duration-300 group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full -mr-10 -mt-10"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wide">
                Total Questions
              </CardTitle>
              <div className="bg-blue-500/20 p-2 rounded-xl group-hover:scale-110 transition-transform">
                <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900 dark:text-blue-100 mb-1">
                {stats.totalQuestions}
              </div>
              <p className="text-sm text-blue-600 dark:text-blue-400 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                In your collection
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-green-50 via-green-50/50 to-white dark:from-green-950/50 dark:via-green-950/30 dark:to-background border-green-200/50 dark:border-green-800/50 hover:shadow-lg transition-all duration-300 group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full -mr-10 -mt-10"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-green-700 dark:text-green-300 uppercase tracking-wide">
                Questions Solved
              </CardTitle>
              <div className="bg-green-500/20 p-2 rounded-xl group-hover:scale-110 transition-transform">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-900 dark:text-green-100 mb-1">
                {stats.questionsSolved}
              </div>
              <p className="text-sm text-green-600 dark:text-green-400 flex items-center">
                <Target className="h-3 w-3 mr-1" />
                Successfully completed
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-purple-50/50 to-white dark:from-purple-950/50 dark:via-purple-950/30 dark:to-background border-purple-200/50 dark:border-purple-800/50 hover:shadow-lg transition-all duration-300 group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full -mr-10 -mt-10"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-purple-700 dark:text-purple-300 uppercase tracking-wide">
                AI Interviews
              </CardTitle>
              <div className="bg-purple-500/20 p-2 rounded-xl group-hover:scale-110 transition-transform">
                <Brain className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-900 dark:text-purple-100 mb-1">
                {stats.interviewsCompleted}
              </div>
              <p className="text-sm text-purple-600 dark:text-purple-400 flex items-center">
                <MessageSquare className="h-3 w-3 mr-1" />
                Completed sessions
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-orange-50/50 to-white dark:from-orange-950/50 dark:via-orange-950/30 dark:to-background border-orange-200/50 dark:border-orange-800/50 hover:shadow-lg transition-all duration-300 group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/10 rounded-full -mr-10 -mt-10"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-orange-700 dark:text-orange-300 uppercase tracking-wide">
                Bookmarked
              </CardTitle>
              <div className="bg-orange-500/20 p-2 rounded-xl group-hover:scale-110 transition-transform">
                <Star className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-900 dark:text-orange-100 mb-1">
                {stats.bookmarkedItems}
              </div>
              <p className="text-sm text-orange-600 dark:text-orange-400 flex items-center">
                <Bookmark className="h-3 w-3 mr-1" />
                Saved for later
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Progress Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-background to-muted/20 border-2 border-border/50 hover:border-primary/30 transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl flex items-center">
                <div className="bg-primary/10 p-2 rounded-lg mr-3">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                Interview Prep Completion
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Overall Progress</span>
                <Badge variant="secondary" className="font-semibold">
                  {stats.interviewPrepCompletion}%
                </Badge>
              </div>
              <Progress value={stats.interviewPrepCompletion} className="h-3 bg-muted" />
              <p className="text-sm text-muted-foreground flex items-center">
                <Zap className="h-3 w-3 mr-1 text-yellow-500" />
                Keep going! You're making great progress.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-background to-muted/20 border-2 border-border/50 hover:border-primary/30 transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl flex items-center">
                <div className="bg-blue-500/10 p-2 rounded-lg mr-3">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                Daily Goal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Today's Target</span>
                <Badge variant="secondary" className="font-semibold">
                  {stats.dailyGoalProgress}%
                </Badge>
              </div>
              <Progress value={stats.dailyGoalProgress} className="h-3 bg-muted" />
              <p className="text-sm text-muted-foreground flex items-center">
                <Zap className="h-3 w-3 mr-1 text-yellow-500" />
                {100 - stats.dailyGoalProgress === 100 ? "Start your daily goal!" : `${Math.ceil((100 - stats.dailyGoalProgress) / (100 / (convertedQuestions.length > 0 ? convertedQuestions.length : 1)))} more questions to reach today's goal!`}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-background to-muted/20 border-2 border-border/50 hover:border-primary/30 transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl flex items-center">
                <div className="bg-purple-500/10 p-2 rounded-lg mr-3">
                  <Brain className="h-5 w-5 text-purple-600" />
                </div>
                AI Interview Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Participation Rate</span>
                <Badge variant="secondary" className="font-semibold">
                  {stats.aiInterviewParticipation}%
                </Badge>
              </div>
              <Progress value={stats.aiInterviewParticipation} className="h-3 bg-muted" />
              <p className="text-sm text-muted-foreground flex items-center">
                <Zap className="h-3 w-3 mr-1 text-yellow-500" />
                Excellent AI interview engagement!
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Quick Actions and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-primary/5 to-primary/2 border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <div className="bg-primary/20 p-2 rounded-xl mr-3">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={handleNavigateToAIInterview} 
                className="w-full justify-start bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-white shadow-lg hover:shadow-xl transition-all duration-300" 
                size="lg"
              >
                <div className="bg-white/20 p-1 rounded mr-3">
                  <Brain className="h-4 w-4" />
                </div>
                Start AI Interview
                <div className="ml-auto bg-white/20 px-2 py-1 rounded text-xs">New</div>
              </Button>
              <Button 
                onClick={handleNavigateToQuestions} 
                variant="outline" 
                className="w-full justify-start border-2 hover:bg-muted/50 hover:border-primary/50 transition-all duration-300" 
                size="lg"
              >
                <div className="bg-primary/10 p-1 rounded mr-3">
                  <BookOpen className="h-4 w-4 text-primary" />
                </div>
                Practice Questions
              </Button>
              <Button 
                onClick={() => navigate('/company-questions')} 
                variant="outline" 
                className="w-full justify-start border-2 hover:bg-muted/50 hover:border-primary/50 transition-all duration-300" 
                size="lg"
              >
                <div className="bg-purple/10 p-1 rounded mr-3">
                  <Users className="h-4 w-4 text-purple-600" />
                </div>
                Company Questions
              </Button>
            </CardContent>
          </Card>

          {/* Enhanced Recent Activity */}
          <Card className="bg-gradient-to-br from-background to-muted/10">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <div className="bg-green-500/20 p-2 rounded-xl mr-3">
                  <Clock className="h-6 w-6 text-green-600" />
                </div>
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4 p-4 bg-gradient-to-r from-muted/30 to-muted/10 rounded-xl border border-border/50 hover:border-primary/30 transition-all duration-300">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <activity.icon className="h-5 w-5 text-primary flex-shrink-0" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">{activity.action}</p>
                      <p className="text-xs text-muted-foreground flex items-center mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        {activity.time}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Active
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Streak Counter and Motivational Tip */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border-orange-200 dark:border-orange-800">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <Flame className="h-5 w-5 text-orange-500 mr-2" />
                Learning Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                  {stats.currentStreak}
                </div>
                <p className="text-lg font-medium text-orange-700 dark:text-orange-300">Days</p>
                <p className="text-sm text-muted-foreground mt-2">Keep it up! You're on fire! 🔥</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <Lightbulb className="h-5 w-5 text-yellow-500 mr-2" />
                Tip of the Day
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground italic">"{motivationalTip}"</p>
              <div className="mt-3 flex justify-end">
                <Button variant="ghost" size="sm" className="text-xs">
                  Get Another Tip
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Questions Preview */}
        {convertedQuestions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Recent Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {convertedQuestions.slice(0, 3).map((question) => (
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
              {convertedQuestions.length > 3 && (
                <div className="mt-4 text-center">
                  <Button variant="ghost" onClick={handleNavigateToQuestions}>
                    View All Questions ({convertedQuestions.length})
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {convertedQuestions.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <div className="bg-muted/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Ready to start your journey?</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Create your first question to begin building your interview preparation collection and track your progress.
              </p>
              <Button onClick={handleNavigateToQuestions} size="lg">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Question
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
