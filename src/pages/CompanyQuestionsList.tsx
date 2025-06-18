
import { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Search, Filter, BookOpen, Target, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="space-y-6">
          <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-16 bg-gray-200 rounded animate-pulse"></div>
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
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/company-questions')}
          className="p-2"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">{companyName} Questions</h1>
          <p className="text-muted-foreground">
            Practice interview questions from {companyName}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-muted-foreground">Total Questions</span>
          </div>
          <p className="text-2xl font-bold text-foreground mt-1">{questions.length}</p>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-muted-foreground">Solved</span>
          </div>
          <p className="text-2xl font-bold text-foreground mt-1">{solvedCount}</p>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Award className="h-5 w-5 text-yellow-600" />
            <span className="text-sm font-medium text-muted-foreground">Bookmarked</span>
          </div>
          <p className="text-2xl font-bold text-foreground mt-1">{bookmarkedCount}</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
          <SelectTrigger className="w-full sm:w-40">
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
          <SelectTrigger className="w-full sm:w-40">
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
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="solved">Solved</SelectItem>
            <SelectItem value="unsolved">Unsolved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredQuestions.length} of {questions.length} questions
        </p>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
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

      {filteredQuestions.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            No questions found matching your filters.
          </p>
          <Button 
            variant="outline" 
            onClick={() => {
              setSearchTerm("");
              setSelectedDifficulty("all");
              setSelectedType("all");
              setShowSolved("all");
            }}
            className="mt-4"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
