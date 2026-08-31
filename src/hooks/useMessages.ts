import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface Message {
  id: string | number;
  created_at: string;
  name: string;
  email: string;
  message: string;
  is_read?: boolean;
}

export function useMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Local storage fallback for read state if DB doesn't have is_read column yet
  const [localReadIds, setLocalReadIds] = useState<Set<string | number>>(() => {
    try {
      const stored = localStorage.getItem('read_messages');
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      if (!supabase) return;
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const markAsRead = async (id: string | number) => {
    const newReadIds = new Set(localReadIds);
    newReadIds.add(id);
    setLocalReadIds(newReadIds);
    localStorage.setItem('read_messages', JSON.stringify(Array.from(newReadIds)));
    
    setMessages(prev => prev.map(m => m.id === id ? { ...m, is_read: true } : m));
    
    try {
      if (supabase) {
        await supabase.from('messages').update({ is_read: true }).eq('id', id);
      }
    } catch (e) {
      // Ignoramos el error, probablemente la columna is_read no exista todavía
    }
  };

  const enrichedMessages = messages.map(msg => ({
    ...msg,
    is_read: msg.is_read || localReadIds.has(msg.id)
  }));

  const unreadCount = enrichedMessages.filter(m => !m.is_read).length;

  return { messages: enrichedMessages, isLoading, refetch: fetchMessages, markAsRead, unreadCount };
}
