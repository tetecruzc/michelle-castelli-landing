import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { mapBookRowToBook, type Book, type BookRow } from '@/data/books';

const BOOKS_QUERY_KEY = ['books'] as const;
const BOOK_COVERS_BUCKET = 'book-covers';
const SIGNED_URL_TTL_SECONDS = 60 * 60; // 1 hour

function isAbsoluteUrl(value: string): boolean {
  return /^https?:\/\//i.test(value) || value.startsWith('/') || value.startsWith('data:');
}

/** Resolve URLs: if the row stored a storage path for cover or images, create a signed URL. */
async function resolveAllImages(rows: BookRow[]): Promise<BookRow[]> {
  if (!supabase) return rows;
  const pathsToSign = new Set<string>();
  rows.forEach((r) => {
    if (r.cover_url && !isAbsoluteUrl(r.cover_url)) pathsToSign.add(r.cover_url);
    if (Array.isArray(r.images)) {
      r.images.forEach((img: any) => {
        if (img.src && typeof img.src === 'string' && !isAbsoluteUrl(img.src)) {
          pathsToSign.add(img.src);
        }
      });
    }
  });

  if (pathsToSign.size === 0) return rows;
  
  const { data, error } = await supabase.storage
    .from(BOOK_COVERS_BUCKET)
    .createSignedUrls(Array.from(pathsToSign), SIGNED_URL_TTL_SECONDS);
    
  if (error || !data) return rows;
  
  const pathToSigned = new Map(
    data.map((entry) => [entry.path ?? '', entry.signedUrl])
  );
  
  return rows.map((r) => {
    const updatedRow = { ...r };
    if (updatedRow.cover_url && !isAbsoluteUrl(updatedRow.cover_url)) {
      updatedRow.cover_url = pathToSigned.get(updatedRow.cover_url) || updatedRow.cover_url;
    }
    if (Array.isArray(updatedRow.images)) {
      updatedRow.images = updatedRow.images.map((img: any) => ({
        ...img,
        src: (img.src && typeof img.src === 'string' && !isAbsoluteUrl(img.src)) 
          ? (pathToSigned.get(img.src) || img.src) 
          : img.src
      }));
    }
    return updatedRow;
  });
}

async function fetchBooksFromSupabase(): Promise<Book[]> {
  const client = supabase;
  if (!client) {
    return [];
  }
  const { data, error } = await client
    .from('books')
    .select('*')
    .order('position', { ascending: true })
    .order('year', { ascending: false });
  if (error) {
    console.warn('Supabase books error:', error.message);
    return [];
  }
  const rows = (data as unknown as BookRow[]) ?? [];
  if (rows.length === 0) return [];
  const resolved = await resolveAllImages(rows);
  // Preserve the original storage path so the admin form can reuse it on edit.
  return resolved.map((row, idx) => ({
    ...mapBookRowToBook(row),
    coverPath: rows[idx].cover_url,
  }));
}

const EMPTY_BOOKS: Book[] = [];

export function useBooks() {
  const query = useQuery({
    queryKey: BOOKS_QUERY_KEY,
    queryFn: fetchBooksFromSupabase,
    staleTime: 5 * 60 * 1000,
  });
  return {
    books: query.data ?? EMPTY_BOOKS,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export async function updateBooksOrder(books: { id: string; position: number }[]): Promise<void> {
  const client = supabase;
  if (!client) return;
  
  await Promise.all(
    books.map(b => 
      client.from('books').update({ position: b.position }).eq('id', b.id)
    )
  );
}

export async function toggleFeaturedBook(id: string, isFeatured: boolean): Promise<void> {
  const client = supabase;
  if (!client) return;
  
  const { error } = await client
    .from('books')
    .update({ is_featured: isFeatured })
    .eq('id', id);
    
  if (error) {
    console.error('Error toggling featured status:', error.message);
    throw error;
  }
}
