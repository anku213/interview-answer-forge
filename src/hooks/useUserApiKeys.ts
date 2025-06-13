
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "@/hooks/use-toast";

export interface UserApiKeys {
  id: string;
  user_id: string;
  gemini_api_key: string | null;
  created_at: string;
  updated_at: string;
}

export const useUserApiKeys = () => {
  const [apiKeys, setApiKeys] = useState<UserApiKeys | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchApiKeys = async () => {
    if (!user) {
      setApiKeys(null);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_api_keys')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('Error fetching API keys:', error);
        toast({
          title: "Error",
          description: "Failed to load API keys",
          variant: "destructive"
        });
      } else {
        setApiKeys(data || null);
      }
    } catch (error) {
      console.error('Error fetching API keys:', error);
      toast({
        title: "Error",
        description: "Failed to load API keys",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApiKeys();
  }, [user]);

  const saveGeminiApiKey = async (geminiApiKey: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_api_keys')
        .upsert({
          user_id: user.id,
          gemini_api_key: geminiApiKey,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error saving Gemini API key:', error);
        toast({
          title: "Error",
          description: "Failed to save Gemini API key",
          variant: "destructive"
        });
      } else {
        await fetchApiKeys();
        toast({
          title: "Success",
          description: "Gemini API key saved successfully"
        });
      }
    } catch (error) {
      console.error('Error saving Gemini API key:', error);
      toast({
        title: "Error",
        description: "Failed to save Gemini API key",
        variant: "destructive"
      });
    }
  };

  const deleteGeminiApiKey = async () => {
    if (!user || !apiKeys) return;

    try {
      const { error } = await supabase
        .from('user_api_keys')
        .update({
          gemini_api_key: null,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting Gemini API key:', error);
        toast({
          title: "Error",
          description: "Failed to delete Gemini API key",
          variant: "destructive"
        });
      } else {
        await fetchApiKeys();
        toast({
          title: "Success",
          description: "Gemini API key deleted successfully"
        });
      }
    } catch (error) {
      console.error('Error deleting Gemini API key:', error);
      toast({
        title: "Error",
        description: "Failed to delete Gemini API key",
        variant: "destructive"
      });
    }
  };

  return {
    apiKeys,
    loading,
    saveGeminiApiKey,
    deleteGeminiApiKey
  };
};
