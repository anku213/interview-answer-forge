
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useGeminiAI = () => {
  const [loading, setLoading] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const { toast } = useToast();

  const generateSolution = async (questionData: {
    title: string;
    language: string;
    category: string;
    existingCode?: string;
    existingAnswer?: string;
  }) => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-ai-solution', {
        body: questionData
      });

      if (error) {
        console.error('Error calling Gemini AI:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to generate AI solution",
          variant: "destructive"
        });
        return null;
      }

      if (data?.error) {
        console.error('Gemini AI error:', data.error);
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive"
        });
        return null;
      }

      toast({
        title: "Success",
        description: "AI solution generated successfully"
      });

      return data.solution;
    } catch (error) {
      console.error('Error generating AI solution:', error);
      toast({
        title: "Error",
        description: "Failed to generate AI solution",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const reviewCode = async (codeData: {
    code: string;
    language: string;
    title?: string;
    category?: string;
  }) => {
    setReviewLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('review-code', {
        body: codeData
      });

      if (error) {
        console.error('Error calling Gemini AI for code review:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to review code",
          variant: "destructive"
        });
        return null;
      }

      if (data?.error) {
        console.error('Gemini AI code review error:', data.error);
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive"
        });
        return null;
      }

      toast({
        title: "Success",
        description: "Code review completed successfully"
      });

      return data.review;
    } catch (error) {
      console.error('Error reviewing code:', error);
      toast({
        title: "Error",
        description: "Failed to review code",
        variant: "destructive"
      });
      return null;
    } finally {
      setReviewLoading(false);
    }
  };

  const generateResponse = async (prompt: string) => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-ai-solution', {
        body: { 
          title: "AI Interview Response",
          language: "general",
          category: "interview",
          existingCode: prompt,
          existingAnswer: ""
        }
      });

      if (error) {
        console.error('Error calling Gemini AI for response:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to generate AI response",
          variant: "destructive"
        });
        return null;
      }

      if (data?.error) {
        console.error('Gemini AI response error:', data.error);
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive"
        });
        return null;
      }

      return data.solution;
    } catch (error) {
      console.error('Error generating AI response:', error);
      toast({
        title: "Error",
        description: "Failed to generate AI response",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    generateSolution,
    reviewCode,
    generateResponse,
    loading,
    reviewLoading,
    isLoading: loading
  };
};
