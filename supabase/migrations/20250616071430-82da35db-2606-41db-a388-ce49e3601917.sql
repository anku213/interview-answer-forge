
-- Create a table for AI interviews
CREATE TABLE public.ai_interviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  technology TEXT NOT NULL,
  experience_level TEXT NOT NULL,
  difficulty_level TEXT NOT NULL CHECK (difficulty_level IN ('Easy', 'Intermediate', 'Hard')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create a table for interview messages/chat history
CREATE TABLE public.interview_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  interview_id UUID REFERENCES public.ai_interviews(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) for ai_interviews
ALTER TABLE public.ai_interviews ENABLE ROW LEVEL SECURITY;

-- Create policies for ai_interviews
CREATE POLICY "Users can view their own interviews" 
  ON public.ai_interviews 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own interviews" 
  ON public.ai_interviews 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own interviews" 
  ON public.ai_interviews 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own interviews" 
  ON public.ai_interviews 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add Row Level Security (RLS) for interview_messages
ALTER TABLE public.interview_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for interview_messages (users can access messages for their interviews)
CREATE POLICY "Users can view messages for their interviews" 
  ON public.interview_messages 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.ai_interviews 
      WHERE ai_interviews.id = interview_messages.interview_id 
      AND ai_interviews.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create messages for their interviews" 
  ON public.interview_messages 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.ai_interviews 
      WHERE ai_interviews.id = interview_messages.interview_id 
      AND ai_interviews.user_id = auth.uid()
    )
  );
