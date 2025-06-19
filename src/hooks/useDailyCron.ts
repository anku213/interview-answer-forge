
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useDailyCron = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const testDailyChallengeGeneration = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-daily-challenge');
      
      if (error) {
        console.error('Error testing daily challenge:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to test daily challenge generation",
          variant: "destructive"
        });
        return false;
      }

      toast({
        title: "Success",
        description: data.message || "Daily challenge generated successfully",
      });
      return true;
    } catch (error) {
      console.error('Error testing daily challenge:', error);
      toast({
        title: "Error",
        description: "Failed to test daily challenge generation",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    testDailyChallengeGeneration,
    loading
  };
};
