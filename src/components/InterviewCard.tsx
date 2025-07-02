
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Play, 
  CheckCircle, 
  Clock, 
  Pause, 
  Calendar, 
  Code, 
  User, 
  MessageSquare,
  Zap,
  Trophy
} from "lucide-react";
import { AIInterview } from "@/hooks/useAIInterviews";

interface InterviewCardProps {
  interview: AIInterview;
  onStart: () => void;
  onResume: () => void;
  onView: () => void;
}

export const InterviewCard = ({ interview, onStart, onResume, onView }: InterviewCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'active': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <Clock className="h-4 w-4" />;
      case 'active': return <Pause className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getExperienceIcon = (level: string) => {
    switch (level.toLowerCase()) {
      case 'junior': return '🌱';
      case 'mid-level': return '🚀';
      case 'senior': return '⭐';
      default: return '💼';
    }
  };

  const handleAction = () => {
    switch (interview.status) {
      case 'draft':
        onStart();
        break;
      case 'active':
        onResume();
        break;
      case 'completed':
        onView();
        break;
      default:
        onStart();
    }
  };

  const getActionText = () => {
    switch (interview.status) {
      case 'draft': return 'Start Interview';
      case 'active': return 'Resume Interview';
      case 'completed': return 'View Results';
      default: return 'Start Interview';
    }
  };

  const getActionIcon = () => {
    switch (interview.status) {
      case 'draft': return <Play className="h-4 w-4" />;
      case 'active': return <MessageSquare className="h-4 w-4" />;
      case 'completed': return <Trophy className="h-4 w-4" />;
      default: return <Play className="h-4 w-4" />;
    }
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50 overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <MessageSquare className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                {interview.title}
              </CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-2xl">{getExperienceIcon(interview.experience_level)}</span>
                <span className="text-sm font-medium text-gray-600">{interview.experience_level}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge 
              variant="outline" 
              className={`text-xs font-medium border ${getStatusColor(interview.status)}`}
            >
              {getStatusIcon(interview.status)}
              <span className="ml-1 capitalize">{interview.status}</span>
            </Badge>
            {interview.status === 'completed' && (
              <div className="flex items-center gap-1">
                <Trophy className="h-4 w-4 text-yellow-500" />
                <span className="text-xs text-gray-600">Completed</span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Technology & Difficulty */}
        <div className="flex items-center justify-between p-4 bg-white/50 rounded-xl border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Code className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">{interview.technology}</p>
              <p className="text-sm text-gray-600">Technology Focus</p>
            </div>
          </div>
          <Badge 
            variant="outline" 
            className={`text-sm font-medium border ${getDifficultyColor(interview.difficulty_level)}`}
          >
            {interview.difficulty_level}
          </Badge>
        </div>

        {/* Date & Time */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Created {new Date(interview.created_at).toLocaleDateString()}</span>
          </div>
          {interview.updated_at !== interview.created_at && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Updated {new Date(interview.updated_at).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {/* Progress indicator for active interviews */}
        {interview.status === 'active' && (
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Interview in Progress</span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full w-1/3"></div>
            </div>
            <p className="text-xs text-blue-600 mt-1">Continue where you left off</p>
          </div>
        )}

        {/* Action Button */}
        <Button 
          onClick={handleAction}
          className={`w-full py-3 text-base font-medium transition-all duration-200 ${
            interview.status === 'completed' 
              ? 'bg-green-600 hover:bg-green-700' 
              : interview.status === 'active'
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
          }`}
        >
          {getActionIcon()}
          <span className="ml-2">{getActionText()}</span>
        </Button>
      </CardContent>
    </Card>
  );
};
