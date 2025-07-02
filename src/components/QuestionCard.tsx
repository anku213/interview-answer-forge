
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bookmark, BookmarkCheck, CheckCircle, Circle, Code, MessageSquare, FileText, Clock } from "lucide-react";
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
      case 'Easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Coding': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Theoretical': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'MCQ': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500 hover:border-l-blue-600 bg-gradient-to-r from-white to-gray-50 hover:from-blue-50 hover:to-white">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0 pr-4" onClick={onClick}>
            <div className="flex items-center gap-2 mb-2">
              <Badge 
                variant="outline" 
                className={`text-xs font-medium border ${getDifficultyColor(question.difficulty)}`}
              >
                {question.difficulty}
              </Badge>
              <Badge 
                variant="outline" 
                className={`text-xs font-medium border ${getTypeColor(question.question_type)}`}
              >
                <span className="mr-1">{getTypeIcon(question.question_type)}</span>
                {question.question_type}
              </Badge>
            </div>
            
            <CardTitle className="text-lg font-semibold group-hover:text-blue-600 transition-colors leading-tight mb-2">
              {question.title}
            </CardTitle>
            
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
              {question.content.length > 120 
                ? `${question.content.substring(0, 120)}...` 
                : question.content
              }
            </p>

            {/* Progress indicators */}
            <div className="flex items-center gap-4 text-xs text-gray-500">
              {progress?.solved && (
                <div className="flex items-center gap-1 text-green-600">
                  <CheckCircle className="h-3 w-3" />
                  <span>Solved</span>
                </div>
              )}
              {progress?.bookmarked && (
                <div className="flex items-center gap-1 text-blue-600">
                  <BookmarkCheck className="h-3 w-3" />
                  <span>Bookmarked</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{new Date(question.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col space-y-2 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onBookmarkToggle();
              }}
              className={`h-8 w-8 p-0 transition-colors ${
                progress?.bookmarked 
                  ? 'text-blue-600 hover:text-blue-700 bg-blue-50' 
                  : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              {progress?.bookmarked ? (
                <BookmarkCheck className="h-4 w-4" />
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
              className={`h-8 w-8 p-0 transition-colors ${
                progress?.solved 
                  ? 'text-green-600 hover:text-green-700 bg-green-50' 
                  : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
              }`}
            >
              {progress?.solved ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <Circle className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0" onClick={onClick}>
        {question.tags && question.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {question.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200">
                {tag}
              </Badge>
            ))}
            {question.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                +{question.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {question.ai_hint && (
              <Badge variant="outline" className="text-xs text-blue-600 border-blue-200">
                AI Hint Available
              </Badge>
            )}
            {question.ai_explanation && (
              <Badge variant="outline" className="text-xs text-purple-600 border-purple-200">
                AI Explanation
              </Badge>
            )}
          </div>
          <span className="text-xs text-blue-600 group-hover:text-blue-700 font-medium">
            View Details →
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
