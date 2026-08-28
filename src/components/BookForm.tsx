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
import { Loader2, UploadCloud, BookOpen } from 'lucide-react';
import type { Book, BookAction, BookRow } from '@/data/books';
import { supabase } from '@/lib/supabase';

const BOOK_COVERS_BUCKET = 'book-covers';

export interface BookFormValues {
  id: string;
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
  id: '',
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
          id: book.id,
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
  const [error, setError] = useState<string | null>(null);
  const isEdit = !!book;

  const idInputId = useId();
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

  const uploadCover = async (): Promise<string> => {
    if (!supabase) throw new Error('Supabase no configurado');
    if (coverFile) {
      const ext = coverFile.name.split('.').pop() || 'jpg';
      const path = `${values.id}-${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from(BOOK_COVERS_BUCKET)
        .upload(path, coverFile, { upsert: true });
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from(BOOK_COVERS_BUCKET).getPublicUrl(path);
      return data.publicUrl;
    }
    if (isEdit && book?.cover) return book.cover;
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
    if (!values.id || !values.title_es || !values.description_es || !values.year) {
      setError('Por favor, completa los campos requeridos en todas las pestañas.');
      return;
    }

    setSaving(true);
    try {
      let coverUrl: string;
      try {
        coverUrl = await uploadCover();
      } catch (err: unknown) {
        const msg =
          (err as { message?: string })?.message ||
          (err instanceof Error ? err.message : 'Error al subir la portada.');
        setError(msg);
        setSaving(false);
        return;
      }
      const row: Omit<BookRow, 'created_at' | 'updated_at'> = {
        id: values.id.trim(),
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

      if (isEdit) {
        const { error: updateError } = await supabase.from('books').update(row).eq('id', book.id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase.from('books').insert(row);
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

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full max-h-[85vh]">
      <div className="flex-1 overflow-y-auto px-1 pb-6">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-muted/50 p-1 rounded-xl">
            <TabsTrigger value="general" className="rounded-lg">General</TabsTrigger>
            <TabsTrigger value="content" className="rounded-lg">Contenido</TabsTrigger>
            <TabsTrigger value="links" className="rounded-lg">Enlaces</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6 focus-visible:outline-none">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor={idInputId} className="text-foreground font-medium">ID Único</Label>
                <Input
                  id={idInputId}
                  value={values.id}
                  onChange={(e) => setValues((v) => ({ ...v, id: e.target.value.replace(/[^a-z0-9-]/g, '-').toLowerCase() }))}
                  placeholder="ej. mi-libro-2024"
                  disabled={isEdit}
                  required
                  className="bg-background"
                />
                <p className="text-xs text-muted-foreground">Usado en URLs. Solo minúsculas, números y guiones.</p>
              </div>

              <div className="space-y-3">
                <Label htmlFor={yearId} className="text-foreground font-medium">Año de Publicación</Label>
                <Input
                  id={yearId}
                  type="number"
                  min={1900}
                  max={2100}
                  value={values.year}
                  onChange={(e) => setValues((v) => ({ ...v, year: e.target.value }))}
                  required
                  className="bg-background"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor={coverId} className="text-foreground font-medium">Portada del Libro</Label>
              <Card className="border-dashed bg-muted/30 border-2 overflow-hidden hover:bg-muted/50 transition-colors">
                <div className="p-6 flex flex-col items-center justify-center gap-4">
                  {coverPreview ? (
                    <div className="relative group">
                      <img
                        src={coverPreview}
                        alt="Vista previa"
                        className="w-32 h-48 object-cover rounded-md shadow-md"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-md">
                        <Label htmlFor={coverId} className="cursor-pointer text-white text-sm font-medium hover:underline">
                          Cambiar portada
                        </Label>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <div className="p-4 rounded-full bg-background border shadow-sm">
                        <UploadCloud size={24} />
                      </div>
                      <span className="text-sm">Sube una imagen (JPG, PNG, WEBP)</span>
                    </div>
                  )}
                  <Input
                    id={coverId}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleCoverChange}
                    required={!isEdit}
                    className="hidden"
                  />
                  {!coverPreview && (
                    <Button type="button" variant="secondary" size="sm" onClick={() => document.getElementById(coverId)?.click()}>
                      Seleccionar archivo
                    </Button>
                  )}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="content" className="space-y-6 focus-visible:outline-none">
            <div className="space-y-6">
              <div className="space-y-4 border rounded-xl p-5 bg-card/50">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🇪🇸</span>
                  <h4 className="font-medium">Español</h4>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={titleEsId}>Título</Label>
                  <Input
                    id={titleEsId}
                    value={values.title_es}
                    onChange={(e) => setValues((v) => ({ ...v, title_es: e.target.value }))}
                    required
                    placeholder="Título del libro..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={descEsId}>Descripción</Label>
                  <Textarea
                    id={descEsId}
                    value={values.description_es}
                    onChange={(e) => setValues((v) => ({ ...v, description_es: e.target.value }))}
                    rows={4}
                    required
                    placeholder="Sinopsis o descripción del libro..."
                    className="resize-none"
                  />
                </div>
              </div>

              <div className="space-y-4 border rounded-xl p-5 bg-card/50">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🇮🇹</span>
                  <h4 className="font-medium">Italiano</h4>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={titleItId}>Titolo</Label>
                  <Input
                    id={titleItId}
                    value={values.title_it}
                    onChange={(e) => setValues((v) => ({ ...v, title_it: e.target.value }))}
                    placeholder="Titolo del libro..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={descItId}>Descrizione</Label>
                  <Textarea
                    id={descItId}
                    value={values.description_it}
                    onChange={(e) => setValues((v) => ({ ...v, description_it: e.target.value }))}
                    rows={4}
                    placeholder="Sinossi o descrizione..."
                    className="resize-none"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="links" className="space-y-6 focus-visible:outline-none">
            <div className="space-y-4 bg-muted/30 p-5 rounded-xl border">
              <div className="space-y-2">
                <Label className="text-foreground font-medium">Disponibilidad del Libro</Label>
                <Select
                  value={values.action}
                  onValueChange={(v) => setValues((prev) => ({ ...prev, action: v as BookAction }))}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="buy">Para Comprar (Amazon, etc)</SelectItem>
                    <SelectItem value="download">Descarga Gratuita (PDF)</SelectItem>
                    <SelectItem value="not-digitized">No Digitalizado (Edición antigua)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-2">
                  Define cómo los usuarios pueden adquirir o leer este libro.
                </p>
              </div>

              {values.action === 'buy' && (
                <div className="grid gap-4 pt-4 border-t border-border/50">
                  <div className="space-y-2">
                    <Label>Enlace de compra en Bolívares (VES)</Label>
                    <Input
                      value={values.buy_ves}
                      onChange={(e) => setValues((v) => ({ ...v, buy_ves: e.target.value }))}
                      placeholder="https://..."
                      type="url"
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Enlace de compra Internacional (USD/EUR - Amazon)</Label>
                    <Input
                      value={values.buy_usd}
                      onChange={(e) => setValues((v) => ({ ...v, buy_usd: e.target.value }))}
                      placeholder="https://amazon.com/..."
                      type="url"
                      className="bg-background"
                    />
                  </div>
                </div>
              )}

              {values.action === 'download' && (
                <div className="grid gap-4 pt-4 border-t border-border/50">
                  <div className="space-y-2">
                    <Label>URL del archivo PDF / Descarga</Label>
                    <Input
                      value={values.download_url}
                      onChange={(e) => setValues((v) => ({ ...v, download_url: e.target.value }))}
                      placeholder="https://..."
                      type="url"
                      className="bg-background"
                    />
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {error && (
          <div className="mt-6 p-4 rounded-lg bg-destructive/10 text-destructive text-sm font-medium flex items-start gap-2">
            <span className="shrink-0 mt-0.5">⚠️</span>
            <span>{error}</span>
          </div>
        )}
      </div>

      <div className="flex gap-3 justify-end pt-6 mt-auto border-t">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={saving} className="px-6">
          Cancelar
        </Button>
        <Button type="submit" disabled={saving} className="px-8 min-w-[140px] shadow-md">
          {saving ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Guardando...
            </span>
          ) : isEdit ? (
            'Guardar cambios'
          ) : (
            'Crear libro'
          )}
        </Button>
      </div>
    </form>
  );
}
