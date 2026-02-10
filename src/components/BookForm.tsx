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
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[85vh] overflow-y-auto pr-2">
      <div className="grid gap-2">
        <Label htmlFor={idInputId}>ID (identificador único, sin espacios)</Label>
        <Input
          id={idInputId}
          value={values.id}
          onChange={(e) => setValues((v) => ({ ...v, id: e.target.value.replace(/\s/g, '-') }))}
          placeholder="ej. diaspora-es"
          disabled={isEdit}
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor={titleEsId}>Título (español)</Label>
        <Input
          id={titleEsId}
          value={values.title_es}
          onChange={(e) => setValues((v) => ({ ...v, title_es: e.target.value }))}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor={titleItId}>Título (italiano)</Label>
        <Input
          id={titleItId}
          value={values.title_it}
          onChange={(e) => setValues((v) => ({ ...v, title_it: e.target.value }))}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor={descEsId}>Descripción (español)</Label>
        <Textarea
          id={descEsId}
          value={values.description_es}
          onChange={(e) => setValues((v) => ({ ...v, description_es: e.target.value }))}
          rows={3}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor={descItId}>Descripción (italiano)</Label>
        <Textarea
          id={descItId}
          value={values.description_it}
          onChange={(e) => setValues((v) => ({ ...v, description_it: e.target.value }))}
          rows={3}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor={coverId}>Portada</Label>
        {coverPreview && (
          <img
            src={coverPreview}
            alt="Vista previa"
            className="w-24 h-auto rounded border object-cover"
          />
        )}
        <Input
          id={coverId}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleCoverChange}
          required={!isEdit}
        />
        {isEdit && <p className="text-xs text-muted-foreground">Deja vacío para mantener la actual.</p>}
      </div>
      <div className="grid gap-2">
        <Label htmlFor={yearId}>Año</Label>
        <Input
          id={yearId}
          type="number"
          min={1900}
          max={2100}
          value={values.year}
          onChange={(e) => setValues((v) => ({ ...v, year: e.target.value }))}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label>Acción</Label>
        <Select
          value={values.action}
          onValueChange={(v) => setValues((prev) => ({ ...prev, action: v as BookAction }))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="buy">Comprar (enlaces)</SelectItem>
            <SelectItem value="download">Descargar</SelectItem>
            <SelectItem value="not-digitized">No digitalizado</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {values.action === 'buy' && (
        <>
          <div className="grid gap-2">
            <Label>Enlace compra VES</Label>
            <Input
              value={values.buy_ves}
              onChange={(e) => setValues((v) => ({ ...v, buy_ves: e.target.value }))}
              placeholder="https://..."
              type="url"
            />
          </div>
          <div className="grid gap-2">
            <Label>Enlace compra USD</Label>
            <Input
              value={values.buy_usd}
              onChange={(e) => setValues((v) => ({ ...v, buy_usd: e.target.value }))}
              placeholder="https://..."
              type="url"
            />
          </div>
        </>
      )}
      {values.action === 'download' && (
        <div className="grid gap-2">
          <Label>URL de descarga</Label>
          <Input
            value={values.download_url}
            onChange={(e) => setValues((v) => ({ ...v, download_url: e.target.value }))}
            placeholder="https://..."
            type="url"
          />
        </div>
      )}
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
      <div className="flex gap-2 justify-end pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={saving}>
          Cancelar
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? 'Guardando…' : isEdit ? 'Guardar cambios' : 'Añadir libro'}
        </Button>
      </div>
    </form>
  );
}
