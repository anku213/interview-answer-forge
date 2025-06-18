
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, ArrowRight, TrendingUp, Star } from "lucide-react";
import { Company } from "@/hooks/useCompanies";

interface CompanyCardProps {
  company: Company;
  questionCount?: number;
  onClick: () => void;
}

export const CompanyCard = ({ company, questionCount = 0, onClick }: CompanyCardProps) => {
  return (
    <Card 
      className="cursor-pointer hover:shadow-xl transition-all duration-300 group bg-gradient-to-br from-background via-background to-muted/10 border-2 border-border/50 hover:border-primary/30 hover:-translate-y-1"
      onClick={onClick}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-4">
          {company.logo_url ? (
            <div className="relative">
              <img 
                src={company.logo_url} 
                alt={`${company.name} logo`}
                className="w-14 h-14 object-contain rounded-xl bg-gradient-to-br from-muted/30 to-muted/10 p-3 border border-border/30 group-hover:border-primary/30 transition-all duration-300"
              />
              <div className="absolute -top-1 -right-1 bg-primary/20 rounded-full p-1">
                <Star className="h-3 w-3 text-primary" />
              </div>
            </div>
          ) : (
            <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center border border-primary/30 group-hover:scale-110 transition-transform duration-300">
              <Building2 className="h-7 w-7 text-primary" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors truncate">
              {company.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              {questionCount} questions available
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Badge 
              variant="secondary" 
              className="text-xs bg-primary/10 text-primary border-primary/20"
            >
              <Building2 className="h-3 w-3 mr-1" />
              Company
            </Badge>
            {questionCount > 10 && (
              <Badge 
                variant="outline" 
                className="text-xs border-green-300 text-green-700 dark:border-green-700 dark:text-green-300"
              >
                Popular
              </Badge>
            )}
          </div>
          <div className="flex items-center text-primary group-hover:text-primary/80 transition-colors">
            <span className="text-xs font-medium mr-1">Explore</span>
            <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform duration-300" />
          </div>
        </div>
        
        {/* Progress indicator */}
        <div className="mt-4 bg-muted/30 rounded-full h-2 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-primary/60 to-primary h-full rounded-full transition-all duration-500 group-hover:from-primary group-hover:to-primary/80"
            style={{ width: `${Math.min((questionCount / 20) * 100, 100)}%` }}
          ></div>
        </div>
      </CardContent>
    </Card>
  );
};
