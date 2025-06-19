
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Trophy, Clock, Zap, Star } from "lucide-react";
import { DailyChallenge } from "@/hooks/useDailyChallenges";

interface DailyChallengeCardProps {
  challenge: DailyChallenge;
  userStats?: {
    current_streak: number;
    total_completed: number;
  } | null;
  onStartChallenge: () => void;
  hasSubmitted?: boolean;
}

export const DailyChallengeCard = ({ 
  challenge, 
  userStats, 
  onStartChallenge, 
  hasSubmitted = false 
}: DailyChallengeCardProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500/10 text-green-700 border-green-500/20';
      case 'Medium': return 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20';
      case 'Hard': return 'bg-red-500/10 text-red-700 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-700 border-gray-500/20';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 border-2 border-border/50 hover:border-primary/30 transition-all duration-300 group">
      <div className="absolute top-4 right-4 opacity-10">
        <Calendar className="h-16 w-16 text-primary" />
      </div>
      
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground font-medium">
                {formatDate(challenge.challenge_date)}
              </span>
            </div>
            <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors">
              {challenge.title}
            </CardTitle>
          </div>
          
          <div className="flex flex-col items-end space-y-2">
            <Badge 
              variant="outline" 
              className={`text-sm font-semibold ${getDifficultyColor(challenge.difficulty)}`}
            >
              {challenge.difficulty}
            </Badge>
            {hasSubmitted && (
              <Badge variant="secondary" className="bg-green-500/10 text-green-700 border-green-500/20">
                <Star className="h-3 w-3 mr-1" />
                Completed
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <p className="text-muted-foreground leading-relaxed line-clamp-3">
          {challenge.content}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {challenge.tags.map((tag, index) => (
            <Badge 
              key={index} 
              variant="secondary" 
              className="text-xs bg-muted/50 hover:bg-muted/80 transition-colors"
            >
              {tag}
            </Badge>
          ))}
        </div>

        {/* Stats Row */}
        {userStats && (
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium">
                  {userStats.current_streak} day streak
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Trophy className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium">
                  {userStats.total_completed} completed
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <Button 
          onClick={onStartChallenge}
          className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02]"
          size="lg"
        >
          <Clock className="h-5 w-5 mr-2" />
          {hasSubmitted ? 'View Solutions' : 'Start Challenge'}
        </Button>
      </CardContent>
    </Card>
  );
};
