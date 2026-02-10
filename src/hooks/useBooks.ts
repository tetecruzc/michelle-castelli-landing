import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { books as localBooks, mapBookRowToBook, type Book, type BookRow } from '@/data/books';

const BOOKS_QUERY_KEY = ['books'] as const;

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
  return (data as BookRow[]).map(mapBookRowToBook);
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
