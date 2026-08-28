import { motion } from 'framer-motion';
import { User, Mail, MessageSquare, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import contactBg from '@/assets/contact-bg.jpg';
import { useLanguage } from '@/i18n/LanguageContext';
import { supabase } from '@/lib/supabase';

export function Contact() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('idle');
    
    if (!supabase) {
      console.error('Supabase client not initialized. Check your environment variables.');
      setStatus('error');
      setIsSubmitting(false);
      return;
    }

    try {
      const { error } = await supabase
        .from('messages')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            message: formData.message,
          }
        ]);

      if (error) throw error;
      
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      console.error('Error submitting form:', err);
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contacto" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${contactBg})` }} />
        <div className="absolute inset-0 bg-hero/90" />
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-8 md:p-14 shadow-2xl relative overflow-hidden"
          >
            {/* Soft background glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
            
            <h2 className="font-display text-4xl md:text-5xl text-white mb-10 text-center relative z-10">
              {t.contact.title}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
              <div className="relative group">
                <User className="absolute left-0 top-3 text-white/40 group-focus-within:text-primary transition-colors" size={20} />
                <input 
                  type="text" 
                  placeholder={t.contact.name} 
                  value={formData.name} 
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                  className="w-full bg-transparent border-b border-white/20 pl-10 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-primary transition-colors" 
                  required 
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="relative group">
                <Mail className="absolute left-0 top-3 text-white/40 group-focus-within:text-primary transition-colors" size={20} />
                <input 
                  type="email" 
                  placeholder={t.contact.email} 
                  value={formData.email} 
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                  className="w-full bg-transparent border-b border-white/20 pl-10 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-primary transition-colors" 
                  required 
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="relative group">
                <MessageSquare className="absolute left-0 top-3 text-white/40 group-focus-within:text-primary transition-colors" size={20} />
                <textarea 
                  placeholder={t.contact.message} 
                  value={formData.message} 
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })} 
                  rows={4} 
                  className="w-full bg-transparent border-b border-white/20 pl-10 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-primary transition-colors resize-none" 
                  required 
                  disabled={isSubmitting}
                />
              </div>

              {/* Status Messages */}
              {status === 'success' && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-green-400 bg-green-400/10 p-4 rounded-lg border border-green-400/20">
                  <CheckCircle2 size={18} />
                  <p className="text-sm">Mensaje enviado correctamente. ¡Gracias por contactarme!</p>
                </motion.div>
              )}
              
              {status === 'error' && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-red-400 bg-red-400/10 p-4 rounded-lg border border-red-400/20">
                  <AlertCircle size={18} />
                  <p className="text-sm">Hubo un error al enviar el mensaje. Inténtalo de nuevo más tarde.</p>
                </motion.div>
              )}

              <button 
                type="submit" 
                disabled={isSubmitting} 
                className="btn-primary w-full mt-4 flex items-center justify-center gap-2"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : null}
                {isSubmitting ? 'Enviando...' : t.contact.send}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
