
export interface Question {
  id: string;
  title: string;
  answer: string;
  code: string;
  language: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  userId?: string;
}
