import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import type { Interview } from '@/data/interviews';
import { useInterviews } from '@/hooks/useInterviews';
import { Loader2, Youtube } from 'lucide-react';
import { useEffect, useState } from 'react';

interface InterviewFormProps {
  interview?: Interview | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function InterviewForm({ interview, onSuccess, onCancel }: InterviewFormProps) {
  const { addInterview, updateInterview } = useInterviews();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = !!interview;

  const [values, setValues] = useState({
    title_es: '',
    title_it: '',
    description_es: '',
    description_it: '',
    youtube_url: '',
    date_month_year: '',
    read_more_url: '',
  });

  useEffect(() => {
    if (interview) {
      setValues({
        title_es: interview.title.es || '',
        title_it: interview.title.it || '',
        description_es: interview.description.es || '',
        description_it: interview.description.it || '',
        youtube_url: interview.youtube_url || '',
        date_month_year: interview.date_month_year || '',
        read_more_url: interview.read_more_url || '',
      });
    }
  }, [interview]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const interviewData = {
        title: { es: values.title_es, it: values.title_it },
        description: { es: values.description_es, it: values.description_it },
        youtube_url: values.youtube_url,
        date_month_year: values.date_month_year,
        read_more_url: values.read_more_url || null,
        display_order: interview?.display_order ?? 0,
        is_featured: interview?.is_featured ?? false,
      };

      if (isEdit && interview) {
        await updateInterview(interview.id, interviewData);
      } else {
        await addInterview(interviewData);
      }
      onSuccess();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error al guardar la entrevista.');
    } finally {
      setSaving(false);
    }
  };

  // Helper to extract YouTube video ID for preview
  const getYoutubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYoutubeVideoId(values.youtube_url);

  return (
    <form onSubmit={handleSubmit} className="flex h-full w-full overflow-hidden">
      {/* Columna Izquierda: Preview y Detalles Base */}
      <div className="w-2/5 max-w-[320px] bg-muted/10 border-r border-border/50 px-6 py-6 flex flex-col shrink-0 overflow-y-auto">
        <div className="space-y-6">
          <div className="space-y-3">
            <Label className="text-foreground font-semibold text-lg flex items-center gap-2">
              Vista Previa
            </Label>
            <div className="bg-background/50 border-2 border-dashed border-border rounded-2xl overflow-hidden relative aspect-video w-full flex items-center justify-center">
              {videoId ? (
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0"
                ></iframe>
              ) : (
                <div className="text-center p-4 text-muted-foreground flex flex-col items-center gap-2">
                  <Youtube size={32} className="opacity-50" />
                  <span className="text-sm">Ingresa un enlace de YouTube válido para ver la vista previa.</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <Label htmlFor="dateId" className="text-foreground font-semibold">Fecha (Mes y Año)</Label>
            <Input
              id="dateId"
              type="text"
              placeholder="Ej: Octubre 2023"
              value={values.date_month_year}
              onChange={(e) => setValues((v) => ({ ...v, date_month_year: e.target.value }))}
              required
              className="bg-background/80 h-12 text-base font-medium focus:ring-primary transition-colors rounded-xl"
            />
          </div>
          
          <div className="space-y-2 pt-2">
            <Label htmlFor="ytId" className="text-foreground font-semibold">Enlace de YouTube</Label>
            <Input
              id="ytId"
              type="url"
              placeholder="https://youtube.com/watch?v=..."
              value={values.youtube_url}
              onChange={(e) => setValues((v) => ({ ...v, youtube_url: e.target.value }))}
              required
              className="bg-background/80 h-12 text-base focus:ring-primary transition-colors rounded-xl"
            />
          </div>
        </div>

        {error && (
          <div className="mt-6 p-4 rounded-xl bg-destructive/10 text-destructive text-sm font-medium flex items-start gap-2 border border-destructive/20 shadow-sm animate-fade-in-up">
            <span className="shrink-0 mt-0.5">⚠️</span>
            <span className="leading-tight">{error}</span>
          </div>
        )}
      </div>

      {/* Columna Derecha: Formulario scrolleable */}
      <div className="flex-1 flex flex-col bg-background relative overflow-hidden">
        <div className="flex-1 overflow-y-auto px-10 pb-8 pt-3 space-y-12">
          
          <Tabs defaultValue="es" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-muted/50 p-1 rounded-2xl h-14 shadow-sm border border-border/30">
              <TabsTrigger value="es" className="rounded-xl text-base data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all h-full">🇪🇸 Español</TabsTrigger>
              <TabsTrigger value="it" className="rounded-xl text-base data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all h-full">🇮🇹 Italiano</TabsTrigger>
            </TabsList>

            {/* SECCIÓN ESPAÑOL */}
            <TabsContent value="es" className="space-y-6 mt-0 animate-in fade-in slide-in-from-bottom-2">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="font-semibold text-muted-foreground uppercase tracking-wider text-xs">Título de la entrevista</Label>
                  <Input
                    value={values.title_es}
                    onChange={(e) => setValues((v) => ({ ...v, title_es: e.target.value }))}
                    required
                    placeholder="Ej: Entrevista en RAI sobre..."
                    className="h-14 text-lg bg-muted/40 border border-border/50 focus:bg-background focus:ring-primary transition-all rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold text-muted-foreground uppercase tracking-wider text-xs">Descripción</Label>
                  <Textarea
                    value={values.description_es}
                    onChange={(e) => setValues((v) => ({ ...v, description_es: e.target.value }))}
                    rows={4}
                    required
                    placeholder="Breve resumen de los temas tratados..."
                    className="resize-none bg-muted/40 border border-border/50 focus:bg-background focus:ring-primary transition-all text-base p-4 rounded-xl"
                  />
                </div>
              </div>
            </TabsContent>

            {/* SECCIÓN ITALIANO */}
            <TabsContent value="it" className="space-y-6 mt-0 animate-in fade-in slide-in-from-bottom-2">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="font-semibold text-muted-foreground uppercase tracking-wider text-xs">Titolo</Label>
                  <Input
                    value={values.title_it}
                    onChange={(e) => setValues((v) => ({ ...v, title_it: e.target.value }))}
                    placeholder="Titolo dell'intervista..."
                    className="h-14 text-lg bg-muted/40 border border-border/50 focus:bg-background focus:ring-primary transition-all rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold text-muted-foreground uppercase tracking-wider text-xs">Descrizione</Label>
                  <Textarea
                    value={values.description_it}
                    onChange={(e) => setValues((v) => ({ ...v, description_it: e.target.value }))}
                    rows={4}
                    placeholder="Breve riassunto..."
                    className="resize-none bg-muted/40 border border-border/50 focus:bg-background focus:ring-primary transition-all text-base p-4 rounded-xl"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* SECCIÓN ENLACES EXTRA */}
          <div className="space-y-6">
            <h3 className="text-2xl font-display font-semibold flex items-center gap-3 text-foreground pb-2 border-b border-border/50">
              🔗 Enlace adicional (opcional)
            </h3>
            <div className="space-y-4 p-6 bg-muted/10 rounded-3xl border border-border/50">
              <div className="space-y-2">
                <Label className="font-semibold text-muted-foreground uppercase tracking-wider text-xs">Enlace de "Leer más"</Label>
                <Input
                  value={values.read_more_url}
                  onChange={(e) => setValues((v) => ({ ...v, read_more_url: e.target.value }))}
                  placeholder="https://..."
                  type="url"
                  className="bg-background h-12 rounded-xl"
                />
                <p className="text-xs text-muted-foreground mt-1">Si proporcionas un enlace, aparecerá un botón debajo del video que llevará a este artículo.</p>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-6 border-t border-border/50 bg-background/95 backdrop-blur-md flex justify-end gap-4 shrink-0 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
          <Button type="button" variant="ghost" onClick={onCancel} disabled={saving} className="px-8 h-12 rounded-full hover:bg-muted hover:text-foreground transition-colors">
            Cancelar
          </Button>
          <Button type="submit" disabled={saving} className="px-10 h-12 min-w-[180px] shadow-lg shadow-primary/25 rounded-full hover:bg-primary/90 transition-all text-base font-medium">
            {saving ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" /> Guardando...
              </span>
            ) : isEdit ? (
              'Guardar cambios'
            ) : (
              'Añadir entrevista'
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
