import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { books as localBooks, mapBookRowToBook, type Book, type BookRow } from '@/data/books';

const BOOKS_QUERY_KEY = ['books'] as const;
const BOOK_COVERS_BUCKET = 'book-covers';
const SIGNED_URL_TTL_SECONDS = 60 * 60; // 1 hour

function isAbsoluteUrl(value: string): boolean {
  return /^https?:\/\//i.test(value) || value.startsWith('/') || value.startsWith('data:');
}

/** Resolve cover URLs: if the row stored a storage path, create a signed URL. */
async function resolveCoverUrls(rows: BookRow[]): Promise<BookRow[]> {
  if (!supabase) return rows;
  const pathsToSign = rows
    .map((r) => r.cover_url)
    .filter((u): u is string => !!u && !isAbsoluteUrl(u));
  if (pathsToSign.length === 0) return rows;
  const { data, error } = await supabase.storage
    .from(BOOK_COVERS_BUCKET)
    .createSignedUrls(pathsToSign, SIGNED_URL_TTL_SECONDS);
  if (error || !data) return rows;
  const pathToSigned = new Map(
    data.map((entry) => [entry.path ?? '', entry.signedUrl])
  );
  return rows.map((r) =>
    !isAbsoluteUrl(r.cover_url)
      ? { ...r, cover_url: pathToSigned.get(r.cover_url) || r.cover_url }
      : r
  );
}

async function fetchBooksFromSupabase(): Promise<Book[]> {
  const client = supabase;
  if (!client) {
    return localBooks;
  }
  const { data, error } = await client
    .from('books')
    .select('*')
    .order('year', { ascending: false });
  if (error) {
    console.warn('Supabase books error:', error.message);
    return localBooks;
  }
  const rows = (data as unknown as BookRow[]) ?? [];
  if (rows.length === 0) return localBooks;
  const resolved = await resolveCoverUrls(rows);
  return resolved.map(mapBookRowToBook);
}

export function useBooks() {
  const query = useQuery({
    queryKey: BOOKS_QUERY_KEY,
    queryFn: fetchBooksFromSupabase,
    staleTime: 5 * 60 * 1000,
    placeholderData: localBooks,
  });
  return {
    books: query.data ?? localBooks,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
