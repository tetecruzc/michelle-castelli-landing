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
    <div className="flex flex-col h-full bg-background rounded-xl border border-border/50 shadow-2xl overflow-hidden">
      <div className="p-6 bg-muted/20 border-b border-border/40 shrink-0">
        <h2 className="text-2xl font-display font-semibold flex items-center gap-3">
          <ImageIcon className="text-primary h-6 w-6" />
          {isEdit ? 'Editar foto de galería' : 'Nueva foto de galería'}
        </h2>
        <p className="text-sm text-muted-foreground mt-2">
          {isEdit ? 'Modifica los detalles de la foto existente.' : 'Agrega una nueva foto al álbum.'}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <form id="gallery-form" onSubmit={handleSave} className="p-6">
          <div className="max-w-4xl mx-auto space-y-8">
            {error && (
              <div className="p-4 bg-destructive/10 text-destructive border border-destructive/20 rounded-xl text-sm font-medium animate-in fade-in slide-in-from-top-2">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Image & Details */}
              <div className="lg:col-span-5 space-y-6">
                <Card className="border-border/40 shadow-sm bg-muted/10 overflow-hidden p-6 space-y-4">
                  <div className="space-y-3">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Imagen</Label>
                    
                    {/* Image Preview */}
                    {(file || (isEdit && photo?.image_url)) && (
                      <div className="relative aspect-video rounded-xl overflow-hidden bg-black/5 border border-border/50">
                        <img 
                          src={file ? URL.createObjectURL(file) : photo?.image_url} 
                          alt="Preview" 
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}

                    <div className="relative group">
                      <div className="absolute inset-0 bg-primary/5 rounded-xl border-2 border-dashed border-primary/20 pointer-events-none transition-colors group-hover:border-primary/40 group-hover:bg-primary/10" />
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        className="h-24 opacity-0 w-full cursor-pointer relative z-10"
                      />
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-muted-foreground">
                        <ImageIcon className="h-8 w-8 mb-2 opacity-50" />
                        <span className="text-sm font-medium">
                          {file ? file.name : (isEdit ? 'Seleccionar nueva imagen' : 'Seleccionar archivo de imagen')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Categoría</Label>
                    <Select value={categoryId} onValueChange={setCategoryId}>
                      <SelectTrigger className="h-12 bg-muted/30 border-border/50 text-base">
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
                </Card>
              </div>

              {/* Right Column: Content */}
              <div className="lg:col-span-7 space-y-6">
                <Card className="border-border/40 shadow-sm bg-muted/10 overflow-hidden p-6 space-y-6">
                  <div className="space-y-3">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Descripción (Texto)</Label>
                    <Textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Escribe la historia o descripción de la foto..."
                      className="min-h-[120px] bg-background border-border/50 text-base resize-y"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Video de YouTube (Opcional)</Label>
                    <Input
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="Ej. https://www.youtube.com/watch?v=..."
                      className="h-12 bg-background border-border/50 text-base"
                    />
                  </div>
                </Card>

                <Card className="border-border/40 shadow-sm bg-muted/10 overflow-hidden p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Enlaces Adicionales (Opcional)</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addLink} className="h-8 gap-1">
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
                            className="bg-background border-border/50"
                          />
                          <Input
                            placeholder="URL (ej. https://...)"
                            value={link.url}
                            onChange={(e) => updateLink(index, 'url', e.target.value)}
                            className="bg-background border-border/50"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeLink(index)}
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive shrink-0 mt-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
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
            {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            Eliminar Foto
          </Button>
        ) : <div />}
        
        <div className="flex items-center gap-3">
          <Button type="button" variant="outline" onClick={onCancel} disabled={saving || deleting} className="h-11 px-6 font-medium">
            Cancelar
          </Button>
          <Button type="submit" form="gallery-form" disabled={saving || deleting} className="h-11 px-8 gap-2 font-medium">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {isEdit ? 'Guardar Cambios' : 'Añadir Foto'}
          </Button>
        </div>
      </div>
    </div>
  );
}
