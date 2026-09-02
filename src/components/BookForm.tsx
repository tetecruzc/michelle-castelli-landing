import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';
import { BookOpen, Image as ImageIcon, Loader2, Trash2, UploadCloud, FileText } from 'lucide-react';
import { useId, useState } from 'react';

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

interface RelatedImageItem {
  id: string;
  file?: File;
  previewUrl?: string;
  captionEs: string;
  captionIt: string;
}

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
  
  const [relatedImages, setRelatedImages] = useState<RelatedImageItem[]>(() => {
    return (book?.images || []).map(img => ({
      id: crypto.randomUUID(),
      previewUrl: img.src,
      captionEs: img.caption.es,
      captionIt: img.caption.it
    }));
  });

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEdit = !!book;

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

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfPreview, setPdfPreview] = useState<string | null>(book?.downloadUrl ?? null);
  const pdfId = useId();

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPdfFile(file);
      setPdfPreview('Documento actual');
      setValues(v => ({ ...v, action: 'download' }));
    } else {
      setPdfFile(null);
      setPdfPreview(book?.downloadUrl ? 'Documento actual' : null);
    }
  };

  const uploadPdf = async (recordId: string): Promise<string> => {
    if (!supabase) throw new Error('Supabase no configurado');
    if (pdfFile) {
      const ext = pdfFile.name.split('.').pop() || 'pdf';
      const path = `${recordId}-pdf-${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from(BOOK_COVERS_BUCKET)
        .upload(path, pdfFile, { upsert: true });
      if (uploadError) throw uploadError;
      return path;
    }
    return book?.downloadUrl ?? '';
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
    
    if (!values.title_es || !values.description_es || !values.year) {
      setError('Por favor, completa los campos requeridos (Título y Descripción en Español, y Año).');
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
      let pdfUrl = values.download_url.trim();
      let finalRelatedImages: { src: string; caption: { es: string; it: string } }[] = [];
      
      try {
        coverUrl = await uploadCover(recordId);
        if (pdfFile) {
          pdfUrl = await uploadPdf(recordId);
        }
        
        finalRelatedImages = await Promise.all(
          relatedImages.map(async (item, index) => {
            let src = item.previewUrl || '';
            if (item.file) {
              const ext = item.file.name.split('.').pop() || 'jpg';
              const path = `${recordId}-related-${index}-${Date.now()}.${ext}`;
              const { error: uploadError } = await supabase.storage
                .from(BOOK_COVERS_BUCKET)
                .upload(path, item.file, { upsert: true });
              if (uploadError) throw uploadError;
              src = path;
            }
            return {
              src,
              caption: { es: item.captionEs.trim(), it: item.captionIt.trim() }
            };
          })
        );
        
      } catch (err: unknown) {
        const msg =
          (err as { message?: string })?.message ||
          (err instanceof Error ? err.message : 'Error al subir imágenes.');
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
        download_url: values.action === 'download' ? pdfUrl || null : null,
        images: finalRelatedImages.length > 0 ? finalRelatedImages : null,
      };

      const dbRow = row as unknown as never;
      if (isEdit) {
        const { error: updateError } = await (supabase as any).from('books').update(dbRow).eq('id', book.id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await (supabase as any).from('books').insert(dbRow);
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
      const { error: deleteError } = await (supabase as any).from('books').delete().eq('id', book.id);
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
            <Card className="border-dashed bg-background/50 border-2 overflow-hidden hover:bg-muted/50 transition-all duration-300 group rounded-[2rem] relative h-[260px] shadow-sm">
              <div className="absolute inset-0 p-4 flex flex-col items-center justify-center gap-4 text-center">
                {coverPreview ? (
                  <div className="relative group/image h-full w-full flex items-center justify-center">
                    <img
                      src={coverPreview}
                      alt="Vista previa"
                      className="w-full h-full object-contain rounded-xl shadow-sm transition-transform duration-500 group-hover/image:scale-[1.02]"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/image:opacity-100 transition-opacity flex items-center justify-center rounded-xl backdrop-blur-sm">
                      <span className="text-white text-sm font-medium px-4 py-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors shadow-lg">
                        Cambiar
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-1">
                    <div className="p-4 rounded-full bg-background border shadow-sm group-hover:shadow-md transition-all group-hover:text-primary">
                      <UploadCloud size={28} />
                    </div>
                    <div>
                      <span className="font-medium text-foreground block mb-1 text-sm">Subir portada</span>
                      <span className="text-[10px] opacity-70">JPG, PNG, WEBP</span>
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
            <Label className="text-foreground font-semibold">Archivo PDF del Libro</Label>
            <div className="flex gap-2">
              <Label 
                htmlFor={pdfId} 
                className={`relative flex-1 flex items-center justify-center gap-2 h-12 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300
                  ${pdfPreview ? 'border-primary/50 bg-primary/5 text-primary' : 'border-border/60 hover:border-primary/50 hover:bg-muted/50 text-muted-foreground'}
                `}
              >
                <Input 
                  id={pdfId} 
                  type="file" 
                  accept=".pdf,application/pdf" 
                  className="hidden" 
                  onChange={handlePdfChange} 
                />
                <UploadCloud size={18} className={pdfPreview ? '' : 'opacity-50'} />
                <span className="text-sm font-medium">
                  {pdfFile ? 'Seleccionado' : pdfPreview ? 'Reemplazar PDF' : 'Subir PDF'}
                </span>
              </Label>
              {(book?.downloadUrl || pdfFile) && (
                <a
                  href={pdfFile ? URL.createObjectURL(pdfFile) : (book?.downloadUrl?.startsWith('http') ? book.downloadUrl : supabase?.storage.from(BOOK_COVERS_BUCKET).getPublicUrl(book!.downloadUrl!).data.publicUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-12 h-12 bg-background border border-border/60 hover:bg-muted text-primary rounded-xl shadow-sm transition-colors shrink-0"
                  title={pdfFile ? "Ver PDF seleccionado" : "Ver PDF actual"}
                >
                  <FileText size={18} />
                </a>
              )}
            </div>
            {pdfFile && <p className="text-[10px] text-muted-foreground mt-1 line-clamp-1 truncate">{pdfFile.name}</p>}
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
        <div className="flex-1 overflow-y-auto px-10 py-3 pb-8 space-y-12">
          
          {/* TABS: ESPAÑOL / ITALIANO */}
          <Tabs defaultValue="es" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-muted/50 p-1 rounded-2xl h-14 shadow-sm border border-border/30">
              <TabsTrigger value="es" className="rounded-xl text-base data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all h-full">🇪🇸 Español</TabsTrigger>
              <TabsTrigger value="it" className="rounded-xl text-base data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all h-full">🇮🇹 Italiano</TabsTrigger>
            </TabsList>

            <TabsContent value="es" className="space-y-6 mt-0 animate-in fade-in slide-in-from-bottom-2">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="font-semibold text-muted-foreground uppercase tracking-wider text-xs">Título del Libro (Español)</Label>
                  <Input
                    value={values.title_es}
                    onChange={(e) => setValues((v) => ({ ...v, title_es: e.target.value }))}
                    required
                    placeholder="Ej: El misterio de la luz..."
                    className="h-14 text-lg bg-muted/50 border border-border/40 focus:bg-background focus:ring-primary transition-all rounded-xl shadow-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold text-muted-foreground uppercase tracking-wider text-xs">Sinopsis / Descripción (Español)</Label>
                  <Textarea
                    value={values.description_es}
                    onChange={(e) => setValues((v) => ({ ...v, description_es: e.target.value }))}
                    rows={5}
                    required
                    placeholder="Escribe aquí la sinopsis del libro..."
                    className="resize-none bg-muted/50 border border-border/40 focus:bg-background focus:ring-primary transition-all text-base p-4 rounded-xl shadow-sm"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="it" className="space-y-6 mt-0 animate-in fade-in slide-in-from-bottom-2">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="font-semibold text-muted-foreground uppercase tracking-wider text-xs">Titolo (Opcional si no está traducido)</Label>
                  <Input
                    value={values.title_it}
                    onChange={(e) => setValues((v) => ({ ...v, title_it: e.target.value }))}
                    required
                    placeholder="Es: Il mistero della luce..."
                    className="h-14 text-lg bg-muted/50 border border-border/40 focus:bg-background focus:ring-primary transition-all rounded-xl shadow-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold text-muted-foreground uppercase tracking-wider text-xs">Descrizione</Label>
                  <Textarea
                    value={values.description_it}
                    onChange={(e) => setValues((v) => ({ ...v, description_it: e.target.value }))}
                    rows={5}
                    placeholder="Scrivi qui la sinossi..."
                    className="resize-none bg-muted/50 border border-border/40 focus:bg-background focus:ring-primary transition-all text-base p-4 rounded-xl shadow-sm"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* SECCIÓN ENLACES */}
          <div className="space-y-6">
            <h3 className="text-2xl font-display font-semibold flex items-center gap-3 text-foreground pb-2 border-b border-border/50">
              <BookOpen className="text-primary h-5 w-5" /> Disponibilidad y enlaces
            </h3>
            
            <div className="space-y-4 p-6 bg-muted/20 rounded-3xl border border-border/40 shadow-sm">
              <div className="space-y-3">
                <Label className="text-foreground font-semibold">¿Cómo pueden obtener los lectores este libro?</Label>
                <Select
                  value={values.action}
                  onValueChange={(v) => setValues((prev) => ({ ...prev, action: v as BookAction }))}
                >
                  <SelectTrigger className="bg-background h-14 text-base rounded-xl border-border/60 shadow-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="buy" className="py-3 text-base cursor-pointer">🛒 Para Comprar (Amazon/Guaybo)</SelectItem>
                    <SelectItem value="download" className="py-3 text-base cursor-pointer">⬇️ Descarga Gratuita (PDF)</SelectItem>
                    <SelectItem value="not-digitized" className="py-3 text-base cursor-pointer">📚 No Digitalizado (Edición antigua)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {values.action === 'buy' && (
                <div className="grid gap-5 pt-4 animate-fade-in-up">
                  <div className="space-y-2">
                    <Label className="font-semibold text-muted-foreground uppercase tracking-wider text-xs">1. Amazon (USD/EUR)</Label>
                    <Input
                      value={values.buy_usd}
                      onChange={(e) => setValues((v) => ({ ...v, buy_usd: e.target.value }))}
                      placeholder="https://amazon.com/..."
                      type="url"
                      className="bg-background border-border/60 h-12 rounded-xl shadow-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-semibold text-muted-foreground uppercase tracking-wider text-xs">2. Guaybo (VES, Zelle, Binance)</Label>
                    <Input
                      value={values.buy_ves}
                      onChange={(e) => setValues((v) => ({ ...v, buy_ves: e.target.value }))}
                      placeholder="https://..."
                      type="url"
                      className="bg-background border-border/60 h-12 rounded-xl shadow-sm"
                    />
                  </div>
                </div>
              )}

              {values.action === 'download' && (
                <div className="pt-4 animate-fade-in-up">
                  <div className="space-y-2">
                    <Label className="font-semibold text-muted-foreground uppercase tracking-wider text-xs">URL del archivo PDF (Opcional)</Label>
                    <Input
                      value={values.download_url}
                      onChange={(e) => setValues((v) => ({ ...v, download_url: e.target.value }))}
                      placeholder="Si subiste el archivo a la izquierda, déjalo en blanco. O pon aquí tu enlace."
                      type="url"
                      className="bg-background border-border/60 h-12 rounded-xl shadow-sm"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Imágenes relacionadas */}
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-border/50">
              <h3 className="text-2xl font-display font-semibold flex items-center gap-3 text-foreground">
                <ImageIcon className="text-primary h-5 w-5" /> Imágenes relacionadas
              </h3>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={() => setRelatedImages([...relatedImages, { id: crypto.randomUUID(), captionEs: '', captionIt: '' }])}
              >
                Añadir Imagen
              </Button>
            </div>
            
            <div className="space-y-4">
              {relatedImages.length === 0 && (
                <p className="text-sm text-muted-foreground italic px-2">No hay Imágenes relacionadas. Puedes añadir galerías internas del libro o fotos reales.</p>
              )}
              {relatedImages.map((img, index) => (
                <Card key={img.id} className="p-4 bg-muted/20 border-border/40 relative group shadow-sm">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-2 right-2 text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity" 
                    onClick={() => setRelatedImages(relatedImages.filter(i => i.id !== img.id))}
                  >
                    <Trash2 size={16} />
                  </Button>
                  
                  <div className="flex flex-col md:flex-row gap-6 mt-2">
                    <div className="w-full md:w-40 shrink-0">
                      <Label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-2 block">Foto</Label>
                      <div className="relative w-full aspect-square rounded-xl overflow-hidden border-2 border-dashed border-border/60 bg-background/50 hover:bg-muted/50 transition-colors">
                        {img.previewUrl ? (
                          <img src={img.previewUrl} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground pointer-events-none">
                            <UploadCloud size={24} className="mb-2 opacity-50" />
                            <span className="text-xs font-medium">Subir</span>
                          </div>
                        )}
                        <Input 
                          type="file" 
                          accept="image/*" 
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                               const arr = [...relatedImages];
                               arr[index].file = file;
                               arr[index].previewUrl = URL.createObjectURL(file);
                               setRelatedImages(arr);
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex-1 space-y-4 pt-1">
                      <div className="space-y-2">
                        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Leyenda (Español)</Label>
                        <Input 
                          value={img.captionEs} 
                          onChange={e => { const arr = [...relatedImages]; arr[index].captionEs = e.target.value; setRelatedImages(arr); }} 
                          className="bg-background border-border/60 h-12 text-base rounded-xl shadow-sm" 
                          placeholder="Ej. El autor en la presentación..." 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Leyenda (Italiano)</Label>
                        <Input 
                          value={img.captionIt} 
                          onChange={e => { const arr = [...relatedImages]; arr[index].captionIt = e.target.value; setRelatedImages(arr); }} 
                          className="bg-background border-border/60 h-12 text-base rounded-xl shadow-sm" 
                          placeholder="Es. L'autore alla presentazione..." 
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-6 border-t border-border/50 bg-background/95 backdrop-blur-md flex justify-between items-center gap-4 shrink-0 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] z-10 relative">
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
            <Button type="button" variant="ghost" onClick={onCancel} disabled={saving || deleting} className="px-8 h-12 rounded-full hover:bg-muted hover:text-foreground transition-colors">
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
