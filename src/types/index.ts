export interface Subject {
  id: string;
  name: string;
  createdAt: number;
}

export interface Page {
  id: string;
  title: string;
  content: string;
  subjectId: string;
  createdAt: number;
}

export interface FlashCard {
  id: string;
  pageId: string;
  question: string;
  answer: string;
  createdAt: number;
}
