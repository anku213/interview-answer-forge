
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/useAuth";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Dashboard from "@/pages/Dashboard";
import Questions from "@/pages/Questions";
import AIInterview from "@/pages/AIInterview";
import InterviewPanel from "@/pages/InterviewPanel";
import CompanyQuestions from "@/pages/CompanyQuestions";
import CompanyQuestionsList from "@/pages/CompanyQuestionsList";
import QuestionDetail from "@/pages/QuestionDetail";
import DailyChallenge from "@/pages/DailyChallenge";
import ResumeAnalyzer from "@/pages/ResumeAnalyzer";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Settings from "@/pages/Settings";
import { useAuth } from "@/hooks/useAuth";
import "./App.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Layout component for authenticated users with sidebar
const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset className="flex-1 min-w-0">
          <div className="flex flex-col min-h-screen">
            <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
              <div className="flex items-center px-4 sm:px-6 py-3">
                <SidebarTrigger className="mr-4" />
                <h1 className="text-lg font-semibold truncate">Interview Prep Platform</h1>
              </div>
            </header>
            <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
              <div className="max-w-full mx-auto">
                {children}
              </div>
            </main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

// Component to handle authenticated routes
const AuthenticatedApp = () => {
  return (
    <Routes>
      <Route path="/" element={<AppLayout><Dashboard /></AppLayout>} />
      <Route path="/questions" element={<AppLayout><Questions /></AppLayout>} />
      <Route path="/ai-interview" element={<AppLayout><AIInterview /></AppLayout>} />
      <Route path="/ai-interview/:interviewId" element={<AppLayout><InterviewPanel /></AppLayout>} />
      <Route path="/company-questions" element={<AppLayout><CompanyQuestions /></AppLayout>} />
      <Route path="/company-questions/:companyId" element={<AppLayout><CompanyQuestionsList /></AppLayout>} />
      <Route path="/company-questions/:companyId/:questionId" element={<AppLayout><QuestionDetail /></AppLayout>} />
      <Route path="/daily-challenge" element={<AppLayout><DailyChallenge /></AppLayout>} />
      <Route path="/resume-analyzer" element={<AppLayout><ResumeAnalyzer /></AppLayout>} />
      <Route path="/settings" element={<AppLayout><Settings /></AppLayout>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

// Component to handle routing based on auth state
const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/auth" element={user ? <Navigate to="/" replace /> : <Auth />} />
      <Route path="/legacy" element={<Index />} />
      <Route 
        path="/*" 
        element={
          user ? (
            <AuthenticatedApp />
          ) : (
            <Navigate to="/auth" replace />
          )
        } 
      />
    </Routes>
  );
};

function App() {
  console.log('App component rendering');
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <AppRoutes />
          <Toaster />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
