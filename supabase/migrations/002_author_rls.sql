-- ============================================
-- Permisos para el autor: libros y storage
-- Solo usuarios autenticados pueden insertar/actualizar/eliminar
-- Ejecuta este script en SQL Editor si ves "row-level security policy"
-- ============================================

-- Quitar políticas anteriores si existen (para poder re-ejecutar el script)
DROP POLICY IF EXISTS "books_insert_authenticated" ON public.books;
DROP POLICY IF EXISTS "books_update_authenticated" ON public.books;
DROP POLICY IF EXISTS "books_delete_authenticated" ON public.books;
DROP POLICY IF EXISTS "book_covers_authenticated_upload" ON storage.objects;
DROP POLICY IF EXISTS "book_covers_authenticated_update" ON storage.objects;
DROP POLICY IF EXISTS "book_covers_authenticated_delete" ON storage.objects;

-- Books: INSERT, UPDATE, DELETE para usuarios autenticados
CREATE POLICY "books_insert_authenticated"
  ON public.books
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "books_update_authenticated"
  ON public.books
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "books_delete_authenticated"
  ON public.books
  FOR DELETE
  TO authenticated
  USING (true);

-- Storage: subida de portadas por usuarios autenticados
CREATE POLICY "book_covers_authenticated_upload"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'book-covers');

CREATE POLICY "book_covers_authenticated_update"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'book-covers');

CREATE POLICY "book_covers_authenticated_delete"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'book-covers');
