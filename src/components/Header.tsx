
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, LogOut, Code, User, Settings } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  onNewQuestion: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export const Header = ({ onNewQuestion, searchTerm, onSearchChange }: HeaderProps) => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
  };

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  return (
    <header className="border-b bg-gradient-to-r from-background via-background to-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
              <div className="bg-primary/10 p-2 rounded-xl">
                <Code className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Interview Prep
                </h1>
                <p className="text-xs text-muted-foreground">Master your coding interviews</p>
              </div>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="flex items-center space-x-4 flex-1 max-w-lg mx-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search questions, topics, or code..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-12 pr-4 py-3 bg-background/50 border-2 border-border/50 focus:border-primary/50 focus:bg-background transition-all duration-200 rounded-xl"
              />
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-3">
            {user && (
              <div className="flex items-center space-x-3 px-4 py-2 bg-muted/30 rounded-xl border">
                <div className="bg-primary/10 p-1.5 rounded-lg">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground max-w-32 truncate">
                  {user.email}
                </span>
              </div>
            )}
            
            <Button 
              onClick={onNewQuestion}
              className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl px-6"
              size="lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Question
            </Button>

            <Button 
              variant="outline" 
              onClick={handleSettingsClick}
              className="border-2 hover:bg-muted/50 transition-all duration-200 rounded-xl px-4"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleSignOut}
              className="border-2 hover:bg-destructive/10 hover:border-destructive/50 hover:text-destructive transition-all duration-200 rounded-xl px-4"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
