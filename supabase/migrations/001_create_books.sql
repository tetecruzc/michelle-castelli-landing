-- ============================================
-- Tabla: books
-- Libros de Michele Castelli (títulos, descripción, portada, año, acción, enlaces)
-- ============================================

CREATE TABLE IF NOT EXISTS public.books (
  id TEXT PRIMARY KEY,
  title JSONB NOT NULL DEFAULT '{"es":"","it":""}',
  description JSONB NOT NULL DEFAULT '{"es":"","it":""}',
  cover_url TEXT NOT NULL,
  year INTEGER NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('buy', 'download', 'not-digitized')),
  buy_links JSONB DEFAULT NULL,
  download_url TEXT DEFAULT NULL,
  images JSONB DEFAULT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para búsqueda y orden
CREATE INDEX IF NOT EXISTS idx_books_year ON public.books (year DESC);
CREATE INDEX IF NOT EXISTS idx_books_action ON public.books (action);

-- RLS: permitir lectura pública a todos
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;

CREATE POLICY "books_select_public"
  ON public.books
  FOR SELECT
  TO public
  USING (true);

-- (Opcional) Si más adelante quieres que solo el dashboard escriba, restringe INSERT/UPDATE/DELETE con políticas por auth.

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS books_updated_at ON public.books;
CREATE TRIGGER books_updated_at
  BEFORE UPDATE ON public.books
  FOR EACH ROW
  EXECUTE PROCEDURE public.set_updated_at();

-- ============================================
-- Storage: portadas e imágenes de libros
-- ============================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'book-covers',
  'book-covers',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Lectura pública del bucket (para mostrar portadas en la web)
CREATE POLICY "book_covers_public_read"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'book-covers');

-- (Opcional) Subida solo para usuarios autenticados o service role; si no usas auth, puedes subir desde el dashboard de Supabase.
-- CREATE POLICY "book_covers_authenticated_upload"
--   ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'book-covers');

-- ============================================
-- Comentarios de columnas (opcional)
-- ============================================

COMMENT ON TABLE public.books IS 'Catálogo de libros de Michele Castelli';
COMMENT ON COLUMN public.books.title IS 'Títulos en español (es) e italiano (it)';
COMMENT ON COLUMN public.books.description IS 'Descripciones en español (es) e italiano (it)';
COMMENT ON COLUMN public.books.cover_url IS 'URL pública de la portada (Supabase Storage o externa)';
COMMENT ON COLUMN public.books.action IS 'buy | download | not-digitized';
COMMENT ON COLUMN public.books.buy_links IS 'Objeto con ves y/o usd (URLs de compra)';
COMMENT ON COLUMN public.books.images IS 'Array de { src: string, caption: { es, it } } para imágenes adicionales';
