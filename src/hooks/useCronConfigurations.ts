
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "@/hooks/use-toast";

export interface CronConfiguration {
  id: string;
  user_id: string;
  job_name: string;
  schedule: string;
  is_active: boolean;
  last_run_at: string | null;
  next_run_at: string | null;
  configuration: any;
  created_at: string;
  updated_at: string;
}

export const useCronConfigurations = () => {
  const [configurations, setConfigurations] = useState<CronConfiguration[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchConfigurations = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('cron_configurations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching cron configurations:', error);
        toast({
          title: "Error",
          description: "Failed to load cron configurations",
          variant: "destructive"
        });
      } else {
        setConfigurations(data || []);
      }
    } catch (error) {
      console.error('Error fetching cron configurations:', error);
      toast({
        title: "Error",
        description: "Failed to load cron configurations",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createConfiguration = async (config: {
    job_name: string;
    schedule: string;
    configuration?: any;
  }) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create cron jobs",
        variant: "destructive"
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from('cron_configurations')
        .insert([{
          user_id: user.id,
          job_name: config.job_name,
          schedule: config.schedule,
          configuration: config.configuration || {},
          is_active: false
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Cron job configuration created successfully"
      });
      
      await fetchConfigurations();
      return true;
    } catch (error) {
      console.error('Error creating cron configuration:', error);
      toast({
        title: "Error",
        description: "Failed to create cron job configuration",
        variant: "destructive"
      });
      return false;
    }
  };

  const updateConfiguration = async (id: string, updates: Partial<CronConfiguration>) => {
    try {
      const { error } = await supabase
        .from('cron_configurations')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Configuration updated successfully"
      });
      
      await fetchConfigurations();
      return true;
    } catch (error) {
      console.error('Error updating cron configuration:', error);
      toast({
        title: "Error",
        description: "Failed to update configuration",
        variant: "destructive"
      });
      return false;
    }
  };

  const deleteConfiguration = async (id: string) => {
    try {
      const { error } = await supabase
        .from('cron_configurations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Configuration deleted successfully"
      });
      
      await fetchConfigurations();
      return true;
    } catch (error) {
      console.error('Error deleting cron configuration:', error);
      toast({
        title: "Error",
        description: "Failed to delete configuration",
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    fetchConfigurations();
  }, [user]);

  return {
    configurations,
    loading,
    createConfiguration,
    updateConfiguration,
    deleteConfiguration,
    refetch: fetchConfigurations
  };
};
