export interface Article {
  id: string;
  title: string;
  year?: number | null;
  category: string;
  pdf_url: string; // Resolves to signed URL or public URL at runtime
  pdfPath?: string; // The raw path used in storage, for admin purposes
}

// Database row structure
export interface ArticleRow {
  id: string;
  title: string;
  year: number | null;
  category: string;
  pdf_url: string;
  created_at?: string;
  updated_at?: string;
}

export function mapArticleRowToArticle(row: ArticleRow): Article {
  return {
    id: row.id,
    title: row.title,
    year: row.year,
    category: row.category,
    pdf_url: row.pdf_url,
  };
}
