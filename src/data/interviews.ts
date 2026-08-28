export interface InterviewTitle {
  es: string;
  it: string;
}

export interface InterviewDescription {
  es: string;
  it: string;
}

export interface Interview {
  id: string;
  title: InterviewTitle;
  description: InterviewDescription;
  youtube_url: string;
  date_month_year: string;
  read_more_url: string | null;
  display_order: number;
  is_featured: boolean;
  created_at?: string;
  updated_at?: string;
}
