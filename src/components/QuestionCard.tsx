
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bookmark, BookmarkCheck, CheckCircle, Circle, Code, MessageSquare, FileText } from "lucide-react";
import { CompanyQuestion, UserProgress } from "@/hooks/useCompanyQuestions";

interface QuestionCardProps {
  question: CompanyQuestion;
  progress?: UserProgress;
  onBookmarkToggle: () => void;
  onSolvedToggle: () => void;
  onClick: () => void;
}

export const QuestionCard = ({ 
  question, 
  progress, 
  onBookmarkToggle, 
  onSolvedToggle, 
  onClick 
}: QuestionCardProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'Hard': return 'bg-red-100 text-red-800 hover:bg-red-200';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Coding': return <Code className="h-4 w-4" />;
      case 'Theoretical': return <MessageSquare className="h-4 w-4" />;
      case 'MCQ': return <FileText className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow duration-200 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0 pr-4" onClick={onClick}>
            <CardTitle className="text-base group-hover:text-primary transition-colors leading-tight">
              {question.title}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {question.content.length > 100 
                ? `${question.content.substring(0, 100)}...` 
                : question.content
              }
            </p>
          </div>
          <div className="flex flex-col space-y-2 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onBookmarkToggle();
              }}
              className="h-8 w-8 p-0"
            >
              {progress?.bookmarked ? (
                <BookmarkCheck className="h-4 w-4 text-blue-600" />
              ) : (
                <Bookmark className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onSolvedToggle();
              }}
              className="h-8 w-8 p-0"
            >
              {progress?.solved ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <Circle className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0" onClick={onClick}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Badge 
              variant="secondary" 
              className={`text-xs ${getDifficultyColor(question.difficulty)}`}
            >
              {question.difficulty}
            </Badge>
            <Badge variant="outline" className="text-xs">
              <span className="mr-1">{getTypeIcon(question.question_type)}</span>
              {question.question_type}
            </Badge>
          </div>
          <span className="text-xs text-muted-foreground">
            View Details →
          </span>
        </div>
        {question.tags && question.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {question.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {question.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{question.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
