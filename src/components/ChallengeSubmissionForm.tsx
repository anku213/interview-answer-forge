
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Send, Code, CheckCircle } from "lucide-react";
import { DailyChallenge, UserSubmission } from "@/hooks/useDailyChallenges";

interface ChallengeSubmissionFormProps {
  challenge: DailyChallenge;
  userSubmission: UserSubmission | null;
  onSubmit: (answer: string) => void;
  loading?: boolean;
}

export const ChallengeSubmissionForm = ({ 
  challenge, 
  userSubmission, 
  onSubmit, 
  loading = false 
}: ChallengeSubmissionFormProps) => {
  const [answer, setAnswer] = useState(userSubmission?.answer || '');
  const [showHint, setShowHint] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answer.trim() && !userSubmission) {
      onSubmit(answer);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500/10 text-green-700 border-green-500/20';
      case 'Medium': return 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20';
      case 'Hard': return 'bg-red-500/10 text-red-700 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-700 border-gray-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Challenge Details */}
      <Card className="bg-gradient-to-br from-background to-muted/20 border-2 border-border/50">
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="text-2xl font-bold">{challenge.title}</CardTitle>
            <Badge 
              variant="outline" 
              className={`text-sm font-semibold ${getDifficultyColor(challenge.difficulty)}`}
            >
              {challenge.difficulty}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {challenge.content}
          </p>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {challenge.tags.map((tag, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="text-xs bg-muted/50"
              >
                {tag}
              </Badge>
            ))}
          </div>

          {/* AI Hint */}
          {challenge.ai_hint && (
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowHint(!showHint)}
                className="text-amber-600 border-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/20"
              >
                <Lightbulb className="h-4 w-4 mr-2" />
                {showHint ? 'Hide Hint' : 'Show AI Hint'}
              </Button>
              
              {showHint && (
                <Card className="bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
                  <CardContent className="pt-4">
                    <p className="text-sm text-amber-800 dark:text-amber-200">
                      💡 {challenge.ai_hint}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submission Form */}
      <Card className="bg-gradient-to-br from-background to-primary/5 border-2 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            {userSubmission ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Your Submission</span>
              </>
            ) : (
              <>
                <Code className="h-5 w-5 text-primary" />
                <span>Submit Your Answer</span>
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder={userSubmission 
                ? "You have already submitted your answer for today's challenge!" 
                : "Write your solution here... (code, explanation, or approach)"
              }
              rows={8}
              className="font-mono text-sm bg-background/50 border-2 border-border/50 focus:border-primary/50"
              disabled={!!userSubmission}
            />
            
            {!userSubmission && (
              <Button 
                type="submit" 
                disabled={!answer.trim() || loading}
                className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-semibold py-3"
                size="lg"
              >
                <Send className="h-5 w-5 mr-2" />
                {loading ? 'Submitting...' : 'Submit Answer'}
              </Button>
            )}
            
            {userSubmission && (
              <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-xl">
                <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="text-green-700 dark:text-green-300 font-medium">
                  Great job! You've completed today's challenge.
                </p>
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                  Check out the peer solutions below to see different approaches!
                </p>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
