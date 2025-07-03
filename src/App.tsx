
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/AppSidebar";
import { Header } from "./components/Header";
import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import Questions from "./pages/Questions";
import QuestionDetail from "./pages/QuestionDetail";
import Auth from "./pages/Auth";
import Settings from "./pages/Settings";
import DailyChallenge from "./pages/DailyChallenge";
import CompanyQuestions from "./pages/CompanyQuestions";
import CompanyQuestionsList from "./pages/CompanyQuestionsList";
import AIInterview from "./pages/AIInterview";
import InterviewPanel from "./pages/InterviewPanel";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import NotFound from "./pages/NotFound";
import { useAuth } from "./hooks/useAuth";
import { ProtectedRoute } from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => {
  const { user, loading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  const handleNewQuestion = () => {
    window.location.href = "/questions";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Auth />
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SidebarProvider defaultOpen={true}>
            <div className="min-h-screen flex w-full bg-gray-50">
              <AppSidebar />
              <SidebarInset className="flex-1">
                <Header 
                  onNewQuestion={handleNewQuestion}
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                />
                <main className="flex-1 overflow-auto">
                  <Routes>
                    <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/questions" element={<ProtectedRoute><Questions searchTerm={searchTerm} /></ProtectedRoute>} />
                    <Route path="/questions/:id" element={<ProtectedRoute><QuestionDetail /></ProtectedRoute>} />
                    <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                    <Route path="/daily-challenge" element={<ProtectedRoute><DailyChallenge /></ProtectedRoute>} />
                    <Route path="/company-questions" element={<ProtectedRoute><CompanyQuestions /></ProtectedRoute>} />
                    <Route path="/company-questions/:companyId" element={<ProtectedRoute><CompanyQuestionsList /></ProtectedRoute>} />
                    <Route path="/company-questions/:companyId/:questionId" element={<ProtectedRoute><QuestionDetail /></ProtectedRoute>} />
                    <Route path="/ai-interview" element={<ProtectedRoute><AIInterview /></ProtectedRoute>} />
                    <Route path="/ai-interview/:interviewId" element={<ProtectedRoute><InterviewPanel /></ProtectedRoute>} />
                    <Route path="/resume-analyzer" element={<ProtectedRoute><ResumeAnalyzer /></ProtectedRoute>} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
              </SidebarInset>
            </div>
          </SidebarProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
