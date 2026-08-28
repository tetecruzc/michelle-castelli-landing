
CREATE TABLE public.books (
  id TEXT PRIMARY KEY,
  title JSONB NOT NULL,
  description JSONB NOT NULL,
  cover_url TEXT NOT NULL,
  year INTEGER NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('buy', 'download', 'not-digitized')),
  buy_links JSONB,
  download_url TEXT,
  images JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.books TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.books TO authenticated;
GRANT ALL ON public.books TO service_role;

ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read books"
ON public.books FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can insert books"
ON public.books FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update books"
ON public.books FOR UPDATE TO authenticated
USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can delete books"
ON public.books FOR DELETE TO authenticated
USING (true);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_books_updated_at
BEFORE UPDATE ON public.books
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
