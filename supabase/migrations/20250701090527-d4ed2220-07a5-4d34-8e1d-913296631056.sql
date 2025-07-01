
-- Add email column as required field (if not already present)
ALTER TABLE resume_analyses 
ALTER COLUMN user_email SET NOT NULL;

-- Update the AI feedback columns to support structured JSON format
ALTER TABLE resume_analyses 
ADD COLUMN IF NOT EXISTS structured_feedback JSONB,
ADD COLUMN IF NOT EXISTS email_sent BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS email_sent_at TIMESTAMP WITH TIME ZONE;

-- Create an index on email_sent for better query performance
CREATE INDEX IF NOT EXISTS idx_resume_analyses_email_sent ON resume_analyses(email_sent);

-- Update existing records to have structured feedback if they have old format
UPDATE resume_analyses 
SET structured_feedback = jsonb_build_object(
  'formatting_and_design', CASE WHEN ai_feedback_formatting IS NOT NULL THEN array[ai_feedback_formatting] ELSE array[]::text[] END,
  'keywords_and_skills', CASE WHEN ai_feedback_keywords IS NOT NULL THEN array[ai_feedback_keywords] ELSE array[]::text[] END,
  'structure_and_organization', CASE WHEN ai_feedback_structure IS NOT NULL THEN array[ai_feedback_structure] ELSE array[]::text[] END,
  'improvement_recommendations', CASE WHEN improvement_suggestions IS NOT NULL THEN array[improvement_suggestions] ELSE array[]::text[] END
)
WHERE structured_feedback IS NULL AND status = 'completed';
