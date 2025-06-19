
-- Create a table for daily challenges
CREATE TABLE public.daily_challenges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  challenge_date DATE NOT NULL UNIQUE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  tags TEXT[] DEFAULT '{}',
  ai_hint TEXT,
  question_type TEXT NOT NULL DEFAULT 'Coding',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create a table for peer solutions
CREATE TABLE public.challenge_solutions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  challenge_id UUID REFERENCES public.daily_challenges(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  language TEXT DEFAULT 'javascript',
  author_name TEXT,
  upvotes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create a table for user submissions
CREATE TABLE public.user_challenge_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  challenge_id UUID REFERENCES public.daily_challenges(id) ON DELETE CASCADE,
  answer TEXT NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  bookmarked BOOLEAN DEFAULT false,
  UNIQUE(user_id, challenge_id)
);

-- Create a table for user streaks and stats
CREATE TABLE public.user_challenge_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  total_completed INTEGER DEFAULT 0,
  last_completion_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security
ALTER TABLE public.daily_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_solutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_challenge_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_challenge_stats ENABLE ROW LEVEL SECURITY;

-- Policies for daily_challenges (public read access)
CREATE POLICY "Anyone can view daily challenges" 
  ON public.daily_challenges 
  FOR SELECT 
  TO authenticated, anon
  USING (true);

-- Policies for challenge_solutions (public read access)
CREATE POLICY "Anyone can view challenge solutions" 
  ON public.challenge_solutions 
  FOR SELECT 
  TO authenticated, anon
  USING (true);

-- Policies for user_challenge_submissions
CREATE POLICY "Users can view their own submissions" 
  ON public.user_challenge_submissions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own submissions" 
  ON public.user_challenge_submissions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own submissions" 
  ON public.user_challenge_submissions 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Policies for user_challenge_stats
CREATE POLICY "Users can view their own stats" 
  ON public.user_challenge_stats 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own stats" 
  ON public.user_challenge_stats 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own stats" 
  ON public.user_challenge_stats 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Insert some sample daily challenges
INSERT INTO public.daily_challenges (challenge_date, title, content, difficulty, tags, ai_hint, question_type) VALUES
('2025-06-19', 'Two Sum Problem', 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.', 'Easy', '{"Arrays", "Hash Table", "Two Pointers"}', 'Try using a hash map to store numbers you''ve seen and their indices. For each number, check if target - current number exists in the hash map.', 'Coding'),
('2025-06-18', 'Valid Parentheses', 'Given a string s containing just the characters ''('', '')'', ''{'', ''}'', ''['' and '']'', determine if the input string is valid. An input string is valid if: Open brackets must be closed by the same type of brackets. Open brackets must be closed in the correct order.', 'Easy', '{"Stack", "String"}', 'Use a stack data structure. Push opening brackets onto the stack and pop when you encounter closing brackets. Make sure they match!', 'Coding'),
('2025-06-17', 'Maximum Subarray', 'Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.', 'Medium', '{"Dynamic Programming", "Arrays", "Kadane Algorithm"}', 'This is a classic application of Kadane''s algorithm. Keep track of the maximum sum ending at each position.', 'Coding');

-- Insert some sample peer solutions
INSERT INTO public.challenge_solutions (challenge_id, title, content, language, author_name, upvotes) VALUES
((SELECT id FROM public.daily_challenges WHERE challenge_date = '2025-06-19'), 'Hash Map Solution', 'function twoSum(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if (map.has(complement)) {\n            return [map.get(complement), i];\n        }\n        map.set(nums[i], i);\n    }\n    return [];\n}', 'javascript', 'CodeMaster', 15),
((SELECT id FROM public.daily_challenges WHERE challenge_date = '2025-06-19'), 'Python Dictionary Solution', 'def two_sum(nums, target):\n    num_dict = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in num_dict:\n            return [num_dict[complement], i]\n        num_dict[num] = i\n    return []', 'python', 'PytonPro', 12);
