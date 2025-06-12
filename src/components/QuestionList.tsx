
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Trash2, Code } from "lucide-react";
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
        <div className="mb-6">
          <Select value={selectedCategory} onValueChange={onCategoryChange}>
            <SelectTrigger className="w-64">
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
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <Code className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            {searchTerm || selectedCategory !== "all" ? "No questions found" : "No questions yet"}
          </h3>
          <p className="text-muted-foreground">
            {searchTerm || selectedCategory !== "all"
              ? "Try adjusting your search terms or category filter" 
              : "Get started by adding your first interview question"
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-64">
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredQuestions.map((question) => (
          <Card key={question.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg font-medium line-clamp-2">
                  {question.title}
                </CardTitle>
                <div className="flex gap-1 ml-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(question)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(question.id)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Badge className={getCategoryBadgeClass(question.category)}>
                    {getCategoryLabel(question.category)}
                  </Badge>
                  <Badge className={getLanguageBadgeClass(question.language)}>
                    {question.language}
                  </Badge>
                </div>
                
                <div 
                  className="text-sm text-muted-foreground line-clamp-3"
                  dangerouslySetInnerHTML={{ 
                    __html: question.answer.substring(0, 150) + "..." 
                  }}
                />
                
                {question.code && (
                  <div className="bg-muted rounded p-2">
                    <code className="text-xs text-muted-foreground font-mono">
                      {question.code.substring(0, 100)}
                      {question.code.length > 100 && "..."}
                    </code>
                  </div>
                )}
                
                <div className="text-xs text-muted-foreground">
                  {new Date(question.updatedAt).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
