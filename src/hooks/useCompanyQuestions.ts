import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "@/hooks/use-toast";

export interface CompanyQuestion {
  id: string;
  company_id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  question_type: 'MCQ' | 'Coding' | 'Theoretical';
  tags: string[];
  content: string;
  ai_hint: string | null;
  ai_explanation: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  question_id: string;
  solved: boolean | null;
  bookmarked: boolean | null;
  user_answer: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export const useCompanyQuestions = (companyId?: string) => {
  const [questions, setQuestions] = useState<CompanyQuestion[]>([]);
  const [userProgress, setUserProgress] = useState<Record<string, UserProgress>>({});
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchQuestions = async () => {
    try {
      let query = supabase
        .from('company_questions')
        .select('*')
        .order('created_at', { ascending: false });

      if (companyId) {
        query = query.eq('company_id', companyId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching company questions:', error);
        toast({
          title: "Error",
          description: "Failed to load questions",
          variant: "destructive"
        });
      } else {
        // Type assertion to ensure the data matches our interface
        const typedData = (data || []) as CompanyQuestion[];
        setQuestions(typedData);
        
        // Fetch user progress for these questions if user is logged in
        if (user && typedData) {
          await fetchUserProgress(typedData.map(q => q.id));
        }
      }
    } catch (error) {
      console.error('Error fetching company questions:', error);
      toast({
        title: "Error",
        description: "Failed to load questions",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProgress = async (questionIds: string[]) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .in('question_id', questionIds);

      if (error) {
        console.error('Error fetching user progress:', error);
      } else {
        const progressMap = (data || []).reduce((acc, progress) => {
          acc[progress.question_id] = progress;
          return acc;
        }, {} as Record<string, UserProgress>);
        setUserProgress(progressMap);
      }
    } catch (error) {
      console.error('Error fetching user progress:', error);
    }
  };

  const updateUserProgress = async (
    questionId: string,
    updates: Partial<Pick<UserProgress, 'solved' | 'bookmarked' | 'user_answer' | 'notes'>>
  ) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to track your progress",
        variant: "destructive"
      });
      return;
    }

    try {
      const existingProgress = userProgress[questionId];
      
      if (existingProgress) {
        // Update existing progress
        const { error } = await supabase
          .from('user_progress')
          .update({
            ...updates,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingProgress.id);

        if (error) throw error;
      } else {
        // Create new progress entry
        const { error } = await supabase
          .from('user_progress')
          .insert([{
            user_id: user.id,
            question_id: questionId,
            ...updates
          }]);

        if (error) throw error;
      }

      // Refresh progress data
      await fetchUserProgress([questionId]);
      
      toast({
        title: "Success",
        description: "Progress updated successfully"
      });
    } catch (error) {
      console.error('Error updating user progress:', error);
      toast({
        title: "Error",
        description: "Failed to update progress",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [companyId, user]);

  return {
    questions,
    userProgress,
    loading,
    updateUserProgress,
    refetch: fetchQuestions
  };
};
