export interface Snippet {
  id: string;
  title: string;
  slug: string;
  code: string;
  language: string;
  description: string;
  tags: string[];
  likes: number;
  createdAt: string;
  updatedAt: string;
}
