
import { useState } from "react";
import { ArrowLeft, Calendar, Trophy, Zap, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DailyChallengeCard } from "@/components/DailyChallengeCard";
import { ChallengeSubmissionForm } from "@/components/ChallengeSubmissionForm";
import { PeerSolutions } from "@/components/PeerSolutions";
import { useDailyChallenges } from "@/hooks/useDailyChallenges";
import { useNavigate } from "react-router-dom";

export default function DailyChallenge() {
  const navigate = useNavigate();
  const { 
    todayChallenge, 
    userSubmission, 
    solutions, 
    userStats, 
    loading, 
    submitAnswer 
  } = useDailyChallenges();
  const [showChallenge, setShowChallenge] = useState(false);

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center space-x-4 mb-8">
          <div className="h-10 w-10 bg-gradient-to-r from-primary/20 to-primary/10 rounded-xl animate-pulse"></div>
          <div className="space-y-2">
            <div className="h-8 w-64 bg-gradient-to-r from-muted to-muted/50 rounded-lg animate-pulse"></div>
            <div className="h-4 w-48 bg-gradient-to-r from-muted/70 to-muted/30 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="h-96 bg-gradient-to-br from-muted/50 to-muted/20 rounded-2xl animate-pulse border border-border/30"></div>
        </div>
      </div>
    );
  }

  if (!todayChallenge) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center space-x-4 mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="p-3 bg-white/50 hover:bg-white/80 dark:bg-white/10 dark:hover:bg-white/20 rounded-xl border border-border/50"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="bg-primary/20 p-3 rounded-2xl">
            <Calendar className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Daily Challenge
            </h1>
            <p className="text-lg text-muted-foreground mt-1">
              No challenge available today
            </p>
          </div>
        </div>
        
        <Card className="max-w-2xl mx-auto bg-gradient-to-br from-muted/20 to-muted/5 border-2 border-dashed border-border/50">
          <CardContent className="text-center py-16">
            <div className="bg-muted/30 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <Calendar className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-semibold text-foreground mb-2">No Challenge Today</h3>
            <p className="text-muted-foreground text-lg max-w-md mx-auto mb-6">
              It looks like there's no challenge scheduled for today. Check back tomorrow for a new challenge!
            </p>
            <Button 
              onClick={() => navigate('/')}
              variant="outline"
              className="border-2 hover:bg-primary/10 hover:border-primary/50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50 via-blue-50/30 to-white dark:from-blue-950/20 dark:via-blue-950/10 dark:to-background border border-blue-200/50 dark:border-blue-800/30 p-8">
        <div className="absolute top-4 right-4 opacity-10">
          <Calendar className="h-32 w-32 text-blue-600" />
        </div>
        <div className="relative">
          <div className="flex items-center space-x-4 mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="p-3 bg-white/50 hover:bg-white/80 dark:bg-white/10 dark:hover:bg-white/20 rounded-xl border border-border/50"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="bg-blue-500/20 p-3 rounded-2xl">
              <Target className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                Daily Challenge
              </h1>
              <p className="text-lg text-muted-foreground mt-1">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>

          {/* Stats */}
          {userStats && (
            <div className="flex flex-wrap gap-4">
              <Badge variant="secondary" className="px-4 py-2 text-sm bg-white/60 dark:bg-white/10">
                <Zap className="h-4 w-4 mr-2" />
                {userStats.current_streak} day streak
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm bg-white/60 dark:bg-white/10">
                <Trophy className="h-4 w-4 mr-2" />
                {userStats.total_completed} completed
              </Badge>
              <Badge variant="outline" className="px-4 py-2 text-sm border-blue-300 dark:border-blue-700">
                <Calendar className="h-4 w-4 mr-2" />
                Daily Challenge
              </Badge>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        {!showChallenge ? (
          <DailyChallengeCard
            challenge={todayChallenge}
            userStats={userStats}
            onStartChallenge={() => setShowChallenge(true)}
            hasSubmitted={!!userSubmission}
          />
        ) : (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={() => setShowChallenge(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Overview
              </Button>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <ChallengeSubmissionForm
                  challenge={todayChallenge}
                  userSubmission={userSubmission}
                  onSubmit={submitAnswer}
                />
              </div>
              
              <div>
                <PeerSolutions
                  solutions={solutions}
                  hasUserSubmitted={!!userSubmission}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
