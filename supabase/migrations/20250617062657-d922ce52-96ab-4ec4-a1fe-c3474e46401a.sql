
-- Check if RLS is enabled and add missing policies only

-- Enable RLS on ai_interviews if not already enabled (this is safe to run multiple times)
ALTER TABLE public.ai_interviews ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them to ensure consistency
DROP POLICY IF EXISTS "Users can view their own interviews" ON public.ai_interviews;
DROP POLICY IF EXISTS "Users can create their own interviews" ON public.ai_interviews;
DROP POLICY IF EXISTS "Users can update their own interviews" ON public.ai_interviews;
DROP POLICY IF EXISTS "Users can delete their own interviews" ON public.ai_interviews;

-- Recreate policies for ai_interviews
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

-- Enable RLS on interview_messages if not already enabled
ALTER TABLE public.interview_messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Users can view messages for their interviews" ON public.interview_messages;
DROP POLICY IF EXISTS "Users can create messages for their interviews" ON public.interview_messages;
DROP POLICY IF EXISTS "Users can view their own interview messages" ON public.interview_messages;
DROP POLICY IF EXISTS "Users can create messages in their own interviews" ON public.interview_messages;
DROP POLICY IF EXISTS "Users can delete messages from their own interviews" ON public.interview_messages;

-- Recreate policies for interview_messages
CREATE POLICY "Users can view their own interview messages" 
  ON public.interview_messages 
  FOR SELECT 
  USING (auth.uid() IN (
    SELECT user_id FROM ai_interviews WHERE id = interview_messages.interview_id
  ));

CREATE POLICY "Users can create messages in their own interviews" 
  ON public.interview_messages 
  FOR INSERT 
  WITH CHECK (auth.uid() IN (
    SELECT user_id FROM ai_interviews WHERE id = interview_messages.interview_id
  ));

CREATE POLICY "Users can delete messages from their own interviews" 
  ON public.interview_messages 
  FOR DELETE 
  USING (auth.uid() IN (
    SELECT user_id FROM ai_interviews WHERE id = interview_messages.interview_id
  ));

-- Add foreign key constraint if it doesn't exist (this will enable CASCADE DELETE)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'interview_messages_interview_id_fkey'
        AND table_name = 'interview_messages'
    ) THEN
        ALTER TABLE public.interview_messages 
        ADD CONSTRAINT interview_messages_interview_id_fkey 
        FOREIGN KEY (interview_id) REFERENCES public.ai_interviews(id) ON DELETE CASCADE;
    END IF;
END $$;
