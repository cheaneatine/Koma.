export type ListType = 'plan_to_read' | 'reading' | 'stacking' | 'completed';

export interface Series {
  id: string;
  title: string;
  chapters: number;
  status: ListType;
  notes?: string;
}

export interface Recommendation {
  title: string;
  synopsis: string;
}

export interface NewsItem {
  title: string;
  snippet: string;
  link: string;
}
