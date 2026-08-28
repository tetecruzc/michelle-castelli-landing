-- ============================================
-- Tabla: interviews
-- Entrevistas y apariciones en medios de Michele Castelli
-- ============================================

CREATE TABLE IF NOT EXISTS public.interviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title JSONB NOT NULL DEFAULT '{"es":"","it":""}',
  description JSONB NOT NULL DEFAULT '{"es":"","it":""}',
  youtube_url TEXT NOT NULL,
  date_month_year TEXT NOT NULL,
  read_more_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_interviews_display_order ON public.interviews (display_order ASC);

-- RLS: permitir lectura pública a todos
ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "interviews_select_public"
  ON public.interviews
  FOR SELECT
  TO public
  USING (true);

-- Permitir operaciones de escritura a usuarios autenticados
CREATE POLICY "interviews_all_authenticated"
  ON public.interviews
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Si deseas permitirlo para todos (inseguro pero rápido si no has configurado Auth de Supabase adecuadamente aún):
CREATE POLICY "interviews_all_anon"
  ON public.interviews
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- Trigger para actualizar updated_at
CREATE TRIGGER interviews_updated_at
  BEFORE UPDATE ON public.interviews
  FOR EACH ROW
  EXECUTE PROCEDURE public.set_updated_at();

-- Comentarios
COMMENT ON TABLE public.interviews IS 'Catálogo de entrevistas de Michele Castelli';
COMMENT ON COLUMN public.interviews.title IS 'Título de la entrevista en es/it';
COMMENT ON COLUMN public.interviews.description IS 'Descripción corta en es/it';
COMMENT ON COLUMN public.interviews.youtube_url IS 'Enlace al video de YouTube (ej. https://youtu.be/...)';
COMMENT ON COLUMN public.interviews.date_month_year IS 'Fecha mostrada (Ej: Octubre 2023)';
COMMENT ON COLUMN public.interviews.read_more_url IS 'URL externa opcional para "Leer más"';
COMMENT ON COLUMN public.interviews.display_order IS 'Orden de visualización ascendente';
