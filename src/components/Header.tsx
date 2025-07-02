
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, LogOut, Code, User, Settings } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";

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
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left Section - Sidebar Toggle + Logo */}
        <div className="flex items-center space-x-4">
          <SidebarTrigger className="h-8 w-8 hover:bg-gray-100 rounded-lg transition-colors" />
          
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-xl shadow-lg">
              <Code className="h-6 w-6 text-white" />
            </div>
            <div className="hidden md:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Interview Prep
              </h1>
              <p className="text-xs text-gray-500 -mt-1">Master your coding interviews</p>
            </div>
          </div>
        </div>
        
        {/* Center Section - Search Bar */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search questions, topics, or code..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-4 py-2 w-full bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-300 transition-all duration-200 rounded-xl"
            />
          </div>
        </div>

        {/* Right Section - User Actions */}
        <div className="flex items-center space-x-3">
          {user && (
            <div className="hidden md:flex items-center space-x-3 px-3 py-2 bg-gray-50 rounded-xl border border-gray-200">
              <div className="bg-blue-100 p-1.5 rounded-lg">
                <User className="h-4 w-4 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-700 max-w-32 truncate">
                {user.email}
              </span>
            </div>
          )}
          
          <Button 
            onClick={onNewQuestion}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-200 rounded-xl px-4 py-2"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">New Question</span>
          </Button>

          <Button 
            variant="outline" 
            onClick={handleSettingsClick}
            className="border-gray-200 hover:bg-gray-50 transition-all duration-200 rounded-xl px-3 py-2"
            size="sm"
          >
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline ml-2">Settings</span>
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleSignOut}
            className="border-red-200 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all duration-200 rounded-xl px-3 py-2"
            size="sm"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline ml-2">Sign Out</span>
          </Button>
        </div>
      </div>
    </header>
  );
};
