
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronUp, Code, User, Calendar } from "lucide-react";
import { ChallengeSolution } from "@/hooks/useDailyChallenges";

interface PeerSolutionsProps {
  solutions: ChallengeSolution[];
  hasUserSubmitted: boolean;
}

export const PeerSolutions = ({ solutions, hasUserSubmitted }: PeerSolutionsProps) => {
  if (!hasUserSubmitted) {
    return (
      <Card className="bg-gradient-to-br from-muted/20 to-muted/5 border-2 border-dashed border-border/50">
        <CardContent className="text-center py-12">
          <div className="bg-muted/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Code className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">Submit Your Answer First</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Complete today's challenge to unlock peer solutions and see how others approached the problem.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center space-x-2">
          <Code className="h-6 w-6 text-primary" />
          <span>Peer Solutions</span>
          <Badge variant="secondary" className="ml-2">
            {solutions.length} solutions
          </Badge>
        </h2>
      </div>

      {solutions.length === 0 ? (
        <Card className="bg-gradient-to-br from-muted/20 to-muted/5 border-2 border-dashed border-border/50">
          <CardContent className="text-center py-12">
            <div className="bg-muted/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Code className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No Solutions Yet</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Be the first to share your solution with the community!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {solutions.map((solution) => (
            <Card key={solution.id} className="bg-gradient-to-br from-background to-muted/10 border-2 border-border/50 hover:border-primary/30 transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-lg font-semibold">{solution.title}</CardTitle>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{solution.author_name || 'Anonymous'}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(solution.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant="outline" 
                      className="text-xs bg-blue-500/10 text-blue-700 border-blue-500/20"
                    >
                      {solution.language}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center space-x-1 text-green-600 border-green-300 hover:bg-green-50 dark:hover:bg-green-950/20"
                    >
                      <ChevronUp className="h-4 w-4" />
                      <span>{solution.upvotes}</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="bg-muted/30 rounded-xl p-4 font-mono text-sm overflow-x-auto">
                  <pre className="whitespace-pre-wrap">{solution.content}</pre>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
