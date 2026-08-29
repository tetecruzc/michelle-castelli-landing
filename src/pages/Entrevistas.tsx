import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { useInterviews } from '@/hooks/useInterviews';
import { useLanguage } from '@/i18n/LanguageContext';
import { AnimatePresence, motion } from 'framer-motion';
import { ExternalLink, Youtube } from 'lucide-react';

const Entrevistas = () => {
  const { lang, t } = useLanguage();
  const { interviews, loading } = useInterviews();

  // Helper to extract YouTube video ID for preview
  const getYoutubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <div className="min-h-screen flex flex-col bg-section-alt/30">
      <Header />

      {/* Premium Hero Banner */}
      <div className="relative bg-hero text-hero-foreground pt-36 pb-20 overflow-hidden shadow-lg">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/50 via-transparent to-transparent" />
        
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          {/* <a href="/" className="inline-flex items-center gap-2 text-hero-foreground/70 hover:text-white transition-all duration-300 mb-8 text-sm group">
            <span className="group-hover:-translate-x-1 transition-transform duration-300">
              <ArrowLeft size={16} />
            </span>
            {t.nav.inicio}
          </a> */}

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/20 text-red-100 mb-6 text-xs font-semibold tracking-widest uppercase border border-red-500/30 backdrop-blur-md shadow-sm">
                <Youtube size={14} />
                <span>Media</span>
              </div>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight text-white">
                {t.interviews.pageTitle}
              </h1>
              <p className="text-hero-foreground/80 text-lg md:text-xl font-light leading-relaxed">
                {t.interviews.pageSubtitle}
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 py-16 md:py-24">
        <div className="container mx-auto px-6 max-w-7xl">
          {loading ? (
             <div className="flex flex-col items-center justify-center py-32 opacity-50">
               <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
               <p className="text-muted-foreground animate-pulse">Cargando contenido...</p>
             </div>
          ) : (
            <div className="grid gap-16 grid-cols-1 max-w-7xl mx-auto">
              <AnimatePresence>
                {interviews.map((interview, i) => {
                  const videoId = getYoutubeVideoId(interview.youtube_url);
                  return (
                    <motion.div
                      key={interview.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                      className="group"
                    >
                      <div className={`flex flex-col gap-8 lg:gap-12 items-center ${i % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
                        {/* Video Player Container */}
                        <div className="w-full md:w-[45%] shrink-0">
                          <div className="relative aspect-video rounded-xl overflow-hidden shadow-[0_10px_30px_-15px_rgba(0,0,0,0.3)] group-hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.4)] transition-all duration-700 group-hover:-translate-y-1">
                            {videoId ? (
                              <iframe
                                src={`https://www.youtube.com/embed/${videoId}`}
                                title={interview.title[lang]}
                                className="absolute inset-0 w-full h-full border-0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center bg-muted">
                                <Youtube className="w-12 h-12 text-muted-foreground opacity-50" />
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="w-full md:w-[55%] flex flex-col justify-center py-4">
                          {/* Editorial Date */}
                          <div className="flex items-center gap-4 mb-5">
                            <span className="w-10 h-px bg-primary/40 transition-all duration-500 group-hover:w-16"></span>
                            <span className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground group-hover:text-primary transition-colors">
                              {interview.date_month_year}
                            </span>
                          </div>
                          
                          {/* Title */}
                          <h3 className="font-display font-medium text-3xl md:text-4xl leading-[1.15] text-foreground mb-6 group-hover:text-primary transition-colors duration-500">
                            {interview.title[lang]}
                          </h3>
                          
                          {/* Description */}
                          <p className="text-muted-foreground/90 leading-relaxed  text-lg font-light">
                            {interview.description[lang]}
                          </p>

                          {/* Link */}
                          {interview.read_more_url && (
                            <div className="mt-3">
                              <a
                                href={interview.read_more_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background hover:bg-primary transition-colors duration-300 uppercase tracking-widest text-xs font-semibold rounded group"
                              >
                                <span>{t.interviews.readMore}</span>
                                <ExternalLink size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}

          {!loading && interviews.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-24 h-24 rounded-full bg-muted/50 flex items-center justify-center mb-6">
                <Youtube className="text-muted-foreground w-12 h-12 opacity-50" />
              </div>
              <h3 className="text-2xl font-display font-semibold text-foreground mb-2">
                Próximamente
              </h3>
              <p className="text-muted-foreground max-w-sm">
                Aún no hay entrevistas publicadas en este idioma. Vuelve pronto para descubrir nuevo contenido.
              </p>
            </motion.div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Entrevistas;
