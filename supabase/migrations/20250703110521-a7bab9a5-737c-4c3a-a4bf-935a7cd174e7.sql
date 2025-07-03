
-- Create a table to store cron job configurations
CREATE TABLE public.cron_configurations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  job_name TEXT NOT NULL,
  schedule TEXT NOT NULL, -- cron expression like '0 0 * * *' for daily
  is_active BOOLEAN NOT NULL DEFAULT false,
  last_run_at TIMESTAMP WITH TIME ZONE,
  next_run_at TIMESTAMP WITH TIME ZONE,
  configuration JSONB, -- store job-specific config like company selection, question types, etc.
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for cron configurations
ALTER TABLE public.cron_configurations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own cron configurations" 
  ON public.cron_configurations 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own cron configurations" 
  ON public.cron_configurations 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cron configurations" 
  ON public.cron_configurations 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cron configurations" 
  ON public.cron_configurations 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_cron_configurations_updated_at
  BEFORE UPDATE ON public.cron_configurations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- Enable pg_cron extension (this might need to be done by Supabase admin)
-- This is needed for scheduling cron jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;
