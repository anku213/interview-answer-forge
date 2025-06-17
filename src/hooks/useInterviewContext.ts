
import { useState, useCallback } from 'react';

export interface InterviewContext {
  askedQuestions: string[];
  interviewPhase: 'introduction' | 'technical' | 'experience' | 'conclusion';
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string; timestamp: string }>;
  userProfile: {
    name?: string;
    experience?: string;
    strengths?: string[];
    weaknesses?: string[];
  };
}

export const useInterviewContext = () => {
  const [context, setContext] = useState<InterviewContext>({
    askedQuestions: [],
    interviewPhase: 'introduction',
    conversationHistory: [],
    userProfile: {},
  });

  const addAskedQuestion = useCallback((question: string) => {
    setContext(prev => ({
      ...prev,
      askedQuestions: [...prev.askedQuestions, question.toLowerCase()],
    }));
  }, []);

  const updatePhase = useCallback((phase: InterviewContext['interviewPhase']) => {
    setContext(prev => ({
      ...prev,
      interviewPhase: phase,
    }));
  }, []);

  const updateUserProfile = useCallback((updates: Partial<InterviewContext['userProfile']>) => {
    setContext(prev => ({
      ...prev,
      userProfile: {
        ...prev.userProfile,
        ...updates,
      },
    }));
  }, []);

  const addToHistory = useCallback((role: 'user' | 'assistant', content: string) => {
    setContext(prev => ({
      ...prev,
      conversationHistory: [
        ...prev.conversationHistory,
        { role, content, timestamp: new Date().toISOString() },
      ],
    }));
  }, []);

  const isQuestionAlreadyAsked = useCallback((question: string): boolean => {
    const normalizedQuestion = question.toLowerCase();
    return context.askedQuestions.some(asked => 
      asked.includes(normalizedQuestion) || normalizedQuestion.includes(asked)
    );
  }, [context.askedQuestions]);

  return {
    context,
    addAskedQuestion,
    updatePhase,
    updateUserProfile,
    addToHistory,
    isQuestionAlreadyAsked,
  };
};
