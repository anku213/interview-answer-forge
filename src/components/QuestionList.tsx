
import { useState } from "react";
import { RegularQuestionCard } from "./RegularQuestionCard";
import { QuestionFilters } from "./QuestionFilters";
import { Question } from "@/types/Question";
import { Grid, List, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || question.category === selectedCategory;
    const matchesLanguage = selectedLanguage === "all" || question.language === selectedLanguage;
    
    return matchesSearch && matchesCategory && matchesLanguage;
  });

  const handleClearFilters = () => {
    onCategoryChange("all");
    setSelectedLanguage("all");
  };

  if (questions.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-12 max-w-md mx-auto">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <LayoutGrid className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Questions Yet</h3>
          <p className="text-gray-600 mb-6">Start building your interview question collection by adding your first question.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <QuestionFilters
        searchTerm={searchTerm}
        onSearchChange={() => {}} // Handled by parent
        selectedCategory={selectedCategory}
        onCategoryChange={onCategoryChange}
        selectedLanguage={selectedLanguage}
        onLanguageChange={setSelectedLanguage}
        onClearFilters={handleClearFilters}
      />

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {filteredQuestions.length} Question{filteredQuestions.length !== 1 ? 's' : ''}
          </h3>
          {searchTerm && (
            <span className="text-sm text-gray-500">
              for "{searchTerm}"
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className="h-8 w-8 p-0"
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
            className="h-8 w-8 p-0"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Questions Grid/List */}
      {filteredQuestions.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-50 rounded-2xl p-8 max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Questions Found</h3>
            <p className="text-gray-600 mb-4">No questions match your current filters.</p>
            <Button variant="outline" onClick={handleClearFilters}>
              Clear Filters
            </Button>
          </div>
        </div>
      ) : (
        <div className={
          viewMode === "grid" 
            ? "grid grid-cols-1 lg:grid-cols-2 gap-6"
            : "space-y-4"
        }>
          {filteredQuestions.map((question) => (
            <RegularQuestionCard
              key={question.id}
              question={question}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};
