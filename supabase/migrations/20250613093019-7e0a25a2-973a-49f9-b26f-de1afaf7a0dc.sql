
-- Create a table for interview questions
CREATE TABLE public.questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  answer TEXT NOT NULL,
  code TEXT NOT NULL DEFAULT '',
  language TEXT NOT NULL DEFAULT 'javascript',
  category TEXT NOT NULL DEFAULT 'other',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to ensure users can only see their own questions
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to SELECT their own questions
CREATE POLICY "Users can view their own questions" 
  ON public.questions 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy that allows users to INSERT their own questions
CREATE POLICY "Users can create their own questions" 
  ON public.questions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy that allows users to UPDATE their own questions
CREATE POLICY "Users can update their own questions" 
  ON public.questions 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy that allows users to DELETE their own questions
CREATE POLICY "Users can delete their own questions" 
  ON public.questions 
  FOR DELETE 
  USING (auth.uid() = user_id);
