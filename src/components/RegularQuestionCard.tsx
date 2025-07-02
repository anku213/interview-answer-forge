
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Code, Clock } from "lucide-react";
import { Question } from "@/types/Question";

interface RegularQuestionCardProps {
  question: Question;
  onEdit: (question: Question) => void;
  onDelete: (id: string) => void;
}

export const RegularQuestionCard = ({ 
  question, 
  onEdit, 
  onDelete 
}: RegularQuestionCardProps) => {
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'javascript': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'react': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'python': return 'bg-green-100 text-green-800 border-green-200';
      case 'algorithms': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'system-design': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getLanguageColor = (language: string) => {
    switch (language.toLowerCase()) {
      case 'javascript': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'typescript': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'python': return 'bg-green-100 text-green-800 border-green-200';
      case 'java': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'cpp': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500 hover:border-l-blue-600 bg-gradient-to-r from-white to-gray-50 hover:from-blue-50 hover:to-white">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0 pr-4">
            <div className="flex items-center gap-2 mb-2">
              <Badge 
                variant="outline" 
                className={`text-xs font-medium border ${getCategoryColor(question.category)}`}
              >
                {question.category}
              </Badge>
              <Badge 
                variant="outline" 
                className={`text-xs font-medium border ${getLanguageColor(question.language)}`}
              >
                <Code className="mr-1 h-3 w-3" />
                {question.language}
              </Badge>
            </div>
            
            <CardTitle className="text-lg font-semibold group-hover:text-blue-600 transition-colors leading-tight mb-2">
              {question.title}
            </CardTitle>
            
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
              {question.answer.length > 150 
                ? `${question.answer.substring(0, 150)}...` 
                : question.answer
              }
            </p>

            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{new Date(question.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col space-y-2 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(question);
              }}
              className="h-8 w-8 p-0 text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(question.id);
              }}
              className="h-8 w-8 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {question.code && (
          <div className="bg-gray-50 rounded-lg p-3 mb-3">
            <p className="text-xs text-gray-600 mb-1">Code snippet:</p>
            <pre className="text-xs text-gray-800 overflow-x-auto whitespace-pre-wrap">
              {question.code.length > 100 
                ? `${question.code.substring(0, 100)}...` 
                : question.code
              }
            </pre>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700">
              Regular Question
            </Badge>
          </div>
          <span className="text-xs text-blue-600 group-hover:text-blue-700 font-medium">
            View Details →
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
