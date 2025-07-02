
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Target, TrendingUp, Star } from "lucide-react";

interface Company {
  id: string;
  name: string;
  logo_url?: string;
  description?: string;
  industry?: string;
  founded_year?: number;
  headquarters?: string;
  created_at: string;
  updated_at: string;
}

interface CompanyCardProps {
  company: Company;
  questionCount: number;
  onClick: () => void;
}

export const CompanyCard = ({ company, questionCount, onClick }: CompanyCardProps) => {
  const getDifficultyStats = () => {
    // Mock difficulty breakdown - in real app, this would come from props
    return {
      easy: Math.floor(questionCount * 0.3),
      medium: Math.floor(questionCount * 0.5),
      hard: Math.floor(questionCount * 0.2)
    };
  };

  const difficultyStats = getDifficultyStats();

  return (
    <Card 
      className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50 hover:from-blue-50 hover:to-purple-50 overflow-hidden"
      onClick={onClick}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              {company.logo_url ? (
                <img 
                  src={company.logo_url} 
                  alt={`${company.name} logo`}
                  className="w-10 h-10 rounded-lg object-cover"
                />
              ) : (
                <Building2 className="h-8 w-8 text-white" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                {company.name}
              </CardTitle>
              {company.industry && (
                <p className="text-sm text-gray-600 mt-1">{company.industry}</p>
              )}
              {company.headquarters && (
                <p className="text-xs text-gray-500 mt-1">📍 {company.headquarters}</p>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium text-gray-700">Premium</span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Question Count */}
        <div className="flex items-center justify-between p-4 bg-white/50 rounded-xl border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Target className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{questionCount}</p>
              <p className="text-sm text-gray-600">Questions</p>
            </div>
          </div>
          <TrendingUp className="h-5 w-5 text-green-500" />
        </div>

        {/* Difficulty Breakdown */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700">Difficulty Breakdown</p>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-2 bg-green-50 rounded-lg">
              <div className="text-lg font-bold text-green-700">{difficultyStats.easy}</div>
              <div className="text-xs text-green-600">Easy</div>
            </div>
            <div className="text-center p-2 bg-yellow-50 rounded-lg">
              <div className="text-lg font-bold text-yellow-700">{difficultyStats.medium}</div>
              <div className="text-xs text-yellow-600">Medium</div>
            </div>
            <div className="text-center p-2 bg-red-50 rounded-lg">
              <div className="text-lg font-bold text-red-700">{difficultyStats.hard}</div>
              <div className="text-xs text-red-600">Hard</div>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {company.founded_year && (
            <Badge variant="outline" className="text-xs">
              Est. {company.founded_year}
            </Badge>
          )}
          <Badge variant="outline" className="text-xs">
            Tech
          </Badge>
          <Badge variant="outline" className="text-xs">
            Popular
          </Badge>
        </div>

        {/* CTA */}
        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Start practicing →</span>
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full border-2 border-white"></div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
