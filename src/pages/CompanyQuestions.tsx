import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Filter, Building2, TrendingUp, Users, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CompanyCard } from "@/components/CompanyCard";
import { useCompanies } from "@/hooks/useCompanies";
import { useCompanyQuestions } from "@/hooks/useCompanyQuestions";

export default function CompanyQuestions() {
  const navigate = useNavigate();
  const { companies, loading: companiesLoading } = useCompanies();
  const { questions } = useCompanyQuestions();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");

  // Get question counts per company
  const questionCounts = questions.reduce((acc, question) => {
    acc[question.company_id] = (acc[question.company_id] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Filter companies based on search
  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCompanyClick = (companyId: string, companyName: string) => {
    navigate(`/company-questions/${companyId}`, { 
      state: { companyName } 
    });
  };

  if (companiesLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center space-x-4 mb-8">
          <div className="h-10 w-10 bg-gradient-to-r from-primary/20 to-primary/10 rounded-xl animate-pulse"></div>
          <div className="space-y-2">
            <div className="h-8 w-64 bg-gradient-to-r from-muted to-muted/50 rounded-lg animate-pulse"></div>
            <div className="h-4 w-48 bg-gradient-to-r from-muted/70 to-muted/30 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-48 bg-gradient-to-br from-muted/50 to-muted/20 rounded-2xl animate-pulse border border-border/30"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Enhanced Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-50 via-purple-50/30 to-white dark:from-purple-950/20 dark:via-purple-950/10 dark:to-background border border-purple-200/50 dark:border-purple-800/30 p-8">
        <div className="absolute top-4 right-4 opacity-10">
          <Building2 className="h-32 w-32 text-purple-600" />
        </div>
        <div className="relative">
          <div className="flex items-center space-x-4 mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="p-3 bg-white/50 hover:bg-white/80 dark:bg-white/10 dark:hover:bg-white/20 rounded-xl border border-border/50"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="bg-purple-500/20 p-3 rounded-2xl">
              <Users className="h-8 w-8 text-purple-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-500 bg-clip-text text-transparent">
                Company Interview Questions
              </h1>
              <p className="text-lg text-muted-foreground mt-1">
                Practice questions from top tech companies worldwide
              </p>
            </div>
          </div>

          {/* Enhanced Stats */}
          <div className="flex flex-wrap gap-4">
            <Badge variant="secondary" className="px-4 py-2 text-sm bg-white/60 dark:bg-white/10">
              <Building2 className="h-4 w-4 mr-2" />
              {filteredCompanies.length} Companies
            </Badge>
            <Badge variant="secondary" className="px-4 py-2 text-sm bg-white/60 dark:bg-white/10">
              <TrendingUp className="h-4 w-4 mr-2" />
              {questions.length} Total Questions
            </Badge>
            <Badge variant="outline" className="px-4 py-2 text-sm border-purple-300 dark:border-purple-700">
              <Star className="h-4 w-4 mr-2" />
              Premium Content
            </Badge>
          </div>
        </div>
      </div>

      {/* Enhanced Search */}
      <Card className="bg-gradient-to-r from-background via-background to-muted/10 border-2 border-border/50">
        <CardContent className="p-6">
          <div className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <Search className="text-muted-foreground h-5 w-5" />
            </div>
            <Input
              placeholder="Search companies (e.g., Google, Microsoft, Apple)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-4 text-lg bg-background/50 border-2 border-border/50 focus:border-primary/50 rounded-xl transition-all duration-300"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <Badge variant="outline" className="text-xs">
                <Zap className="h-3 w-3 mr-1" />
                Live Search
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Company Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCompanies.map((company) => (
          <CompanyCard
            key={company.id}
            company={company}
            questionCount={questionCounts[company.id] || 0}
            onClick={() => handleCompanyClick(company.id, company.name)}
          />
        ))}
      </div>

      {/* Enhanced Empty State */}
      {filteredCompanies.length === 0 && (
        <Card className="bg-gradient-to-br from-muted/20 to-muted/5 border-2 border-dashed border-border/50">
          <CardContent className="text-center py-16">
            <div className="bg-muted/30 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <Search className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-semibold text-foreground mb-2">No companies found</h3>
            <p className="text-muted-foreground text-lg max-w-md mx-auto mb-6">
              We couldn't find any companies matching your search. Try adjusting your search terms.
            </p>
            <Button 
              onClick={() => setSearchTerm("")}
              variant="outline"
              className="border-2 hover:bg-primary/10 hover:border-primary/50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Clear Search
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
