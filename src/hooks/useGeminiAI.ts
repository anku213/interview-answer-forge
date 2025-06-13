
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useGeminiAI = () => {
  const [loading, setLoading] = useState(false);
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

  return {
    generateSolution,
    loading
  };
};
