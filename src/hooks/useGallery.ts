import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface GalleryLink {
  text: string;
  url: string;
}

export interface GalleryPhoto {
  id: string;
  original_id: number;
  category_id: number;
  text: string;
  image_url: string;
  video_url: string | null;
  links: GalleryLink[] | null;
  created_at: string;
}

export function useGallery() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('gallery' as any)
        .select('*')
        .order('category_id', { ascending: true })
        .order('original_id', { ascending: true });

      if (error) {
        console.error('Error fetching gallery photos:', error);
        return;
      }

      // Convert image paths to public URLs
      const photosWithUrls = await Promise.all(
        (data || []).map(async (photo: any) => {
          const { data: urlData } = supabase.storage
            .from('gallery-images')
            .getPublicUrl(photo.image_url);

          return {
            ...photo,
            image_url: urlData.publicUrl,
          };
        })
      );

      setPhotos(photosWithUrls as GalleryPhoto[]);
    } catch (error) {
      console.error('Error in fetchPhotos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return { photos, isLoading, refetch: fetchPhotos };
}

export async function updateGalleryOrder(photos: { id: string; original_id: number }[]): Promise<void> {
  const client = supabase;
  if (!client) return;
  
  await Promise.all(
    photos.map(p => 
      client.from('gallery' as any).update({ original_id: p.original_id }).eq('id', p.id)
    )
  );
}
