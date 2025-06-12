
import { Button } from "@/components/ui/button";
import { PlusCircle, Search, BookOpen } from "lucide-react";

interface HeaderProps {
  onNewQuestion: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export const Header = ({ onNewQuestion, searchTerm, onSearchChange }: HeaderProps) => {
  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BookOpen className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Interview Prep</h1>
            <p className="text-sm text-muted-foreground">Master your technical interviews</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-4 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring w-64"
            />
          </div>
          
          <Button onClick={onNewQuestion} className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            New Question
          </Button>
        </div>
      </div>
    </header>
  );
};
