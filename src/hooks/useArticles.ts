import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { mapArticleRowToArticle, type Article, type ArticleRow } from '@/data/articles';

const ARTICLES_QUERY_KEY = ['articles'] as const;
const ARTICLE_PDFS_BUCKET = 'article-pdfs';
const SIGNED_URL_TTL_SECONDS = 60 * 60; // 1 hour

function isAbsoluteUrl(value: string): boolean {
  return /^https?:\/\//i.test(value) || value.startsWith('/') || value.startsWith('data:');
}

/** Resolve PDF URLs: if the row stored a storage path, create a signed URL. */
async function resolvePdfUrls(rows: ArticleRow[]): Promise<ArticleRow[]> {
  if (!supabase) return rows;
  const pathsToSign = rows
    .map((r) => r.pdf_url)
    .filter((u): u is string => !!u && !isAbsoluteUrl(u));
  if (pathsToSign.length === 0) return rows;
  const { data, error } = await supabase.storage
    .from(ARTICLE_PDFS_BUCKET)
    .createSignedUrls(pathsToSign, SIGNED_URL_TTL_SECONDS);
  if (error || !data) return rows;
  const pathToSigned = new Map(
    data.map((entry) => [entry.path ?? '', entry.signedUrl])
  );
  return rows.map((r) =>
    !isAbsoluteUrl(r.pdf_url)
      ? { ...r, pdf_url: pathToSigned.get(r.pdf_url) || r.pdf_url }
      : r
  );
}

async function fetchArticlesFromSupabase(): Promise<Article[]> {
  const client = supabase;
  if (!client) {
    return [];
  }
  const { data, error } = await client
    .from('articles')
    .select('*')
    .order('year', { ascending: false })
    .order('created_at', { ascending: false });
  if (error) {
    console.warn('Supabase articles error:', error.message);
    return [];
  }
  const rows = (data as unknown as ArticleRow[]) ?? [];
  if (rows.length === 0) return [];
  const resolved = await resolvePdfUrls(rows);
  // Preserve the original storage path so the admin form can reuse it on edit.
  return resolved.map((row, idx) => ({
    ...mapArticleRowToArticle(row),
    pdfPath: rows[idx].pdf_url,
  }));
}

export function useArticles() {
  const query = useQuery({
    queryKey: ARTICLES_QUERY_KEY,
    queryFn: fetchArticlesFromSupabase,
    staleTime: 5 * 60 * 1000,
  });
  return {
    articles: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
