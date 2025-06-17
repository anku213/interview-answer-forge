
import { InterviewContext } from '@/hooks/useInterviewContext';
import { AIInterview } from '@/hooks/useAIInterviews';

export const buildInterviewPrompt = (
  interview: AIInterview,
  context: InterviewContext,
  userMessage?: string
): string => {
  const baseContext = `You are conducting a professional technical interview for a ${interview.experience_level} ${interview.technology} position.

Interview Details:
- Title: ${interview.title}
- Technology: ${interview.technology}
- Experience Level: ${interview.experience_level}
- Difficulty: ${interview.difficulty_level}
- Current Phase: ${context.interviewPhase}

CRITICAL INSTRUCTIONS:
1. Ask ONLY ONE question at a time
2. Keep responses concise and professional
3. Each question should naturally follow from the previous answer
4. Do not repeat questions already asked
5. Maintain a conversational, interview-like tone

Already Asked Questions (DO NOT REPEAT):
${context.askedQuestions.map(q => `- ${q}`).join('\n')}

User Profile Built So Far:
${Object.entries(context.userProfile).map(([key, value]) => 
  `- ${key}: ${Array.isArray(value) ? value.join(', ') : value}`
).join('\n')}`;

  if (context.interviewPhase === 'introduction' && context.conversationHistory.length === 0) {
    return `${baseContext}

Start the interview with a warm, professional greeting and ask the candidate to introduce themselves. Be friendly but maintain professionalism.`;
  }

  if (userMessage) {
    const recentHistory = context.conversationHistory.slice(-4).map(msg => 
      `${msg.role === 'user' ? 'Candidate' : 'Interviewer'}: ${msg.content}`
    ).join('\n\n');

    return `${baseContext}

Recent Conversation:
${recentHistory}

Candidate's Latest Response: ${userMessage}

Based on their response, generate the next logical follow-up question. Consider:
- What technical aspects to explore deeper
- Whether to move to a different topic
- If it's time to progress to the next interview phase
- How to build on what they just shared

Respond with only your next question or comment, keeping it natural and conversational.`;
  }

  return baseContext;
};

export const extractQuestionFromResponse = (response: string): string => {
  // Extract the main question from the AI response
  const sentences = response.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const questionSentences = sentences.filter(s => s.includes('?'));
  
  if (questionSentences.length > 0) {
    return questionSentences[0].trim();
  }
  
  // If no question mark, return the last meaningful sentence
  return sentences[sentences.length - 1]?.trim() || response;
};
