
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "@/hooks/use-toast";

export interface SupabaseQuestion {
  id: string;
  title: string;
  answer: string;
  code: string;
  language: string;
  category: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export const useSupabaseQuestions = () => {
  const [questions, setQuestions] = useState<SupabaseQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchQuestions = async () => {
    if (!user) {
      setQuestions([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching questions:', error);
        toast({
          title: "Error",
          description: "Failed to load questions",
          variant: "destructive"
        });
      } else {
        setQuestions(data || []);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast({
        title: "Error",
        description: "Failed to load questions",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [user]);

  const addQuestion = async (questionData: Omit<SupabaseQuestion, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('questions')
        .insert([
          {
            ...questionData,
            user_id: user.id
          }
        ]);

      if (error) {
        console.error('Error adding question:', error);
        toast({
          title: "Error",
          description: "Failed to save question",
          variant: "destructive"
        });
      } else {
        await fetchQuestions();
        toast({
          title: "Success",
          description: "Question saved successfully"
        });
      }
    } catch (error) {
      console.error('Error adding question:', error);
      toast({
        title: "Error",
        description: "Failed to save question",
        variant: "destructive"
      });
    }
  };

  const updateQuestion = async (id: string, questionData: Omit<SupabaseQuestion, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('questions')
        .update({
          ...questionData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        console.error('Error updating question:', error);
        toast({
          title: "Error",
          description: "Failed to update question",
          variant: "destructive"
        });
      } else {
        await fetchQuestions();
        toast({
          title: "Success",
          description: "Question updated successfully"
        });
      }
    } catch (error) {
      console.error('Error updating question:', error);
      toast({
        title: "Error",
        description: "Failed to update question",
        variant: "destructive"
      });
    }
  };

  const deleteQuestion = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('questions')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting question:', error);
        toast({
          title: "Error",
          description: "Failed to delete question",
          variant: "destructive"
        });
      } else {
        await fetchQuestions();
        toast({
          title: "Success",
          description: "Question deleted successfully"
        });
      }
    } catch (error) {
      console.error('Error deleting question:', error);
      toast({
        title: "Error",
        description: "Failed to delete question",
        variant: "destructive"
      });
    }
  };

  return {
    questions,
    loading,
    addQuestion,
    updateQuestion,
    deleteQuestion
  };
};
