
import { useState } from "react";
import { useSupabaseQuestions } from "@/hooks/useSupabaseQuestions";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Plus, BookOpen, Code, TrendingUp, Target, Flame, Lightbulb, MessageSquare, Bookmark, Play, Clock } from "lucide-react";
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
            Your personalized dashboard for mastering coding interviews
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Questions</CardTitle>
              <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.totalQuestions}</div>
              <p className="text-xs text-blue-600 dark:text-blue-400">In your collection</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Questions Solved</CardTitle>
              <Target className="h-4 w-4 text-green-600 dark:text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900 dark:text-green-100">{stats.questionsSolved}</div>
              <p className="text-xs text-green-600 dark:text-green-400">Successfully completed</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">AI Interviews</CardTitle>
              <MessageSquare className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">{stats.interviewsCompleted}</div>
              <p className="text-xs text-purple-600 dark:text-purple-400">Completed sessions</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">Bookmarked</CardTitle>
              <Bookmark className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">{stats.bookmarkedItems}</div>
              <p className="text-xs text-orange-600 dark:text-orange-400">Saved for later</p>
            </CardContent>
          </Card>
        </div>

        {/* Progress Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Interview Prep Completion</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Overall Progress</span>
                <span className="text-sm font-medium">{stats.interviewPrepCompletion}%</span>
              </div>
              <Progress value={stats.interviewPrepCompletion} className="h-3" />
              <p className="text-xs text-muted-foreground">Keep going! You're making great progress.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Daily Goal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Today's Target</span>
                <span className="text-sm font-medium">{stats.dailyGoalProgress}%</span>
              </div>
              <Progress value={stats.dailyGoalProgress} className="h-3" />
              <p className="text-xs text-muted-foreground">2 more questions to reach today's goal!</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">AI Interview Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Participation Rate</span>
                <span className="text-sm font-medium">{stats.aiInterviewParticipation}%</span>
              </div>
              <Progress value={stats.aiInterviewParticipation} className="h-3" />
              <p className="text-xs text-muted-foreground">Excellent AI interview engagement!</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={handleNavigateToAIInterview} className="w-full justify-start" size="lg">
                <MessageSquare className="h-4 w-4 mr-3" />
                Start AI Interview
              </Button>
              <Button onClick={handleNavigateToQuestions} variant="outline" className="w-full justify-start" size="lg">
                <BookOpen className="h-4 w-4 mr-3" />
                Practice Questions
              </Button>
              <Button onClick={handleNavigateToQuestions} variant="outline" className="w-full justify-start" size="lg">
                <Bookmark className="h-4 w-4 mr-3" />
                View Bookmarks
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                    <activity.icon className="h-5 w-5 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{activity.action}</p>
                      <p className="text-xs text-muted-foreground flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {activity.time}
                      </p>
                    </div>
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
