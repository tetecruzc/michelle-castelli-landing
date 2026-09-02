import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Article } from '@/data/articles';
import { supabase } from '@/lib/supabase';
import { FileText, Loader2, Trash2, UploadCloud } from 'lucide-react';
import { useId, useState } from 'react';

const ARTICLE_PDFS_BUCKET = 'article-pdfs';

export interface ArticleFormValues {
  title: string;
  year: string;
  category: string;
}

const defaultValues: ArticleFormValues = {
  title: '',
  year: '',
  category: 'la_voce_d_italia',
};

interface ArticleFormProps {
  article?: Article | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ArticleForm({ article, onSuccess, onCancel }: ArticleFormProps) {
  const [values, setValues] = useState<ArticleFormValues>(() =>
    article
      ? {
          title: article.title,
          year: article.year ? String(article.year) : '',
          category: article.category,
        }
      : defaultValues
  );
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfPreview, setPdfPreview] = useState<string | null>(article?.pdf_url ?? null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEdit = !!article;

  const titleId = useId();
  const yearId = useId();
  const pdfId = useId();

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPdfFile(file);
      setPdfPreview(file.name);
    } else {
      setPdfFile(null);
      setPdfPreview(article?.pdf_url ? 'Documento actual' : null);
    }
  };

  const uploadPdf = async (recordId: string): Promise<string> => {
    if (!supabase) throw new Error('Supabase no configurado');
    if (pdfFile) {
      const ext = pdfFile.name.split('.').pop() || 'pdf';
      const path = `${recordId}-${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from(ARTICLE_PDFS_BUCKET)
        .upload(path, pdfFile, { upsert: true });
      if (uploadError) throw uploadError;
      return path;
    }
    if (isEdit && article && (article.pdfPath || article.pdf_url)) {
      return article.pdfPath ?? article.pdf_url;
    }
    throw new Error('Sube un documento PDF para el artículo.');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!supabase) {
      setError('Supabase no está configurado.');
      return;
    }
    const pdfRequired = !isEdit || pdfFile;
    if (pdfRequired && !pdfFile && !article?.pdf_url) {
      setError('Sube un documento PDF para el artículo.');
      return;
    }
    
    if (!values.title) {
      setError('Por favor, ingresa el título del artículo.');
      return;
    }

    const generateId = () => crypto.randomUUID();
    const recordId = isEdit ? article!.id : generateId();

    setSaving(true);
    try {
      let pdfUrl: string;
      try {
        pdfUrl = await uploadPdf(recordId);
      } catch (err: unknown) {
        const msg = (err as { message?: string })?.message || (err instanceof Error ? err.message : 'Error al subir el documento.');
        throw new Error(msg);
      }

      const rowData = {
        id: recordId,
        title: values.title,
        year: values.year ? parseInt(values.year, 10) : null,
        category: values.category,
        pdf_url: pdfUrl,
        updated_at: new Date().toISOString(),
      };

      const { error: upsertError } = await supabase
        .from('articles' as any)
        .upsert(rowData);

      if (upsertError) throw upsertError;
      
      onSuccess();
    } catch (err: unknown) {
      console.error(err);
      setError((err as Error).message || 'Ocurrió un error al guardar el artículo.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!isEdit || !article || !supabase) return;
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este artículo? Esta acción no se puede deshacer.');
    if (!confirmDelete) return;

    setDeleting(true);
    setError(null);
    try {
      if (article.pdfPath) {
        await supabase.storage.from(ARTICLE_PDFS_BUCKET).remove([article.pdfPath]);
      }
      const { error: deleteError } = await supabase
        .from('articles' as any)
        .delete()
        .eq('id', article.id);
      
      if (deleteError) throw deleteError;
      onSuccess();
    } catch (err: unknown) {
      console.error(err);
      setError((err as Error).message || 'Error al eliminar el artículo.');
      setDeleting(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      <div className="flex-1 overflow-y-auto px-8 py-6">
        <form id="article-form" onSubmit={handleSubmit} className="space-y-10">
          
          {error && (
            <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium animate-in fade-in slide-in-from-top-2 flex items-center gap-3">
              <div className="p-2 bg-destructive/20 rounded-lg">
                <FileText className="h-4 w-4" />
              </div>
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor={titleId} className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Título del Artículo</Label>
              <Input
                id={titleId}
                value={values.title}
                onChange={(e) => setValues({ ...values, title: e.target.value })}
                placeholder="Escribe el título aquí..."
                className="h-14 bg-background border-border/50 text-lg font-medium placeholder:font-normal focus-visible:ring-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label htmlFor={yearId} className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Año</Label>
                <Input
                  id={yearId}
                  type="number"
                  value={values.year}
                  onChange={(e) => setValues({ ...values, year: e.target.value })}
                  placeholder="Ej. 2024"
                  className="h-12 bg-muted/30 border-border/50 text-base"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Categoría</Label>
                <Select
                  value={values.category}
                  onValueChange={(val) => setValues({ ...values, category: val })}
                >
                  <SelectTrigger className="h-12 bg-muted/30 border-border/50 text-base">
                    <SelectValue placeholder="Selecciona..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="la_voce_d_italia">La voce d'Italia</SelectItem>
                    <SelectItem value="otros">Otros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-border/50">
              <Label className="text-foreground font-semibold flex items-center justify-between">
                Archivo PDF del Artículo
                <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full normal-case tracking-normal">Requerido</span>
              </Label>
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
                {(article?.pdf_url || pdfFile) && (
                  <a
                    href={pdfFile ? URL.createObjectURL(pdfFile) : article?.pdf_url}
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
          </div>
        </form>
      </div>

      <div className="p-6 bg-muted/20 border-t border-border/40 shrink-0 flex items-center justify-between gap-4">
        {isEdit ? (
          <Button
            type="button"
            variant="ghost"
            className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-2 font-medium"
            onClick={handleDelete}
            disabled={saving || deleting}
          >
            {deleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">Eliminar</span>
          </Button>
        ) : (
          <div></div>
        )}
        <div className="flex gap-3 w-full sm:w-auto">
          <Button type="button" variant="outline" onClick={onCancel} disabled={saving || deleting} className="w-full sm:w-32 rounded-full h-11 border-border/60">
            Cancelar
          </Button>
          <Button 
            type="submit" 
            form="article-form" 
            disabled={saving || deleting} 
            className="w-full sm:w-40 rounded-full h-11 shadow-md hover:shadow-lg transition-all"
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Guardando
              </span>
            ) : (
              'Guardar'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
