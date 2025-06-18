
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2 } from "lucide-react";
import { Company } from "@/hooks/useCompanies";

interface CompanyCardProps {
  company: Company;
  questionCount?: number;
  onClick: () => void;
}

export const CompanyCard = ({ company, questionCount = 0, onClick }: CompanyCardProps) => {
  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow duration-200 group"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-3">
          {company.logo_url ? (
            <img 
              src={company.logo_url} 
              alt={`${company.name} logo`}
              className="w-12 h-12 object-contain rounded-lg bg-gray-50 p-2"
            />
          ) : (
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg group-hover:text-primary transition-colors truncate">
              {company.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {questionCount} questions available
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex justify-between items-center">
          <Badge variant="secondary" className="text-xs">
            Company
          </Badge>
          <span className="text-xs text-muted-foreground">
            Explore →
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
