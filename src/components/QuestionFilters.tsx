
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuestionFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
  onClearFilters: () => void;
}

export const QuestionFilters = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedLanguage,
  onLanguageChange,
  onClearFilters
}: QuestionFiltersProps) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-5 w-5 text-gray-600" />
        <h3 className="font-semibold text-gray-900">Filter Questions</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-300"
          />
        </div>

        {/* Category Filter */}
        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger className="bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-300">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="javascript">JavaScript</SelectItem>
            <SelectItem value="react">React</SelectItem>
            <SelectItem value="python">Python</SelectItem>
            <SelectItem value="algorithms">Algorithms</SelectItem>
            <SelectItem value="system-design">System Design</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>

        {/* Language Filter */}
        <Select value={selectedLanguage} onValueChange={onLanguageChange}>
          <SelectTrigger className="bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-300">
            <SelectValue placeholder="All Languages" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Languages</SelectItem>
            <SelectItem value="javascript">JavaScript</SelectItem>
            <SelectItem value="python">Python</SelectItem>
            <SelectItem value="java">Java</SelectItem>
            <SelectItem value="typescript">TypeScript</SelectItem>
            <SelectItem value="cpp">C++</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        <Button 
          variant="outline" 
          onClick={onClearFilters}
          className="border-gray-200 hover:bg-gray-50"
        >
          Clear All
        </Button>
      </div>
    </div>
  );
};
