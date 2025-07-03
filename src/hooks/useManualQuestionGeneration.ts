
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useManualQuestionGeneration = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const generateQuestions = async (options: {
    count?: number;
    difficulty?: 'Easy' | 'Medium' | 'Hard';
  } = {}) => {
    setLoading(true);
    
    try {
      console.log('Starting manual question generation...');
      
      const { data, error } = await supabase.functions.invoke('generate-company-questions', {
        body: {
          count: options.count || 5,
          difficulty: options.difficulty || 'Medium'
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Failed to generate questions');
      }

      if (!data?.success) {
        throw new Error(data?.error || 'Question generation failed');
      }

      console.log(`Successfully generated ${data.generated_count} questions`);

      toast({
        title: "Success!",
        description: `Generated ${data.generated_count} new company questions successfully.`,
      });

      return {
        success: true,
        count: data.generated_count,
        questions: data.questions
      };

    } catch (error) {
      console.error('Error generating questions:', error);
      
      toast({
        title: "Generation Failed",
        description: error.message || 'Failed to generate questions. Please try again.',
        variant: "destructive"
      });

      return {
        success: false,
        error: error.message
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    generateQuestions,
    loading
  };
};
