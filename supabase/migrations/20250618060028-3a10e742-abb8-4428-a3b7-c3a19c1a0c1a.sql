
-- Create companies table
CREATE TABLE public.companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create company_questions table
CREATE TABLE public.company_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  question_type TEXT NOT NULL CHECK (question_type IN ('MCQ', 'Coding', 'Theoretical')),
  tags TEXT[] DEFAULT '{}',
  content TEXT NOT NULL,
  ai_hint TEXT,
  ai_explanation TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_progress table for tracking user interactions
CREATE TABLE public.user_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  question_id UUID NOT NULL REFERENCES public.company_questions(id) ON DELETE CASCADE,
  solved BOOLEAN DEFAULT false,
  bookmarked BOOLEAN DEFAULT false,
  user_answer TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, question_id)
);

-- Enable Row Level Security
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for companies (readable by everyone)
CREATE POLICY "Anyone can view companies" 
  ON public.companies 
  FOR SELECT 
  USING (true);

-- RLS Policies for company_questions (readable by everyone)
CREATE POLICY "Anyone can view company questions" 
  ON public.company_questions 
  FOR SELECT 
  USING (true);

-- RLS Policies for user_progress (users can only access their own progress)
CREATE POLICY "Users can view their own progress" 
  ON public.user_progress 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own progress" 
  ON public.user_progress 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" 
  ON public.user_progress 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own progress" 
  ON public.user_progress 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Insert sample companies
INSERT INTO public.companies (name, logo_url) VALUES
('Google', 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg'),
('Amazon', 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg'),
('Microsoft', 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg'),
('Meta', 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg'),
('Apple', 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg'),
('Netflix', 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg');

-- Insert sample questions
INSERT INTO public.company_questions (company_id, title, difficulty, question_type, tags, content, ai_hint, ai_explanation) VALUES
(
  (SELECT id FROM public.companies WHERE name = 'Google'),
  'Two Sum Problem',
  'Easy',
  'Coding',
  ARRAY['Arrays', 'Hash Map'],
  'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
  'Consider using a hash map to store numbers you''ve seen and their indices.',
  'Use a hash map to store each number and its index as you iterate. For each number, check if target - current number exists in the map.'
),
(
  (SELECT id FROM public.companies WHERE name = 'Google'),
  'What is MapReduce?',
  'Medium',
  'Theoretical',
  ARRAY['System Design', 'Distributed Systems'],
  'Explain the MapReduce programming model and how it works in distributed computing.',
  'Think about breaking down large problems into smaller, parallelizable tasks.',
  'MapReduce is a programming model for processing large datasets across distributed clusters by breaking work into Map and Reduce phases.'
),
(
  (SELECT id FROM public.companies WHERE name = 'Amazon'),
  'Design a URL Shortener',
  'Hard',
  'Theoretical',
  ARRAY['System Design', 'Scalability'],
  'Design a URL shortening service like bit.ly. Consider scalability, reliability, and performance.',
  'Consider the encoding scheme, database design, and caching strategy.',
  'Key components: encoding algorithm (base62), database sharding, caching layer, load balancers, and analytics tracking.'
),
(
  (SELECT id FROM public.companies WHERE name = 'Microsoft'),
  'Reverse a Linked List',
  'Medium',
  'Coding',
  ARRAY['Linked Lists', 'Pointers'],
  'Given the head of a singly linked list, reverse the list, and return the reversed list.',
  'Use three pointers: previous, current, and next.',
  'Iterate through the list with three pointers, reversing the direction of each link one by one.'
),
(
  (SELECT id FROM public.companies WHERE name = 'Meta'),
  'SQL: Find Second Highest Salary',
  'Medium',
  'Coding',
  ARRAY['SQL', 'Database'],
  'Write a SQL query to find the second highest salary from an Employee table.',
  'Consider using LIMIT and OFFSET, or window functions.',
  'Use DISTINCT, ORDER BY DESC, and LIMIT with OFFSET, or use ROW_NUMBER() window function.'
);
