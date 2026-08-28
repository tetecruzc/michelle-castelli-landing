import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Interview } from '@/data/interviews';
import { useToast } from '@/hooks/use-toast';

export const useInterviews = () => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      const { data, error: err } = await supabase
        .from('interviews')
        .select('*')
        .order('display_order', { ascending: true });

      if (err) throw err;
      
      setInterviews(data as Interview[]);
    } catch (err: any) {
      console.error('Error fetching interviews:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();

    const channel = supabase
      .channel('interviews-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'interviews' },
        (payload) => {
          fetchInterviews();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addInterview = async (interview: Omit<Interview, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('interviews')
        .insert([interview])
        .select()
        .single();

      if (error) throw error;
      toast({ title: 'Entrevista creada correctamente.' });
      return data;
    } catch (err: any) {
      toast({ title: 'Error al crear la entrevista.', description: err.message, variant: 'destructive' });
      throw err;
    }
  };

  const updateInterview = async (id: string, updates: Partial<Omit<Interview, 'id' | 'created_at' | 'updated_at'>>) => {
    try {
      const { data, error } = await supabase
        .from('interviews')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      toast({ title: 'Entrevista actualizada.' });
      return data;
    } catch (err: any) {
      toast({ title: 'Error al actualizar.', description: err.message, variant: 'destructive' });
      throw err;
    }
  };

  const deleteInterview = async (id: string) => {
    try {
      const { error } = await supabase.from('interviews').delete().eq('id', id);
      if (error) throw error;
      toast({ title: 'Entrevista eliminada.' });
    } catch (err: any) {
      toast({ title: 'Error al eliminar.', description: err.message, variant: 'destructive' });
      throw err;
    }
  };

  const updateOrder = async (orderedIds: string[]) => {
    try {
      const promises = orderedIds.map((id, index) => 
        supabase.from('interviews').update({ display_order: index }).eq('id', id)
      );
      
      await Promise.all(promises);
      toast({ title: 'Orden actualizado correctamente.' });
      fetchInterviews();
    } catch (err: any) {
      toast({ title: 'Error al actualizar el orden.', description: err.message, variant: 'destructive' });
      throw err;
    }
  };

  const setFeaturedInterview = async (id: string) => {
    try {
      // 1. Quitar destacado a todas
      const { error: resetError } = await supabase
        .from('interviews')
        .update({ is_featured: false })
        .eq('is_featured', true);
        
      if (resetError) throw resetError;

      // 2. Destacar la nueva
      const { error: setError } = await supabase
        .from('interviews')
        .update({ is_featured: true })
        .eq('id', id);

      if (setError) throw setError;
      
      toast({ title: 'Entrevista destacada actualizada.' });
      fetchInterviews();
    } catch (err: any) {
      toast({ title: 'Error al destacar.', description: err.message, variant: 'destructive' });
      throw err;
    }
  };

  return {
    interviews,
    loading,
    error,
    addInterview,
    updateInterview,
    deleteInterview,
    updateOrder,
    setFeaturedInterview,
    refresh: fetchInterviews,
  };
};
