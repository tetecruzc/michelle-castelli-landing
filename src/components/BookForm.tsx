import { useState, useId } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Loader2, UploadCloud, BookOpen, Trash2 } from 'lucide-react';
import type { Book, BookAction, BookRow } from '@/data/books';
import { supabase } from '@/lib/supabase';

const BOOK_COVERS_BUCKET = 'book-covers';

export interface BookFormValues {
  title_es: string;
  title_it: string;
  description_es: string;
  description_it: string;
  year: string;
  action: BookAction;
  buy_ves: string;
  buy_usd: string;
  download_url: string;
}

const defaultValues: BookFormValues = {
  title_es: '',
  title_it: '',
  description_es: '',
  description_it: '',
  year: new Date().getFullYear().toString(),
  action: 'buy',
  buy_ves: '',
  buy_usd: '',
  download_url: '',
};

interface BookFormProps {
  book?: Book | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function BookForm({ book, onSuccess, onCancel }: BookFormProps) {
  const [values, setValues] = useState<BookFormValues>(() =>
    book
      ? {
          title_es: book.title.es,
          title_it: book.title.it,
          description_es: book.description.es,
          description_it: book.description.it,
          year: String(book.year),
          action: book.action,
          buy_ves: book.buyLinks?.ves ?? '',
          buy_usd: book.buyLinks?.usd ?? '',
          download_url: book.downloadUrl ?? '',
        }
      : defaultValues
  );
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(book?.cover ?? null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEdit = !!book;

  const titleEsId = useId();
  const titleItId = useId();
  const descEsId = useId();
  const descItId = useId();
  const yearId = useId();
  const coverId = useId();

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    } else {
      setCoverFile(null);
      setCoverPreview(book?.cover ?? null);
    }
  };

  const uploadCover = async (recordId: string): Promise<string> => {
    if (!supabase) throw new Error('Supabase no configurado');
    if (coverFile) {
      const ext = coverFile.name.split('.').pop() || 'jpg';
      const path = `${recordId}-${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from(BOOK_COVERS_BUCKET)
        .upload(path, coverFile, { upsert: true });
      if (uploadError) throw uploadError;
      // Bucket is private; store only the storage path. useBooks signs URLs at read time.
      return path;
    }
    if (isEdit && (book?.coverPath || book?.cover)) {
      return book.coverPath ?? book.cover;
    }
    throw new Error('Sube una portada para el libro.');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!supabase) {
      setError('Supabase no está configurado.');
      return;
    }
    const coverRequired = !isEdit || coverFile;
    if (coverRequired && !coverFile && !book?.cover) {
      setError('Sube una portada para el libro.');
      return;
    }
    
    // Quick validation
    if (!values.title_es || !values.description_es || !values.year) {
      setError('Por favor, completa los campos requeridos en todas las pestañas.');
      return;
    }

    const generateSlug = (text: string) => {
      return text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-');
    };

    const recordId = isEdit ? book!.id : generateSlug(values.title_es);

    setSaving(true);
    try {
      let coverUrl: string;
      try {
        coverUrl = await uploadCover(recordId);
      } catch (err: unknown) {
        const msg =
          (err as { message?: string })?.message ||
          (err instanceof Error ? err.message : 'Error al subir la portada.');
        setError(msg);
        setSaving(false);
        return;
      }
      const row: Omit<BookRow, 'created_at' | 'updated_at'> = {
        id: recordId,
        title: { es: values.title_es.trim(), it: values.title_it.trim() },
        description: { es: values.description_es.trim(), it: values.description_it.trim() },
        cover_url: coverUrl,
        year: parseInt(values.year, 10) || new Date().getFullYear(),
        action: values.action,
        buy_links:
          values.action === 'buy' && (values.buy_ves || values.buy_usd)
            ? { ves: values.buy_ves.trim() || undefined, usd: values.buy_usd.trim() || undefined }
            : null,
        download_url: values.action === 'download' ? values.download_url.trim() || null : null,
        images: book?.images ?? null,
      };

      const dbRow = row as unknown as never;
      if (isEdit) {
        const { error: updateError } = await supabase.from('books').update(dbRow).eq('id', book.id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase.from('books').insert(dbRow);
        if (insertError) throw insertError;
      }
      onSuccess();
    } catch (err: unknown) {
      const msg =
        (err as { message?: string })?.message ||
        (err instanceof Error ? err.message : 'Error al guardar.');
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!book || !supabase) return;
    if (!window.confirm(`¿Estás seguro de que quieres eliminar el libro "${book.title.es}"? Esta acción no se puede deshacer.`)) {
      return;
    }
    setDeleting(true);
    try {
      const { error: deleteError } = await supabase.from('books').delete().eq('id', book.id);
      if (deleteError) throw deleteError;
      onSuccess();
    } catch (err: unknown) {
      const msg =
        (err as { message?: string })?.message ||
        (err instanceof Error ? err.message : 'Error al eliminar.');
      setError(msg);
      setDeleting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex h-full w-full overflow-hidden">
      {/* Columna Izquierda: Portada y Acciones Principales (Fija) */}
      <div className="w-2/5 max-w-[320px] bg-muted/10 border-r border-border/50 px-6 py-6 flex flex-col justify-between shrink-0 overflow-y-auto">
        <div className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor={coverId} className="text-foreground font-semibold text-lg">Portada del Libro</Label>
            <Card className="border-dashed bg-background/50 border-2 overflow-hidden hover:bg-muted/30 transition-all duration-300 group rounded-[2rem] relative h-[360px] shadow-sm">
              <div className="absolute inset-0 p-4 flex flex-col items-center justify-center gap-4 text-center">
                {coverPreview ? (
                  <div className="relative group/image h-full w-full flex items-center justify-center">
                    <img
                      src={coverPreview}
                      alt="Vista previa"
                      className="w-full h-full object-cover rounded-2xl shadow-md transition-transform duration-500 group-hover/image:scale-[1.02]"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/image:opacity-100 transition-opacity flex items-center justify-center rounded-2xl backdrop-blur-sm">
                      <span className="text-white text-sm font-medium px-5 py-2.5 bg-white/20 rounded-full hover:bg-white/30 transition-colors shadow-lg">
                        Cambiar portada
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-1">
                    <div className="p-5 rounded-full bg-background border shadow-sm group-hover:shadow-md transition-all group-hover:text-primary">
                      <UploadCloud size={32} />
                    </div>
                    <div>
                      <span className="font-medium text-foreground block mb-1">Subir portada</span>
                      <span className="text-xs opacity-70">JPG, PNG, WEBP</span>
                    </div>
                  </div>
                )}
                <Input
                  id={coverId}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleCoverChange}
                  required={!isEdit}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </Card>
          </div>

          <div className="space-y-2 pt-2">
            <Label htmlFor={yearId} className="text-foreground font-semibold">Año de Publicación</Label>
            <Input
              id={yearId}
              type="number"
              min={1900}
              max={2100}
              value={values.year}
              onChange={(e) => setValues((v) => ({ ...v, year: e.target.value }))}
              required
              className="bg-background/80 h-12 text-lg text-center font-medium focus:ring-primary transition-colors rounded-xl"
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
        <div className="flex-1 overflow-y-auto px-10 py-8 space-y-12">
          
          {/* SECCIÓN ESPAÑOL */}
          <div className="space-y-6">
            <h3 className="text-2xl font-display font-semibold flex items-center gap-3 text-foreground pb-2 border-b border-border/50">
              <span className="text-3xl drop-shadow-sm">🇪🇸</span> Versión en Español
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="font-semibold text-muted-foreground uppercase tracking-wider text-xs">Título del Libro</Label>
                <Input
                  value={values.title_es}
                  onChange={(e) => setValues((v) => ({ ...v, title_es: e.target.value }))}
                  required
                  placeholder="Ej: El misterio de la luz..."
                  className="h-14 text-lg bg-muted/20 focus:bg-background focus:ring-primary transition-all rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-semibold text-muted-foreground uppercase tracking-wider text-xs">Sinopsis / Descripción</Label>
                <Textarea
                  value={values.description_es}
                  onChange={(e) => setValues((v) => ({ ...v, description_es: e.target.value }))}
                  rows={5}
                  required
                  placeholder="Escribe aquí la sinopsis del libro..."
                  className="resize-none bg-muted/20 focus:bg-background focus:ring-primary transition-all text-base p-4 rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* SECCIÓN ITALIANO */}
          <div className="space-y-6">
            <h3 className="text-2xl font-display font-semibold flex items-center gap-3 text-foreground pb-2 border-b border-border/50">
              <span className="text-3xl drop-shadow-sm">🇮🇹</span> Versión en Italiano
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="font-semibold text-muted-foreground uppercase tracking-wider text-xs">Titolo (Opcional si no está traducido)</Label>
                <Input
                  value={values.title_it}
                  onChange={(e) => setValues((v) => ({ ...v, title_it: e.target.value }))}
                  placeholder="Il mistero della luce..."
                  className="h-14 text-lg bg-muted/20 focus:bg-background focus:ring-primary transition-all rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-semibold text-muted-foreground uppercase tracking-wider text-xs">Descrizione</Label>
                <Textarea
                  value={values.description_it}
                  onChange={(e) => setValues((v) => ({ ...v, description_it: e.target.value }))}
                  rows={5}
                  placeholder="Scrivi qui la sinossi..."
                  className="resize-none bg-muted/20 focus:bg-background focus:ring-primary transition-all text-base p-4 rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* SECCIÓN ENLACES */}
          <div className="space-y-6">
            <h3 className="text-2xl font-display font-semibold flex items-center gap-3 text-foreground pb-2 border-b border-border/50">
              <BookOpen className="text-primary h-7 w-7" /> Disponibilidad y Enlaces
            </h3>
            
            <div className="space-y-4 p-6 bg-muted/10 rounded-3xl border border-border/50">
              <div className="space-y-3">
                <Label className="text-foreground font-semibold">¿Cómo pueden obtener los lectores este libro?</Label>
                <Select
                  value={values.action}
                  onValueChange={(v) => setValues((prev) => ({ ...prev, action: v as BookAction }))}
                >
                  <SelectTrigger className="bg-background h-14 text-base rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="buy" className="py-3 text-base cursor-pointer">🛒 Para Comprar (Amazon, etc)</SelectItem>
                    <SelectItem value="download" className="py-3 text-base cursor-pointer">⬇️ Descarga Gratuita (PDF)</SelectItem>
                    <SelectItem value="not-digitized" className="py-3 text-base cursor-pointer">📚 No Digitalizado (Edición antigua)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {values.action === 'buy' && (
                <div className="grid gap-5 pt-4 animate-fade-in-up">
                  <div className="space-y-2">
                    <Label className="font-semibold text-muted-foreground uppercase tracking-wider text-xs">Enlace de compra en Bolívares (VES)</Label>
                    <Input
                      value={values.buy_ves}
                      onChange={(e) => setValues((v) => ({ ...v, buy_ves: e.target.value }))}
                      placeholder="https://..."
                      type="url"
                      className="bg-background h-12 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-semibold text-muted-foreground uppercase tracking-wider text-xs">Enlace de compra Internacional (Amazon)</Label>
                    <Input
                      value={values.buy_usd}
                      onChange={(e) => setValues((v) => ({ ...v, buy_usd: e.target.value }))}
                      placeholder="https://amazon.com/..."
                      type="url"
                      className="bg-background h-12 rounded-xl"
                    />
                  </div>
                </div>
              )}

              {values.action === 'download' && (
                <div className="pt-4 animate-fade-in-up">
                  <div className="space-y-2">
                    <Label className="font-semibold text-muted-foreground uppercase tracking-wider text-xs">URL del archivo PDF</Label>
                    <Input
                      value={values.download_url}
                      onChange={(e) => setValues((v) => ({ ...v, download_url: e.target.value }))}
                      placeholder="https://..."
                      type="url"
                      className="bg-background h-12 rounded-xl"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-6 border-t border-border/50 bg-background/95 backdrop-blur-md flex justify-between items-center gap-4 shrink-0 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
          <div>
            {isEdit && (
              <Button type="button" variant="destructive" onClick={handleDelete} disabled={saving || deleting} className="gap-2 px-6 h-12 rounded-full transition-colors bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20">
                {deleting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                {deleting ? 'Eliminando...' : 'Eliminar Obra'}
              </Button>
            )}
          </div>
          <div className="flex gap-4">
            <Button type="button" variant="ghost" onClick={onCancel} disabled={saving || deleting} className="px-8 h-12 rounded-full hover:bg-muted/50 transition-colors">
              Cancelar
            </Button>
            <Button type="submit" disabled={saving || deleting} className="px-10 h-12 min-w-[180px] shadow-lg shadow-primary/25 rounded-full hover:bg-primary/90 transition-all text-base font-medium">
              {saving ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" /> Guardando...
                </span>
              ) : isEdit ? (
                'Guardar cambios'
              ) : (
                'Crear libro'
              )}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
