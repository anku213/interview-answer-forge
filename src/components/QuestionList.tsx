
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Trash2, Code, Calendar, Eye, ArrowRight, Filter, Star } from "lucide-react";
import { Question } from "@/types/Question";
import { CATEGORIES, getCategoryLabel } from "@/utils/categories";

interface QuestionListProps {
  questions: Question[];
  onEdit: (question: Question) => void;
  onDelete: (id: string) => void;
  searchTerm: string;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export const QuestionList = ({ 
  questions, 
  onEdit, 
  onDelete, 
  searchTerm, 
  selectedCategory, 
  onCategoryChange 
}: QuestionListProps) => {
  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.language.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || q.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getLanguageBadgeClass = (language: string) => {
    const classes = {
      javascript: "language-javascript",
      python: "language-python", 
      java: "language-java",
      cpp: "language-cpp"
    };
    return `language-badge ${classes[language.toLowerCase()] || "bg-gray-100 text-gray-800"}`;
  };

  const getCategoryBadgeClass = (category: string) => {
    const classes = {
      javascript: "bg-yellow-100 text-yellow-800",
      html: "bg-orange-100 text-orange-800",
      css: "bg-blue-100 text-blue-800",
      react: "bg-cyan-100 text-cyan-800",
      nodejs: "bg-green-100 text-green-800",
      mysql: "bg-purple-100 text-purple-800",
      mongodb: "bg-emerald-100 text-emerald-800",
      python: "bg-blue-100 text-blue-800",
      java: "bg-red-100 text-red-800"
    };
    return `language-badge ${classes[category.toLowerCase()] || "bg-gray-100 text-gray-800"}`;
  };

  if (filteredQuestions.length === 0) {
    return (
      <div>
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-muted/10 to-muted/5 border border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="bg-primary/20 p-2 rounded-lg">
                  <Filter className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <Select value={selectedCategory} onValueChange={onCategoryChange}>
                    <SelectTrigger className="w-full max-w-xs border-2 border-border/50 focus:border-primary/50">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Badge variant="outline" className="px-3 py-1">
                  <Star className="h-3 w-3 mr-1" />
                  Advanced Filter
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="bg-gradient-to-br from-muted/20 to-muted/5 border-2 border-dashed border-border/50">
          <CardContent className="text-center py-16">
            <div className="bg-muted/30 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <Code className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-semibold text-foreground mb-3">
              {searchTerm || selectedCategory !== "all" ? "No questions found" : "No questions yet"}
            </h3>
            <p className="text-muted-foreground text-lg max-w-md mx-auto mb-6">
              {searchTerm || selectedCategory !== "all"
                ? "Try adjusting your search terms or category filter to find what you're looking for" 
                : "Get started by adding your first interview question to build your collection"
              }
            </p>
            <div className="flex justify-center space-x-4">
              {(searchTerm || selectedCategory !== "all") && (
                <Button 
                  onClick={() => {
                    onCategoryChange("all");
                  }}
                  variant="outline"
                  className="border-2 hover:bg-primary/10 hover:border-primary/50"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <Card className="bg-gradient-to-r from-muted/10 to-muted/5 border border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-primary/20 p-2 rounded-lg">
                  <Filter className="h-5 w-5 text-primary" />
                </div>
                <Select value={selectedCategory} onValueChange={onCategoryChange}>
                  <SelectTrigger className="w-64 border-2 border-border/50 focus:border-primary/50">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Badge variant="secondary" className="px-3 py-1">
                {filteredQuestions.length} result{filteredQuestions.length !== 1 ? 's' : ''}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredQuestions.map((question) => (
          <Card 
            key={question.id} 
            className="hover:shadow-xl transition-all duration-300 group bg-gradient-to-br from-background via-background to-muted/10 border-2 border-border/50 hover:border-primary/30 hover:-translate-y-1"
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                  {question.title}
                </CardTitle>
                <div className="flex gap-1 ml-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(question)}
                    className="h-9 w-9 p-0 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 hover:text-blue-700 rounded-xl"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(question.id)}
                    className="h-9 w-9 p-0 bg-red-500/10 hover:bg-red-500/20 text-red-600 hover:text-red-700 rounded-xl"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2 flex-wrap">
                  <Badge className={`${getCategoryBadgeClass(question.category)} border-0`}>
                    {getCategoryLabel(question.category)}
                  </Badge>
                  <Badge className={`${getLanguageBadgeClass(question.language)} border-0`}>
                    <Code className="h-3 w-3 mr-1" />
                    {question.language}
                  </Badge>
                </div>
                
                <div 
                  className="text-sm text-muted-foreground line-clamp-3 leading-relaxed"
                  dangerouslySetInnerHTML={{ 
                    __html: question.answer.substring(0, 120) + "..." 
                  }}
                />
                
                {question.code && (
                  <div className="bg-gradient-to-r from-muted/30 to-muted/10 rounded-lg p-3 border border-border/30">
                    <code className="text-xs text-muted-foreground font-mono line-clamp-2">
                      {question.code.substring(0, 80)}
                      {question.code.length > 80 && "..."}
                    </code>
                  </div>
                )}
                
                <div className="flex items-center justify-between pt-2 border-t border-border/30">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(question.updatedAt).toLocaleDateString()}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(question)}
                    className="text-xs text-primary hover:text-primary/80 hover:bg-primary/10 h-7 px-3 rounded-lg"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View Details
                    <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
