
-- Create table for storing resume analyses
CREATE TABLE public.resume_analyses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  user_email TEXT,
  resume_file_name TEXT NOT NULL,
  resume_file_url TEXT,
  job_role TEXT NOT NULL,
  experience_level TEXT,
  ai_feedback_formatting TEXT,
  ai_feedback_keywords TEXT,
  ai_feedback_structure TEXT,
  improvement_suggestions TEXT,
  overall_score INTEGER,
  status TEXT DEFAULT 'processing',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.resume_analyses ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own analyses (or all if no user_id)
CREATE POLICY "Users can view their own analyses" 
  ON public.resume_analyses 
  FOR SELECT 
  USING (auth.uid() = user_id OR user_id IS NULL);

-- Create policy for users to create analyses
CREATE POLICY "Users can create analyses" 
  ON public.resume_analyses 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Create policy for users to update their own analyses
CREATE POLICY "Users can update their own analyses" 
  ON public.resume_analyses 
  FOR UPDATE 
  USING (auth.uid() = user_id OR user_id IS NULL);

-- Create storage bucket for resume files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('resumes', 'resumes', false);

-- Storage policies for resume uploads
CREATE POLICY "Users can upload resumes" 
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (bucket_id = 'resumes');

CREATE POLICY "Users can view resumes" 
  ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'resumes');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_resume_analyses_updated_at
  BEFORE UPDATE ON public.resume_analyses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();
