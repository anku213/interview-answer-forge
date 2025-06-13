
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, LogOut, Code } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface HeaderProps {
  onNewQuestion: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export const Header = ({ onNewQuestion, searchTerm, onSearchChange }: HeaderProps) => {
  const { signOut, user } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Code className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-semibold">Interview Prep</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 flex-1 max-w-md mx-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {user && (
              <span className="text-sm text-muted-foreground mr-2">
                {user.email}
              </span>
            )}
            <Button onClick={onNewQuestion}>
              <Plus className="h-4 w-4 mr-2" />
              New Question
            </Button>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
