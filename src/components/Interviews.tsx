import { useInterviews } from '@/hooks/useInterviews';
import { useLanguage } from '@/i18n/LanguageContext';
import { motion } from 'framer-motion';
import { ArrowRight, PlayCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

export function Interviews() {
  const { t, lang } = useLanguage();
  const { interviews } = useInterviews();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || interviews.length === 0) {
    return null; // O un placeholder
  }

  const featuredInterview = interviews.find((i) => i.is_featured) || interviews[0];

  // Extraer ID de YouTube
  const getYoutubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYoutubeVideoId(featuredInterview.youtube_url);

  return (
    <section id="entrevistas" className="relative py-32 bg-section-alt overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
          
          {/* Left: Video Embed */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Decorative background for the video */}
            <div className="absolute -inset-4 bg-black/5 rounded-2xl transform -rotate-2 -z-10 transition-transform duration-500 hover:rotate-0" />
            <div className="aspect-video rounded-xl overflow-hidden border border-border shadow-[0_8px_30px_rgb(0,0,0,0.08)] bg-black p-1">
              {videoId ? (
                <iframe 
                  width="100%" 
                  height="100%" 
                  src={`https://www.youtube.com/embed/${videoId}`} 
                  title={featuredInterview.title[lang]} 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen 
                  className="w-full h-full rounded-lg" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <PlayCircle className="text-muted-foreground opacity-50" size={48} />
                </div>
              )}
            </div>
          </motion.div>

          {/* Right: Content */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary text-primary-foreground mb-3 text-xs font-medium tracking-widest uppercase shadow-sm">
              <PlayCircle size={12} />
              <span>{t.interviews.badge}</span>
            </div>
            
            <h3 className="font-display text-3xl md:text-3xl text-foreground leading-tight mb-6">
              {featuredInterview.title[lang]}
            </h3>
            
            <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
              {featuredInterview.description[lang]}
            </p>

            <a 
              href="/entrevistas" 
              className="inline-flex items-center gap-3 px-8 py-4 bg-foreground text-background hover:bg-primary transition-colors duration-300 uppercase tracking-widest text-sm font-semibold rounded group"
            >
              {t.interviews.cta}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
