import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { GalleryPhoto } from '@/hooks/useGallery';
import { supabase } from '@/lib/supabase';
import { Image as ImageIcon, Loader2, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

export interface GalleryFormProps {
  photo?: GalleryPhoto | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const CATEGORIES = [
  { id: 1, name: 'Homenajes' },
  { id: 2, name: 'Mi familia' },
  { id: 3, name: 'Vida universitaria' },
  { id: 4, name: 'Mis viajes' },
  { id: 5, name: 'Varios' },
  { id: 6, name: 'Condecoraciones' },
];

export function GalleryForm({ photo, onSuccess, onCancel }: GalleryFormProps) {
  const [categoryId, setCategoryId] = useState<string>(photo ? String(photo.category_id) : '1');
  const [text, setText] = useState(photo?.text || '');
  const [videoUrl, setVideoUrl] = useState(photo?.video_url || '');
  const [links, setLinks] = useState<{text: string, url: string}[]>(photo?.links || []);
  
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = !!photo;

  const uploadImage = async (recordId: string): Promise<string> => {
    if (!file) {
      if (isEdit && photo?.image_url) {
        // Return original path (strip public URL prefix to get the storage path)
        // Public URLs look like: .../storage/v1/object/public/gallery-images/recordId-time.jpg
        const parts = photo.image_url.split('/gallery-images/');
        if (parts.length === 2) return parts[1];
        return photo.image_url;
      }
      throw new Error('Debes seleccionar una imagen.');
    }

    const ext = file.name.split('.').pop();
    const filePath = `${recordId}-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('gallery-images')
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;
    return filePath;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!text.trim()) {
      setError('Por favor, ingresa una descripción.');
      return;
    }
    
    if (!file && !isEdit) {
      setError('Debes seleccionar una imagen para la foto nueva.');
      return;
    }

    const generateId = () => crypto.randomUUID();
    const recordId = isEdit ? photo!.id : generateId();

    setSaving(true);
    try {
      let imagePath: string;
      try {
        imagePath = await uploadImage(recordId);
      } catch (err: unknown) {
        throw new Error((err as Error).message || 'Error al subir la imagen.');
      }

      const rowData = {
        id: recordId,
        original_id: isEdit ? photo!.original_id : 9999, // New items get 9999 to go to the end, or we could fetch max
        category_id: parseInt(categoryId, 10),
        text,
        image_url: imagePath,
        video_url: videoUrl || null,
        links: links.length > 0 ? links : null,
      };

      const { error: upsertError } = await (supabase as any)
        .from('gallery')
        .upsert(rowData);

      if (upsertError) throw upsertError;
      
      onSuccess();
    } catch (err: unknown) {
      console.error(err);
      setError((err as Error).message || 'Ocurrió un error al guardar la foto.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!isEdit || !photo) return;
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta foto?')) return;
    
    setDeleting(true);
    setError(null);
    try {
      const { error: deleteError } = await (supabase as any)
        .from('gallery')
        .delete()
        .eq('id', photo.id);

      if (deleteError) throw deleteError;
      
      // Optionally delete image from storage to save space
      const parts = photo.image_url.split('/gallery-images/');
      if (parts.length === 2) {
         await supabase.storage.from('gallery-images').remove([parts[1]]);
      }
      
      onSuccess();
    } catch (err: unknown) {
      console.error(err);
      setError((err as Error).message || 'Ocurrió un error al eliminar la foto.');
      setDeleting(false);
    }
  };

  const addLink = () => {
    setLinks([...links, { text: '', url: '' }]);
  };

  const updateLink = (index: number, field: 'text' | 'url', value: string) => {
    const newLinks = [...links];
    newLinks[index][field] = value;
    setLinks(newLinks);
  };

  const removeLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  return (
    <form id="gallery-form" onSubmit={handleSave} className="flex flex-col sm:flex-row h-full w-full bg-background overflow-hidden">
      {/* Columna Izquierda: Imagen y Categoría (Fija) */}
      <div className="w-full sm:w-2/5 sm:max-w-[320px] bg-muted/10 border-r border-border/50 px-6 py-6 flex flex-col justify-between shrink-0 overflow-y-auto">
        <div className="space-y-6">
          <div className="space-y-3">
            <Label className="text-foreground font-semibold text-lg">Imagen</Label>
            
            <Card className="border-dashed bg-background/50 border-2 overflow-hidden hover:bg-muted/50 transition-all duration-300 group rounded-[2rem] relative h-[260px] shadow-sm">
              <div className="absolute inset-0 p-4 flex flex-col items-center justify-center gap-4 text-center">
                {(file || (isEdit && photo?.image_url)) ? (
                  <div className="relative group/image h-full w-full flex items-center justify-center">
                    <img 
                      src={file ? URL.createObjectURL(file) : photo?.image_url} 
                      alt="Preview" 
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
                      <ImageIcon className="h-7 w-7" />
                    </div>
                    <div>
                      <span className="font-medium text-foreground block mb-1 text-sm">Subir imagen</span>
                      <span className="text-[10px] opacity-70">JPG, PNG, WEBP</span>
                    </div>
                  </div>
                )}
                <Input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  required={!isEdit}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </Card>
          </div>

          <div className="space-y-3 pt-4">
            <Label className="text-foreground font-semibold">Categoría</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger className="h-12 bg-background border-border/50 text-base shadow-sm rounded-xl">
                <SelectValue placeholder="Selecciona la categoría" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(cat => (
                  <SelectItem key={cat.id} value={String(cat.id)}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {isEdit && (
          <div className="mt-8 pt-6 border-t border-border/50">
            <Button
              type="button"
              variant="outline"
              className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors gap-2 font-medium h-11 rounded-xl shadow-sm"
              onClick={handleDelete}
              disabled={saving || deleting}
            >
              {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              Eliminar Foto
            </Button>
          </div>
        )}
      </div>

      {/* Columna Derecha: Formulario scrolleable */}
      <div className="flex-1 flex flex-col bg-background relative overflow-hidden">
        <div className="flex-1 overflow-y-auto px-8 sm:px-10 py-8 space-y-8">
          
          {error && (
            <div className="p-4 bg-destructive/10 text-destructive border border-destructive/20 rounded-xl text-sm font-medium animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Descripción (Texto)</Label>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Escribe la historia o descripción de la foto..."
              className="min-h-[120px] bg-muted/20 border-border/50 text-base resize-y rounded-xl"
            />
          </div>
          
          <div className="space-y-3">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Video de YouTube (Opcional)</Label>
            <Input
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="Ej. https://www.youtube.com/watch?v=..."
              className="h-12 bg-muted/20 border-border/50 text-base rounded-xl"
            />
          </div>

          <div className="pt-4 border-t border-border/30">
            <div className="flex items-center justify-between mb-4">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Enlaces Adicionales (Opcional)</Label>
              <Button type="button" variant="outline" size="sm" onClick={addLink} className="h-8 gap-1 rounded-full">
                <Plus className="h-3 w-3" /> Añadir Enlace
              </Button>
            </div>
            
            {links.length === 0 && (
              <p className="text-sm text-muted-foreground italic">No hay enlaces adicionales.</p>
            )}

            <div className="space-y-4">
              {links.map((link, index) => (
                <div key={index} className="flex gap-3 items-start animate-in slide-in-from-left-4">
                  <div className="flex-1 space-y-3">
                    <Input
                      placeholder="Texto del botón (ej. Ver Reseña)"
                      value={link.text}
                      onChange={(e) => updateLink(index, 'text', e.target.value)}
                      className="bg-muted/20 border-border/50 rounded-xl"
                    />
                    <Input
                      placeholder="URL (ej. https://...)"
                      value={link.url}
                      onChange={(e) => updateLink(index, 'url', e.target.value)}
                      className="bg-muted/20 border-border/50 rounded-xl"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeLink(index)}
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive shrink-0 mt-1 rounded-xl"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-muted/20 border-t border-border/40 shrink-0 flex items-center justify-end gap-3 z-10">
          <Button type="button" variant="outline" onClick={onCancel} disabled={saving || deleting} className="h-11 px-6 font-medium rounded-full border-border/60">
            Cancelar
          </Button>
          <Button type="submit" disabled={saving || deleting} className="h-11 px-8 gap-2 font-medium rounded-full shadow-md hover:shadow-lg transition-all">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {isEdit ? 'Guardar Cambios' : 'Añadir Foto'}
          </Button>
        </div>
      </div>
    </form>
  );
}
