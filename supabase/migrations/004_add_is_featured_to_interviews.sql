ALTER TABLE public.interviews
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT FALSE;

-- Ensure only one interview can be featured at a time
CREATE UNIQUE INDEX IF NOT EXISTS idx_only_one_featured 
ON public.interviews (is_featured) 
WHERE is_featured = true;

COMMENT ON COLUMN public.interviews.is_featured IS 'Bandera para destacar una sola entrevista en el landing page';
