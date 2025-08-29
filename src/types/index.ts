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
