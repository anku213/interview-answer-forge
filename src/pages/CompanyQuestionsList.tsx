
import { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Search, Filter, BookOpen, Target, Award, Grid, List, Users, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { QuestionCard } from "@/components/QuestionCard";
import { useCompanyQuestions } from "@/hooks/useCompanyQuestions";

export default function CompanyQuestionsList() {
  const { companyId } = useParams<{ companyId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const companyName = location.state?.companyName || "Company";
  
  const { questions, userProgress, loading, updateUserProgress } = useCompanyQuestions(companyId);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [showSolved, setShowSolved] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  // Filter questions
  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesDifficulty = selectedDifficulty === "all" || question.difficulty === selectedDifficulty;
    const matchesType = selectedType === "all" || question.question_type === selectedType;
    
    const progress = userProgress[question.id];
    const matchesSolved = showSolved === "all" || 
                         (showSolved === "solved" && progress?.solved) ||
                         (showSolved === "unsolved" && !progress?.solved);

    return matchesSearch && matchesDifficulty && matchesType && matchesSolved;
  });

  // Calculate stats
  const solvedCount = Object.values(userProgress).filter(p => p.solved).length;
  const bookmarkedCount = Object.values(userProgress).filter(p => p.bookmarked).length;
  const progressPercentage = questions.length > 0 ? Math.round((solvedCount / questions.length) * 100) : 0;

  const handleQuestionClick = (questionId: string) => {
    navigate(`/company-questions/${companyId}/${questionId}`, {
      state: { companyName }
    });
  };

  const handleBookmarkToggle = (questionId: string) => {
    const progress = userProgress[questionId];
    updateUserProgress(questionId, {
      bookmarked: !progress?.bookmarked
    });
  };

  const handleSolvedToggle = (questionId: string) => {
    const progress = userProgress[questionId];
    updateUserProgress(questionId, {
      solved: !progress?.solved
    });
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedDifficulty("all");
    setSelectedType("all");
    setShowSolved("all");
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="space-y-6">
          <div className="h-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl animate-pulse"></div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg animate-pulse"></div>
            ))}
          </div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Enhanced Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-blue-950/20 dark:via-background dark:to-purple-950/20 border border-blue-200/50 dark:border-blue-800/30 p-8">
        <div className="absolute top-4 right-4 opacity-10">
          <Users className="h-32 w-32 text-blue-600" />
        </div>
        <div className="relative">
          <div className="flex items-center space-x-4 mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/company-questions')}
              className="p-3 bg-white/50 hover:bg-white/80 dark:bg-white/10 dark:hover:bg-white/20 rounded-xl border border-border/50"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="bg-blue-500/20 p-3 rounded-2xl">
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {companyName} Questions
              </h1>
              <p className="text-lg text-muted-foreground mt-1">
                Master your {companyName} interview preparation
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-white/60 dark:bg-white/10 rounded-2xl p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Overall Progress</span>
              <span className="text-sm font-bold text-blue-600">{progressPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Enhanced Stats */}
          <div className="flex flex-wrap gap-4">
            <Badge variant="secondary" className="px-4 py-2 text-sm bg-white/60 dark:bg-white/10">
              <BookOpen className="h-4 w-4 mr-2" />
              {questions.length} Questions
            </Badge>
            <Badge variant="secondary" className="px-4 py-2 text-sm bg-white/60 dark:bg-white/10">
              <Target className="h-4 w-4 mr-2" />
              {solvedCount} Solved
            </Badge>
            <Badge variant="secondary" className="px-4 py-2 text-sm bg-white/60 dark:bg-white/10">
              <Award className="h-4 w-4 mr-2" />
              {bookmarkedCount} Bookmarked
            </Badge>
          </div>
        </div>
      </div>

      {/* Enhanced Filters */}
      <Card className="bg-gradient-to-r from-background via-background to-muted/10 border-2 border-border/50">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg">Filter & Search Questions</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background/50 border-border/50 focus:border-primary/50 transition-all duration-300"
              />
            </div>
            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger className="bg-background/50 border-border/50 focus:border-primary/50">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Difficulty</SelectItem>
                <SelectItem value="Easy">Easy</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Hard">Hard</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="bg-background/50 border-border/50 focus:border-primary/50">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Coding">Coding</SelectItem>
                <SelectItem value="Theoretical">Theoretical</SelectItem>
                <SelectItem value="MCQ">MCQ</SelectItem>
              </SelectContent>
            </Select>
            <Select value={showSolved} onValueChange={setShowSolved}>
              <SelectTrigger className="bg-background/50 border-border/50 focus:border-primary/50">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="solved">Solved</SelectItem>
                <SelectItem value="unsolved">Unsolved</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              onClick={clearAllFilters}
              className="border-2 hover:bg-primary/10 hover:border-primary/50"
            >
              Clear All
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-xl font-semibold text-foreground">
            {filteredQuestions.length} Question{filteredQuestions.length !== 1 ? 's' : ''}
          </h3>
          {(searchTerm || selectedDifficulty !== "all" || selectedType !== "all" || showSolved !== "all") && (
            <Badge variant="outline" className="text-sm">
              <Filter className="h-3 w-3 mr-1" />
              Filtered
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className="h-9 w-9 p-0"
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
            className="h-9 w-9 p-0"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Questions List */}
      {filteredQuestions.length === 0 ? (
        <Card className="bg-gradient-to-br from-muted/20 to-muted/5 border-2 border-dashed border-border/50">
          <CardContent className="text-center py-16">
            <div className="bg-muted/30 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <Search className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-semibold text-foreground mb-2">No questions found</h3>
            <p className="text-muted-foreground text-lg max-w-md mx-auto mb-6">
              No questions match your current filters. Try adjusting your search criteria.
            </p>
            <Button 
              onClick={clearAllFilters}
              variant="outline"
              className="border-2 hover:bg-primary/10 hover:border-primary/50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Clear All Filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className={
          viewMode === "grid" 
            ? "grid grid-cols-1 lg:grid-cols-2 gap-6"
            : "space-y-4"
        }>
          {filteredQuestions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              progress={userProgress[question.id]}
              onBookmarkToggle={() => handleBookmarkToggle(question.id)}
              onSolvedToggle={() => handleSolvedToggle(question.id)}
              onClick={() => handleQuestionClick(question.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
