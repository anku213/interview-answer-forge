
import { useState, useEffect } from "react";
import { Question } from "@/types/Question";

export const useQuestions = () => {
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    const savedQuestions = localStorage.getItem("interviewQuestions");
    if (savedQuestions) {
      setQuestions(JSON.parse(savedQuestions));
    }
  }, []);

  const saveQuestions = (newQuestions: Question[]) => {
    setQuestions(newQuestions);
    localStorage.setItem("interviewQuestions", JSON.stringify(newQuestions));
  };

  const addQuestion = (questionData: Omit<Question, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newQuestion: Question = {
      ...questionData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    saveQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (id: string, questionData: Omit<Question, 'id' | 'createdAt' | 'updatedAt'>) => {
    const updatedQuestions = questions.map(q => 
      q.id === id 
        ? { ...q, ...questionData, updatedAt: new Date().toISOString() }
        : q
    );
    saveQuestions(updatedQuestions);
  };

  const deleteQuestion = (id: string) => {
    const filteredQuestions = questions.filter(q => q.id !== id);
    saveQuestions(filteredQuestions);
  };

  return {
    questions,
    addQuestion,
    updateQuestion,
    deleteQuestion
  };
};
